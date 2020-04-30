package com.brightease.bju.bean.leader;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import java.time.Period;

import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * <p>
 * 领队
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class LeaderLeader implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 账号（手机号）
     */
    @ExcelColumn("账号（手机号）")
    private String username;

    private String password;

    /**
     * 名字
     */
    @ExcelColumn("姓名")
    private String name;

    /**
     * 性别
     */
    private Integer sex;

    /**
     * 年龄
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ExcelColumn("出生日期（例如：2019-01-01）")
    private LocalDate birthday;

    /**
     * 身份证号
     */
    @TableField("IDCard")
    @ExcelColumn("身份证号")
    private String IDCard;

    /**
     * 导游证号
     */
    @ExcelColumn("导游证号")
    private String guideNum;

    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer status;

    @TableField(exist = false)
    private int age;


    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
        this.age = Period.between(birthday,LocalDate.now()).getYears();
    }

    @TableField(exist = false)
    @ExcelColumn("性别")
    private String sexstr;

    public void setSexstr(String sexstr) {
        if (sexstr == "男") {
            this.sex = 1;
        } else if (sexstr == "女") {
            this.sex = 0;
        }else{
            this.sex = 2;
        }
    }
}
