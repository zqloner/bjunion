package com.brightease.bju.bean.dto;

import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Created by zhaohy on 2019/10/9.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class StatisticsSanatoriumDto implements Serializable {
    private static final long serialVersionUID = 1L;
    //线路id
    private Long lineId;
    //线路名称
    @ExcelColumn(value = "疗养院名称",col = 1)
    private String lineName;
    //疗养群体
    @ExcelColumn(value = "疗养群体",col = 5,readConverterExp = "1=普通职工,2=优秀职工,3=劳模职工")
    private Long userType;
    //疗养团id
    private Long sId;
    //疗养团名称
    @ExcelColumn(value = "疗养院线路",col = 2)
    private String sName;
    //疗养开始时间
    @ExcelColumn(value = "疗养开始时间",col = 3)
    private LocalDate sBenginTime;
    //疗养结束时间
    @ExcelColumn(value = "疗养结束时间",col = 4)
    private LocalDate sEndTime;
    //疗养开始时间查询
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sBeginStart;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sBeginEnd;
    //疗养结束时间查询
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sEndStart;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sEndEnd;

    @ExcelColumn(value = "人数",col = 6)
    private Long usersCount;
}
