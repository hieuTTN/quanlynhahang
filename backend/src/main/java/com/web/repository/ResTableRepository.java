package com.web.repository;

import com.web.entity.ResTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResTableRepository extends JpaRepository<ResTable, Long> {

    @Query("SELECT r FROM ResTable r WHERE r.floor = :floor")
    List<ResTable> findAllByFloor(@Param("floor") int floor);
}
