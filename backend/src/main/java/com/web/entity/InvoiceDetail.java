package com.web.entity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "invoice_detail")
@Getter
@Setter
public class InvoiceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Integer quantity;

    private Double price;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Invoice invoice;
}
