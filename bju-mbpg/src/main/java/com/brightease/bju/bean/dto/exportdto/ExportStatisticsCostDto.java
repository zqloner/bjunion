package com.brightease.bju.bean.dto.exportdto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 疗养群体导出
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ExportStatisticsCostDto {
    @ExcelColumn(value = "姓名",col = 1)
    private String name;

    /**
     * 京卡卡号
     */
    @ExcelColumn(value = "京卡卡号",col = 2)
    private String cardId;

    //企业名称
    @ExcelColumn(value = "所属单位",col = 3)
    private String enterpriseName;


    @ExcelColumn(value = "疗养群体",col = 4,readConverterExp = "1=普通职工,2=优秀职工,3=劳模职工")
    private Long userType;

    @ExcelColumn(value = "疗养路线",col = 5)
    private String lineName;

    /**
     * 疗养开始日期
     */
    @ExcelColumn(value = "疗养开始日期", col = 6)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate sBeginStart;

    /**
     * 疗养结束日期
     */
    @ExcelColumn(value = "疗养结束日期", col = 7)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate sBeginEnd;

    @ExcelColumn(value = "疗养费用", col = 8)
    private BigDecimal lyfy;

    @ExcelColumn(value = "交通费用", col = 9)
    private BigDecimal jtfy;

    @ExcelColumn(value = "领队上报费用", col = 10)
    private BigDecimal ldfy;

    @ExcelColumn(value = "疗养总费用", col = 11)
    private BigDecimal allfy;




}
