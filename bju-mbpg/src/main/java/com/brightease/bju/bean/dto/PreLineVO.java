package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.pre.PreLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreLineVO implements Serializable {
    /**
     * 预定路线
     */
    private PreLine preLine;
    /**
     * 预报名总人数
     */
    private Long nowCount;

    /**
     * 月份
     */
    private List<Long> months;

    /**
     * 疗养地区
     */
    private List<Long> areas;

    /**
     * 工会，企业名字
     */
    private List<Long> enterPrises;
}
