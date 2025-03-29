package com.web.service;

import com.web.dto.response.CategoryDto;
import com.web.entity.Category;
import com.web.entity.ResTable;
import com.web.exception.MessageException;
import com.web.repository.CategoryRepository;
import com.web.repository.ResTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResTableService {

    @Autowired
        private ResTableRepository resTableRepository;

    public ResTable save(ResTable resTable) {
        resTableRepository.save(resTable);
        return resTable;
    }

    public void delete(Long id) {
        try {
            resTableRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Bàn đã được sử dụng, không thể xóa");
        }
    }

    public ResTable findById(Long id) {
        return resTableRepository.findById(id).get();
    }

    public List<ResTable> findAll() {
        List<ResTable> categories = resTableRepository.findAll();
        return categories;
    }
}
