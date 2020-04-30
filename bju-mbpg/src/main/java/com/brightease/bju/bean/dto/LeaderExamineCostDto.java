package com.brightease.bju.bean.dto;

import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Created by zhaohy on 2019/10/19.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class LeaderExamineCostDto implements Serializable {
    @ExcelColumn(value = "发起人（领队）",col = 1)
    private String leaderName;
    @ExcelColumn(value = "手机号",col = 2)
    private String username;
    //线路名称
    @ExcelColumn(value = "线路名称",col = 3)
    private String lineName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ExcelColumn(value = "疗养开始时间",col = 4)
    private LocalDate start;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ExcelColumn(value = "疗养结束时间",col = 5)
    private LocalDate end;
    @ExcelColumn(value = "审核状态",col = 9,readConverterExp = "0=未审核,1=已通过,2=未通过")
    private Integer examineStatus;

    @ExcelColumn(value = "疗养人数",col = 6)
    private Long nowCount;
    @ExcelColumn(value = "新增费用",col = 7)
    private BigDecimal price;
    private Long costId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ExcelColumn(value = "发起时间",col = 8)
    private LocalDate createTime;
    private Long formalId;
}
