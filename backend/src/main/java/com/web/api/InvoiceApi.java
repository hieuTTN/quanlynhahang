package com.web.api;

import com.web.dto.request.InvoiceRequest;
import com.web.dto.request.ProductDtoInvoice;
import com.web.entity.Invoice;
import com.web.enums.PayStatus;
import com.web.enums.PayType;
import com.web.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceApi {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/user/create")
    public ResponseEntity<?> add(@RequestBody InvoiceRequest invoiceRequest){
        Invoice result = invoiceService.create(invoiceRequest);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/user/my-invoice")
    public ResponseEntity<?> myHd() {
        List<Invoice> result = invoiceService.findByUser();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/admin/find-by-id")
    public ResponseEntity<?> findById(@RequestParam Long id) {
        Invoice result = invoiceService.findById(id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/admin/find-all")
    public ResponseEntity<?> findAll(@RequestParam(value = "from",required = false) Date from,
                                     @RequestParam(value = "to",required = false) Date to, Pageable pageable){
        Page<Invoice> result = invoiceService.findAllFull(from, to,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/admin/add-service")
    public ResponseEntity<?> addService(@RequestBody List<ProductDtoInvoice> list, @RequestParam Long idInvoice){
        Invoice result = invoiceService.addMoreDetail(idInvoice, list);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update-status")
    public ResponseEntity<?> updateStatus(@RequestParam Long idInvoice, @RequestParam PayStatus payStatus){
        Invoice result = invoiceService.updateStatus(payStatus, idInvoice);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
}
