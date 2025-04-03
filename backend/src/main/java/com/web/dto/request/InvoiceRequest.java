package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class InvoiceRequest {

    private String fullName;

    private String phone;

    private String note;

    private Long voucherId;

    private Date bookDate;

    private String vnpOrderInfo;

    private String urlVnpay;

    private List<Long> listTableId = new ArrayList<>();
}
