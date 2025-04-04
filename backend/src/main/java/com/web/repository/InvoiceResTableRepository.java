package com.web.repository;

import com.web.entity.InvoiceResTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.Optional;

public interface InvoiceResTableRepository extends JpaRepository<InvoiceResTable, Long> {

    @Query("select i.id from InvoiceResTable i where i.invoice.bookDate = ?1 and i.resTable.id = ?2 and i.invoice.payStatus <> 'DA_HUY'")
    Long findByDate(Date date, Long idTable);
}
