package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * <p>
 * 合同管理
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ContractContractDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 合同名称
     */
    @ExcelColumn(value = "服务合同名称", col = 1)
    private String contractName;

    /**
     * 甲方名称
     */
    @TableField("partyA_name")
    @ExcelColumn(value = "甲方名称(客户名称)", col = 2)
    private String partyaName;

    /**
     * 业务负责人
     */
    @ExcelColumn(value = "业务负责人", col = 3)
    private String person;


    /**
     * 负责人联系方式
     */
    @ExcelColumn(value = "负责人联系方式", col = 4)
    private String phone;

    /**
     * 合同起始时间
     */
    @ExcelColumn(value = "合同起始时间", col = 5)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate contractBeginTime;

    /**
     * 合同结束时间
     */
    @ExcelColumn(value = "合同结束时间", col = 6)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate contractEndTime;


    /**
     * 创建人
     */
    @ExcelColumn(value = "创建人", col = 7)
    private String createUserName;

    /**
     * 创建时间
     */
    @ExcelColumn(value = "创建时间", col = 8)
    private LocalDate createTime;


    /**
     * 0 不可用 1 可用
     */
    private Integer status;

    /**
     * 创建人
     */
    private String name;

    //合同状态
//    readConverterExp= "1=汉族,2=蒙古族,3=回族,4=藏族
    //合同的状态   0未开始  1服务中   2已结束
    @ExcelColumn(value = "状态" ,col = 9,readConverterExp= "0=未开始,1=服务中,2=已结束")
    private Integer contractStatus;


}
