package com.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
public class DoanhThuNgay {

    private Double doanhThu;

    private Date ngay;
}
