package com.web.service;

import com.google.gson.*;
import com.web.entity.Invoice;
import com.web.entity.InvoiceResTable;
import com.web.entity.Product;
import com.web.entity.ResTable;
import com.web.repository.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.*;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ProductRepository productRepository;
    private final ResTableRepository resTableRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceResTableRepository invoiceResTableRepository;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public ChatService(
            ProductRepository productRepository,
            ResTableRepository resTableRepository,
            InvoiceRepository invoiceRepository,
            InvoiceResTableRepository invoiceResTableRepository
    ) {
        this.productRepository = productRepository;
        this.resTableRepository = resTableRepository;
        this.invoiceRepository = invoiceRepository;
        this.invoiceResTableRepository = invoiceResTableRepository;
    }

    public String chatWithGemini(String userMessage) {
        try {
            // 1. Trích ngày từ tin nhắn người dùng
            Date sqlDate = extractDateFromText(userMessage);

            // 2. Dữ liệu menu
            List<Product> products = productRepository.findAll();
            StringBuilder menu = new StringBuilder("📋 Menu nhà hàng:\n");
            for (Product p : products) {
                menu.append("- ").append(p.getName()).append(": ").append(p.getPrice()).append(" VNĐ\n");
            }

            // 3. Dữ liệu bàn theo ngày
            String tableStatus = generateTableStatusSummary(sqlDate);

            // 4. Ghép prompt
            String prompt = """
                Bạn là trợ lý AI của nhà hàng, trả lời bằng tiếng Việt, ngắn gọn, thân thiện.
                Các khả năng chính:
                - Gợi ý món ăn theo menu thật (bên dưới)
                - Trả lời tình trạng bàn đã đặt / còn trống theo ngày cụ thể
                - Hướng dẫn đặt bàn (hỏi ngày, giờ, số người, tên, SĐT)

                Dưới đây là dữ liệu thực tế:

                %s

                %s

                Câu hỏi của khách: %s
                """.formatted(menu, tableStatus, userMessage);

            // 5. Gửi request Gemini
            JsonObject root = new JsonObject();
            JsonArray contents = new JsonArray();
            JsonObject userMsg = new JsonObject();
            userMsg.addProperty("role", "user");

            JsonArray parts = new JsonArray();
            JsonObject partText = new JsonObject();
            partText.addProperty("text", prompt);
            parts.add(partText);

            userMsg.add("parts", parts);
            contents.add(userMsg);
            root.add("contents", contents);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL + "?key=" + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(root.toString()))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JsonObject json = JsonParser.parseString(response.body()).getAsJsonObject();

            if (json.has("candidates")) {
                return json.getAsJsonArray("candidates")
                        .get(0).getAsJsonObject()
                        .getAsJsonObject("content")
                        .getAsJsonArray("parts")
                        .get(0).getAsJsonObject()
                        .get("text").getAsString();
            } else if (json.has("error")) {
                return "❌ Lỗi từ Gemini: " + json.getAsJsonObject("error").get("message").getAsString();
            } else {
                return "⚠️ Không nhận được phản hồi từ AI.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Lỗi hệ thống: " + e.getMessage();
        }
    }

    // ✅ Sinh báo cáo bàn ăn theo ngày (dùng java.sql.Date)
    public String generateTableStatusSummary(Date bookingDate) {
        List<Invoice> invoices = invoiceRepository.findAllByBookingDate(bookingDate);
        int totalGuests = invoices.size(); // 1 invoice = 1 lượt khách

        List<InvoiceResTable> invoiceTables = invoiceResTableRepository.findByInvoice_BookingDate(bookingDate);

        Set<Long> bookedTableIds = invoiceTables.stream()
                .map(ir -> ir.getResTable().getId())
                .collect(Collectors.toSet());

        List<ResTable> allTables = resTableRepository.findAll();

        List<ResTable> bookedTables = allTables.stream()
                .filter(t -> bookedTableIds.contains(t.getId()))
                .toList();

        List<ResTable> availableTables = allTables.stream()
                .filter(t -> !bookedTableIds.contains(t.getId()))
                .toList();

        return """
            🪑 Tình trạng bàn vào ngày %s:
            - Số lượt khách đặt: %d
            - Bàn đã đặt: %s
            - Bàn còn trống: %s
            """.formatted(
                bookingDate.toString(),
                totalGuests,
                bookedTables.stream().map(t -> "Bàn " + t.getName() + " (Tầng " + t.getFloor() + ")").collect(Collectors.joining(", ")),
                availableTables.stream().map(t -> "Bàn " + t.getName() + " (Tầng " + t.getFloor() + ")").collect(Collectors.joining(", "))
        );
    }

    // ✅ Trích ngày từ chuỗi người dùng → java.sql.Date
    public Date extractDateFromText(String text) {
        try {
            text = text.toLowerCase();

            // Định dạng: ngày 6/8, 06-08, 06/08/2025...
            Pattern p = Pattern.compile("(\\d{1,2})[\\/-](\\d{1,2})(?:[\\/-](\\d{4}))?");
            Matcher m = p.matcher(text);
            if (m.find()) {
                int day = Integer.parseInt(m.group(1));
                int month = Integer.parseInt(m.group(2));
                int year = (m.group(3) != null) ? Integer.parseInt(m.group(3)) : LocalDate.now().getYear();

                LocalDate date = LocalDate.of(year, month, day);
                return Date.valueOf(date);
            }

            // Các từ khóa phổ biến
            if (text.contains("hôm nay")) return Date.valueOf(LocalDate.now());
            if (text.contains("ngày mai")) return Date.valueOf(LocalDate.now().plusDays(1));
            if (text.contains("ngày kia")) return Date.valueOf(LocalDate.now().plusDays(2));

        } catch (Exception e) {
            e.printStackTrace();
        }

        // Nếu không rõ thì mặc định hôm nay
        return Date.valueOf(LocalDate.now());
    }
}
