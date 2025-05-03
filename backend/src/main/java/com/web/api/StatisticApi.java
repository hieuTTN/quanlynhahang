package com.web.api;


import com.web.dto.response.DoanhThuNgay;
import com.web.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/statistic")
@CrossOrigin("*")
public class StatisticApi {

    @Autowired
    private StatisticService statisticService;

    @GetMapping("/admin/doanh-thu-thang-nay")
    public ResponseEntity<?> doanhThuThangNay(){
        Long result = statisticService.doanhThuThangNay();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/doanh-thu-hom-nay")
    public ResponseEntity<?> doanhThuHomNay(){
        Long result = statisticService.doanhThuHomNay();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/so-luong-user")
    public ResponseEntity<?> soLuongUser(){
        Long result = statisticService.soLuongUser();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/so-luong-product")
    public ResponseEntity<?> soLuongBds(){
        Long result = statisticService.soLuongProduct();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/doanh-thu-nam")
    public ResponseEntity<?> doanhThuNam(@RequestParam("nam") Integer nam){
        List<Long> result = statisticService.doanhThuNam(nam);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/doanh-thu-ngay")
    public ResponseEntity<?> doanhThuNam(@RequestParam Date from, @RequestParam Date to){
        List<DoanhThuNgay> result = statisticService.doanhThuKhoangNgay(from, to);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/invoice-huy")
    public ResponseEntity<?> tinViPham(){
        Long[] result = statisticService.donHuy();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
