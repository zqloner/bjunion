package com.brightease.bju.bean.dto;

import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Created by zhaohy on 2019/10/9.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class StatisticsTicketDto {

    @ExcelColumn(value = "出行工具",col = 1,readConverterExp = "1=火车,2=飞机,3=大巴")
    private Long type;
    private Long lineId;
    @ExcelColumn(value = "疗养路线",col = 2)
    private String lineName;
    @ExcelColumn(value = "疗养群体",col = 5,readConverterExp = "1=普通职工,2=优秀职工,3=劳模职工")
    private Long userType;
    @ExcelColumn(value = "人数",col = 6)
    private Long usersCount;
    @ExcelColumn(value = "交通费用",col = 7)
    private BigDecimal price;

    //疗养开始时间查询
    @ExcelColumn(value = "疗养开始时间",col = 3)
    private String sBeginStart;
    @ExcelColumn(value = "疗养结束时间",col = 4)
    private String sBeginEnd;
    //疗养结束时间查询
    private String sEndStart;
    private String sEndEnd;
}
