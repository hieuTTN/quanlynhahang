package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    private String returnUrl;

    private Long voucherId;
}
