package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.pre.PreLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreLineDto extends PreLine {
    /**
     * 预报名总人数
     */
    private Long nowCount;

    /**
     * 是否已下发   0为未下发，1为已下发
     */
    private Long lower;

}
