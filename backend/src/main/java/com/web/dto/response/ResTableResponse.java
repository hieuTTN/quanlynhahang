package com.web.dto.response;

import com.web.entity.ResTable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResTableResponse {

    private ResTable resTable;

    private Boolean isEmpty = false;
}
