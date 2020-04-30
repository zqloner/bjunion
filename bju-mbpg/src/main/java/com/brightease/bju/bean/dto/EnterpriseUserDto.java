package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * Created by zhaohy on 2019/10/14.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class EnterpriseUserDto {
    /**
     * 京卡卡号
     */
    @ExcelColumn(value = "京卡卡号")
    private String cardId;

    @ExcelColumn(value = "姓名")
    private String name;

    /**
     * 0:女;1:男
     */
    @ExcelColumn(value = "性别" )
    private String sex;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ExcelColumn(value = "出生日期" )
    private LocalDate birthday;

    @ExcelColumn(value = "民族")
    private String nation;

    @ExcelColumn(value = "健康状况")
    private String health;

    @ExcelColumn(value = "疾病")
    private String disease;

    @ExcelColumn(value = "身份证号")
    private String IDCard;

    /**
     * 联系方式
     */
    @ExcelColumn(value = "手机号码")
    private String phone;

    @ExcelColumn(value = "职工类型")
    private String userType;

    /**
     * 职务 id
     */
    @ExcelColumn(value = "职务")
    private String job;


    @ExcelColumn(value = "所获得荣誉称号")
    private String honour;

    /**
     * 获得荣誉时间
     */
    @ExcelColumn(value = "获荣誉称号的时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate honourTime;

    @ExcelColumn(value = "所属企业")
    private String enterpriseName;

    @ExcelColumn(value = "爱好")
    private String hobby;

}
