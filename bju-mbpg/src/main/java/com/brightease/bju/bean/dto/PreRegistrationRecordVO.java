package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 预报名记录查询的参数封装类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreRegistrationRecordVO {
    //职工类型
    private Long userType;

    //路线名称
    private String title ;

    //起始时间
    private LocalDateTime startTime;

    //结束时间
    private LocalDateTime endTime;

    //企业的id
    private Long enterPriseId;
}
