package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

/**
 * Created by zhaohy on 2019/10/10.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class StatisticsCostDto{
    private static final long serialVersionUID = 1L;

    private Long id;

    @ExcelColumn(value = "京卡卡号",col = 2)
    private String cardId;

    @ExcelColumn(value = "姓名",col = 1)
    private String name;


    private Long eId;


    private Integer sex;

    private LocalDate birthday;

    private Long nationId;


    private String IDCard;


    private String phone;

    private String job;

    private Integer health;

    private String disease;

    private String honour;

    private LocalDate honourTime;

    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer status;

    private int age;

    public void setUserBirthday(LocalDate birthday) {
        this.birthday = birthday;
        this.age = Period.between(birthday,LocalDate.now()).getYears();
    }

    private String nationName;

    private String jobName;

    @ExcelColumn(value = "所属单位",col = 3)
    private String enterpriseName;


    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
        this.age = Period.between(birthday,LocalDate.now()).getYears();
    }

    @ExcelColumn(value = "疗养群体",col = 4,readConverterExp = "1=普通职工,2=优秀职工,3=劳模职工")
    private Long userType;

    private String payPeople;

    private String payPhone;

    /*=====*/
    @ExcelColumn(value = "疗养路线",col = 5)
    private String lineName;
    private Long lineId;
    private Long formallineId;
    private String pName;
    private Long pId;

    @ExcelColumn(value = "疗养费用", col = 8)
    private BigDecimal lyfy;

    @ExcelColumn(value = "交通费用", col = 9)
    private BigDecimal jtfy;

    @ExcelColumn(value = "领队上报费用", col = 10)
    private BigDecimal ldfy;

    @ExcelColumn(value = "疗养总费用", col = 11)
    private BigDecimal allfy;

    //疗养开始时间查询
    /**
     * 疗养开始日期
     */
    @ExcelColumn(value = "疗养开始日期", col = 6)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String sBeginStart;
    /**
     * 疗养结束日期
     */
    @ExcelColumn(value = "疗养结束日期", col = 7)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String sBeginEnd;
    //疗养结束时间查询
    private String sEndStart;
    private String sEndEnd;

    /*===*/

}
