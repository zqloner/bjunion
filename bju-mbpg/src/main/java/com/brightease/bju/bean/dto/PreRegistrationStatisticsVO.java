package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 这个类是用来封装页面传过来的参数的
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreRegistrationStatisticsVO {
    //路线名字
    private String  title;

    //疗养地区
    private Long areaId;

    //疗养月份
    private String dictId;

    //报名单位
    private Long enterpriseId;

    //报名开始日期
    private String startTime;

    //报名开始日期
    private String endTime;

    //员工类型
    private Long userType;

    //企业id
    private List<Long> ids;

}
