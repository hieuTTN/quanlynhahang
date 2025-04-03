package com.web.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.web.enums.PayStatus;
import com.web.enums.PayType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoice")
@Getter
@Setter
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Date bookDate;

    private Date createdDate;

    private Time createdTime;

    private Double totalAmount;

    private String fullName;

    private String phone;

    private String note;

    @Enumerated(EnumType.STRING)
    private PayStatus payStatus;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

}
