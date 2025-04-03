package com.web.api;

import com.web.dto.request.PaymentRequest;
import com.web.dto.response.ResponsePayment;
import com.web.entity.Voucher;
import com.web.exception.MessageException;
import com.web.repository.ProductRepository;
import com.web.repository.VoucherRepository;
import com.web.service.CartService;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin
public class VnpayApi {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private VoucherRepository voucherRepository;

    @PostMapping("/user/urlpayment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentRequest paymentRequest){
        String orderId = String.valueOf(System.currentTimeMillis());
        Double total = cartService.totalAmountCart();
        if(paymentRequest.getVoucherId() != null){
            Voucher v = voucherRepository.findById(paymentRequest.getVoucherId()).get();
            total -= v.getDiscount();
        }
        String vnpayUrl = vnPayService.createOrder(total.intValue(), orderId, paymentRequest.getReturnUrl());
        ResponsePayment responsePayment = new ResponsePayment(vnpayUrl);
        return responsePayment;
    }
}
