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
public class PreRegistrationRecordDto {
    //路线iD
    private Long preId;

    //路线名称
    private String title ;

    //报名时间
    private LocalDateTime createTime;

    //人数
    private Long personCount;
}
