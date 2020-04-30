package com.brightease.bju.bean.dto.predto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 管理端预报名统计的企业单选树查询
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class EnterPriseZnodeDto {

    //企业id
    private Long id;
    //企业父id
    private Long pId;
    //企业名字
    private String name;
    @JsonProperty("pId")
    public Long getpId() {
        return pId;
    }
}
