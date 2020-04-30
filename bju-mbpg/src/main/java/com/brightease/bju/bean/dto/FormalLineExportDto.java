package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 正式报名线路
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineExportDto implements Serializable {

    private static final long serialVersionUID = 1L;



    /**
     * 疗养开始日期
     */
    @JsonFormat(pattern="yyyy-MM-dd")
    @ExcelColumn(value = "疗养开始时间",col = 2)
    private LocalDate sBenginTime;

    /**
     * 疗养结束日期
     */
    @JsonFormat(pattern="yyyy-MM-dd")
    @ExcelColumn(value = "疗养结束时间",col = 3)
    private LocalDate sEndTime;


    /**
     * 已报人数
     */
    @ExcelColumn(value = "报名人数",col = 6)
    private Integer nowCount;

    /**
     * 限报人数
     */
    @ExcelColumn(value = "限报人数",col = 5)
    private Integer maxCount;

    /**
     *  1 报名中，2 未成团，3 已经成团（待出团），4 出团中，5 票务购票，6 待结算，7 已结束
     */
    @ExcelColumn(value = "线路状态",col = 4,readConverterExp = "1=报名中,2=未成团,3=已经成团（待出团）,4=出团中,5=票务购票,6=待结算,7=已结束")
    private Integer lineStatus;
    @TableField(exist = false)
    @ExcelColumn(value = "线路名称",col = 1)
    private String name;





}
