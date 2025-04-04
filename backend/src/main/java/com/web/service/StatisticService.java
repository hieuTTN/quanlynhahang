package com.web.service;


import com.web.enums.PayStatus;
import com.web.repository.HistoryPayRepository;
import com.web.repository.InvoiceRepository;
import com.web.repository.ProductRepository;
import com.web.repository.UserRepository;
import com.web.utils.Contains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Component
public class StatisticService {

    @Autowired
    private HistoryPayRepository historyPayRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Long doanhThuThangNay(){
        Long result = historyPayRepository.doanhThuThangNay();
        return result;
    }

    public Long doanhThuHomNay(){
        Long result = historyPayRepository.doanhThuHomNay();
        return result;
    }

    public Long soLuongUser(){
        Long result = userRepository.countUserByRole(Contains.ROLE_USER);
        return result;
    }

    public Long soLuongProduct(){
        Long result = productRepository.count();
        return result;
    }


    public List<Long> doanhThuNam(@RequestParam("nam") Integer nam){
        List<Long> list = new ArrayList<>();
        for(int i=1; i< 13; i++){
            Long tong = historyPayRepository.tinhDoanhThuNam(i, nam);
            list.add(tong);
        }
        return list;
    }

    public Long[] donHuy(){
        Long[] result = new Long[2];
        Long tongHuy = invoiceRepository.countHuy(PayStatus.DA_HUY);
        result[1] = tongHuy;
        Long tongTin = invoiceRepository.count();
        result[0] = tongTin-tongHuy;
        return result;
    }
}
