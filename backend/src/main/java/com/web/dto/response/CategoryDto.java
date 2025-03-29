package com.web.dto.response;

import lombok.Getter;
import lombok.Setter;

public interface CategoryDto {

    public Long getId();

    public String getName();

    public String getImage();

    public Long getQuantity();
}
