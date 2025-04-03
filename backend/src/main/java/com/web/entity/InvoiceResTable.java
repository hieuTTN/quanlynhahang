package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "invoice_res_table")
@Getter
@Setter
public class InvoiceResTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    private ResTable resTable;

    @ManyToOne
    @JsonBackReference
    private Invoice invoice;
}
