package com.web.service;

import com.web.dto.request.InvoiceRequest;
import com.web.entity.*;
import com.web.enums.PayStatus;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Component
public class InvoiceService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private InvoiceResTableRepository invoiceResTableRepository;

    @Autowired
    private HistoryPayRepository historyPayRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private CartService cartService;

    public Invoice create(InvoiceRequest invoiceRequest) {
        User user = userUtils.getUserWithAuthority();
        List<Cart> list = cartRepository.findByUser(user.getId());
        if(invoiceRequest.getVnpOrderInfo() == null){
            throw new MessageException("vnpay order infor require");
        }
        if(historyPayRepository.findByRequestId(invoiceRequest.getVnpOrderInfo()).isPresent()){
            throw new MessageException("Đơn hàng đã được thanh toán");
        }
        int paymentStatus = vnPayService.orderReturnByUrl(invoiceRequest.getUrlVnpay());
        if(paymentStatus != 1){
            throw new MessageException("Thanh toán thất bại");
        }
        Double totalAmount = cartService.totalAmountCart();
        Invoice invoice = new Invoice();
        invoice.setCreatedTime(new Time(System.currentTimeMillis()));
        invoice.setCreatedDate(new Date(System.currentTimeMillis()));
        invoice.setPhone(invoiceRequest.getPhone());
        invoice.setBookDate(invoiceRequest.getBookDate());
        invoice.setFullName(invoiceRequest.getFullName());
        invoice.setNote(invoiceRequest.getNote());
        invoice.setUser(user);
        invoice.setPayStatus(PayStatus.DA_THANH_TOAN);

        if(invoiceRequest.getVoucherId() != null){
            Voucher voucher = voucherRepository.findById(invoiceRequest.getVoucherId()).get();
            totalAmount -= voucher.getDiscount();
        }
        invoice.setTotalAmount(totalAmount);
        invoiceRepository.save(invoice);
        for(Cart c : list){
            InvoiceDetail invoiceDetail = new InvoiceDetail();
            invoiceDetail.setInvoice(invoice);
            invoiceDetail.setPrice(c.getProduct().getPrice());
            invoiceDetail.setQuantity(c.getQuantity());
            invoiceDetail.setProduct(c.getProduct());
            invoiceDetailRepository.save(invoiceDetail);
        }
        for(Long id : invoiceRequest.getListTableId()){
            InvoiceResTable invoiceResTable = new InvoiceResTable();
            invoiceResTable.setInvoice(invoice);
            ResTable resTable = new ResTable();
            resTable.setId(id);
            invoiceResTable.setResTable(resTable);
            invoiceResTableRepository.save(invoiceResTable);
        }
        HistoryPay historyPay = new HistoryPay();
        historyPay.setRequestId(invoiceRequest.getVnpOrderInfo());
        historyPay.setCreatedDate(new Date(System.currentTimeMillis()));
        historyPay.setCreatedTime(new Time(System.currentTimeMillis()));
        historyPay.setTotalAmount(totalAmount);
        historyPayRepository.save(historyPay);
        cartService.removeCart();
        return invoice;
    }

    public List<Invoice> findByUser() {
        List<Invoice> list = invoiceRepository.findByUser(userUtils.getUserWithAuthority().getId());
        return list;
    }


}
