package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SearchDto {

    private List<Long> category = new ArrayList<>();

    private Double small;

    private Double large;

}

