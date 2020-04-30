package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Created by zhaohy on 2019/9/27.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalCostExamineDto {
    //审核表主键
    private Long id;
    /**
     * 发起人--领队人
     */
    private String leaderName;
    /**
     * 线路名称
     */
    private String lineName;
    /**
     * 联系方式 账号，手机号
     */
    private String username;
    /**
     * 审核状态
     */
    private Integer examineStatus;
    /**
     * 疗养开始日期
     */
    private LocalDate start;

    /**
     * 疗养结束日期
     */
    private LocalDate end;
    /**
     * 疗养人数
     */
    private Integer nowCount;
    /**
     * 费用
     */
    private BigDecimal price;
    /**
     * 发起时间
     */
    private LocalDateTime createTime;

    private String message;

}
