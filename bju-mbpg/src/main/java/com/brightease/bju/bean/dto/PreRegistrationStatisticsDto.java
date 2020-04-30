package com.brightease.bju.bean.dto;


import com.brightease.bju.annotation.ExcelColumn;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 这个类是用来封装的是预报名统计返回结果
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreRegistrationStatisticsDto {
    //路线名字
    @ExcelColumn(value = "预报任务名称",col = 1)
    private String title;

    //疗养地区
    @ExcelColumn(value = "疗养地区",col = 2)
    private String regionName;

    //疗养月份
    @ExcelColumn(value = "疗养月份",col = 3)
    private String month;

    //一级单位
    @ExcelColumn(value = "一级单位",col = 4)
    private String aunit;

    //二级单位
    @ExcelColumn(value = "二级单位",col = 5)
    private String bunit;

    //报名日期
    @ExcelColumn(value = "报名日期",col = 6)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createTime;

    //报名人数
    @ExcelColumn(value = "报名人数",col = 7)
    private Long personCount;

    //父id;
    private Long enterpriseId;

    //报名id,查看详情的唯一性
    private Long preStaticId;

    //地区的id
    private Long areaId;

    //月份id
    private Long monthId;

    //描述
    private  String describetion;

}
