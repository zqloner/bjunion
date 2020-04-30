package com.brightease.bju.bean.dto.predto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 管理端预报名统计的地区单选树查询
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class AreaZnodesDto {
    //地区id
    private Long id;
    //地区父id
    private Long pId;
    //地区名字
    private String name;

    @JsonProperty("pId")
    public Long getpId() {
        return pId;
    }

}
