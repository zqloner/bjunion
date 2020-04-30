package com.brightease.bju.bean.enterprise;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

/**
 * <p>
 * 企业职工表
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class EnterpriseUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 京卡卡号
     */
    @ExcelColumn(value = "京卡卡号",col = 1)
    private String cardId;

    @ExcelColumn(value = "姓名",col = 2)
    private String name;

    /**
     * 所属单位
     */
    private Long eId;

    @TableField(exist = false)
    private Long enterpriseId;

    @TableField(exist = false)
    private List<Long> enterpriseIds;
    /**
     * 0:女;1:男
     */
    @ExcelColumn(value = "性别" ,readConverterExp = "0=女,1=男,2=未知",col = 3)
    private Integer sex;

    /**
     * 年龄
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ExcelColumn(value = "出生日期" ,col = 4)
    private LocalDate birthday;

    /**
     * 民族
     */
    @ExcelColumn(value = "民族" ,col = 5,readConverterExp= "1=汉族,2=蒙古族,3=回族,4=藏族,5=维吾尔族,6=苗族,7=彝族,8=壮族,9=布依族," +
            "10=朝鲜族,11=满族,12=侗族,13=瑶族,14=白族,15=土家族,16=哈尼族,17=哈萨克族,18=傣族,19=黎族,20=傈僳族,21=佤族,22=畲族," +
            "23=高山族,24=拉祜族,25=水族,26=东乡族,27=纳西族,28=景颇族,29=柯尔克孜族,30=土族,31=达斡尔族,32=仫佬族,33=羌族,34=布朗族," +
            "35=撒拉族,36=毛难族,37=仡佬族,38=锡伯族,39=阿昌族,40=普米族,41=塔吉克族,42=怒族,43=乌孜别克族,44=俄罗斯族,45=鄂温克族," +
            "46=崩龙族,47=保安族,48=裕固族,49=京族,50=塔塔尔族,51=独龙族,52=鄂伦春族,53=赫哲族,54=门巴族,55=珞巴族,56=基诺族,57=其他")
    private Long nationId;

    /**
     * 身份证号
     */
    @TableField("IDCard")
    @ExcelColumn(value = "身份证号",col = 8)
    private String IDCard;

    /**
     * 联系方式
     */
    @ExcelColumn(value = "联系方式",col = 9)
    private String phone;

    /**
     * 职务 id
     */
    @ExcelColumn(value = "职务",col = 10)
    private String job;

    /**
     * 健康 0健康 1 一般 2有疾病
     */
    @ExcelColumn(value = "健康状况",col = 6,readConverterExp = "0=健康,1=一般,2=有疾病")
    private Integer health;

    /*
     * 疾病，health为2时填写
     */
    @ExcelColumn(value = "疾病",col = 7)
    private String disease;

    /**
     * 荣誉
     */
    @ExcelColumn(value = "所获荣誉",col = 11)
    private String honour;

    /**
     * 获得荣誉时间
     */
    @ExcelColumn(value = "获荣誉时间",col = 12)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
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

    @TableField(exist = false)
    private int age;

    public void setUserBirthday(LocalDate birthday) {
        this.birthday = birthday;
        this.age = Period.between(birthday,LocalDate.now()).getYears();
    }

    //民族
    @TableField(exist = false)
    private String nationName;

    //职务名称
    @TableField(exist = false)
    private String jobName;

    //企业名称
    @TableField(exist = false)
    private String enterpriseName;


    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
        this.age = Period.between(birthday,LocalDate.now()).getYears();
    }

    @TableField(exist = false)
    private Long userType;

    @TableField(exist = false)
    @ExcelColumn(value = "付款单位联系人",col = 13)
    private String payPeople;

    @TableField(exist = false)
    @ExcelColumn(value = "付款单位联系电话",col = 14)
    private String payPhone;

    //爱好
    @ExcelColumn(value = "爱好",col = 15)
    private String hobby;

    //子集企业id
    @TableField(exist = false)
    private List<Long> childrenIds;
}
