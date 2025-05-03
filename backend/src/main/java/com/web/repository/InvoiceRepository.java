package com.web.repository;

import com.web.entity.Invoice;
import com.web.enums.PayStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("select i from Invoice i where i.user.id = ?1")
    List<Invoice> findByUser(Long id);

    @Query("select i from Invoice i where i.bookDate between ?1 and ?2")
    Page<Invoice> findByDate(Date from, Date to, Pageable pageable);

    @Query("select count(i.id) from Invoice i where i.payStatus = ?1")
    Long countHuy(PayStatus daHuy);

    @Query("select sum(i.totalAmount) from Invoice i where i.bookDate = ?1 and i.payStatus = ?2")
    Double calByDate(Date date,PayStatus payStatus);
}
