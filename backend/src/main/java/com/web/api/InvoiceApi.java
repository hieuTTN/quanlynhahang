package com.web.api;

import com.web.dto.request.InvoiceRequest;
import com.web.entity.Invoice;
import com.web.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


}
