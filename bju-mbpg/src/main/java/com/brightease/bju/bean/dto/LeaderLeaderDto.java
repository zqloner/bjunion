package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.brightease.bju.bean.leader.LeaderLeader;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

/**
 * Created by zhaohy on 2019/10/9.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class LeaderLeaderDto {

    private Long formalLindId;
    @ExcelColumn(value = "疗养线路", col = 5)
    private String formalLineName;
    @ExcelColumn(value = "疗养群体", col = 8, readConverterExp = "1=普通职工,2=优秀职工,3=劳模职工")
    private Long userType;
    @ExcelColumn(value = "人数", col = 9)
    private Long userCount;

    //疗养开始时间查询
    @ExcelColumn(value = "疗养开始时间", col = 6)
    private String sBeginStart;
    @ExcelColumn(value = "疗养结束时间", col = 7)
    private String sBeginEnd;
    //疗养结束时间查询
    private String sEndStart;
    private String sEndEnd;
    /*==*/
    private static final long serialVersionUID = 1L;

    private Long id;


    @ExcelColumn(value = "账号", col = 2)
    private String username;

    private String password;

    /**
     * 名字
     */
    @ExcelColumn(value = "领队姓名", col = 1)
    private String name;

    /**
     * 性别
     */
    @ExcelColumn(value = "性别", col = 3, readConverterExp = "0=女,1=男")
    private Integer sex;

    @ExcelColumn(value = "出生日期", col = 4, readConverterExp = "0=女,1=男")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;


    private String IDCard;


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
        this.age = Period.between(birthday, LocalDate.now()).getYears();
    }


    private String sexstr;

    public void setSexstr(String sexstr) {
        if (sexstr == "男") {
            this.sex = 1;
        } else if (sexstr == "女") {
            this.sex = 0;
        } else {
            this.sex = 2;
        }
    }
}
