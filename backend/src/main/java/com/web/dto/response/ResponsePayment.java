package com.web.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsePayment {
    private String url;
    public ResponsePayment(String url) {
        this.url = url;
    }
}

