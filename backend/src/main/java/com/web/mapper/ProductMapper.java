package com.web.mapper;

import com.web.dto.request.ProductRequest;
import com.web.dto.response.UserDto;
import com.web.entity.Category;
import com.web.entity.Product;
import com.web.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    private ModelMapper mapper;

    public Product productRequestToProduct(ProductRequest productRequest){
        Product product = mapper.map(productRequest, Product.class);
        return product;
    }

}
