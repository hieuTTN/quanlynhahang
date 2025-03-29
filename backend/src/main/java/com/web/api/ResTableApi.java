package com.web.api;

import com.web.dto.response.CategoryDto;
import com.web.entity.Category;
import com.web.entity.ResTable;
import com.web.service.CategoryService;
import com.web.service.ResTableService;
import com.web.validate.CategoryValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/res-table")
@CrossOrigin
public class ResTableApi {

    @Autowired
    private ResTableService resTableService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody ResTable resTable){
        ResTable result = resTableService.save(resTable);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        resTableService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/find-all")
    public ResponseEntity<?> findAllList(){
        List<ResTable> result = resTableService.findAll();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
