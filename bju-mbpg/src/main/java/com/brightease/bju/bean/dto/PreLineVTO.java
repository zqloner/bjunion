package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.pre.PreLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 这是用来查询下发路线的，为了封装预定报名路线状态的
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreLineVTO extends PreLine {
    /**
     * 预定报名时路线状态    0为报名未开始，1为开始报名，2为查看报名，3为报名已结束
     */
    private Integer ttl;
}
