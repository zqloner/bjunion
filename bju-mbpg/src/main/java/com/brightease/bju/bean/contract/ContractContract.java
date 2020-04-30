package com.brightease.bju.bean.contract;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import java.time.format.DateTimeFormatter;

import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

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
public class ContractContract implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 合同名称
     */
    @ExcelColumn("服务合同名称")
    private String contractName;

    /**
     * 合同编号
     */
    @ExcelColumn("服务合同编号")
    private String contractCode;

    /**
     * 合同起始时间
     */
    @ExcelColumn("合同起始时间(例如：2019-01-01)")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate contractBeginTime;

    /**
     * 合同结束时间
     */
    @ExcelColumn("合同结束时间(例如：2019-01-01)")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate contractEndTime;

    /**
     * 业务类型
     */
    @ExcelColumn("业务类型")
    private String type;

    /**
     * 业务负责人
     */
    @ExcelColumn("业务负责人")
    private String person;

    /**
     * 负责人联系方式
     */
    @ExcelColumn("负责人联系方式")
    private String phone;

    /**
     * 甲方名称
     */
    @TableField("partyA_name")
    @ExcelColumn("甲方名称(客户名称)")
    private String partyaName;

    /**
     * 客户甲方法务实体名称
     */
    @TableField("partyA_name_legal")
    @ExcelColumn("甲方法务实体名称")
    private String partyaNameLegal;

    /**
     * 甲方联系人
     */
    @TableField("partyA_person")
    @ExcelColumn("甲方联系人")
    private String partyaPerson;

    /**
     * 甲方联系方式
     */
    @TableField("partyA_phone")
    @ExcelColumn("甲方联系人手机号")
    private String partyaPhone;

    /**
     * 甲方固定电话
     */
    @TableField("partyA_tel")
    @ExcelColumn("甲方固定电话")
    private String partyaTel;

    /**
     * 甲方地址
     */
    @TableField("partyA_address")
    @ExcelColumn("甲方地址")
    private String partyaAddress;

    /**
     * 乙方联系人
     */
    @TableField("partyB_person")
    @ExcelColumn("乙方联系人")
    private String partybPerson;

    /**
     * 乙方联系电话
     */
    @TableField("partyB_phone")
    @ExcelColumn("乙方联系人手机号")
    private String partybPhone;

    /**
     * 乙方固定电话
     */
    @TableField("partyB_tel")
    @ExcelColumn("乙方固定电话")
    private String partybTel;

    /**
     * 乙方地址
     */
    @ExcelColumn("乙方地址")
    private String partyAddress;

    //合同状态  0为为开始   1为服务中   2已结束
    private Integer contractStatus;

    private LocalDate createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer status;

    /**
     * 创建人Id
     */
    private Long createUserid;

    @TableField(exist = false)
    private String startTime;
    @TableField(exist = false)
    private String overTime;

    public void setStartTime(String startTime) {
        if (!StringUtils.isBlank(startTime)) {
            this.contractBeginTime = LocalDate.parse(startTime, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            this.startTime = startTime;
        } else {
            this.startTime = startTime;
        }
    }

    public void setOverTime(String overTime) {
        if (!StringUtils.isBlank(overTime)) {
            this.contractEndTime = LocalDate.parse(overTime, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            this.overTime = overTime;
        } else {
            this.overTime = overTime;
        }
    }
}
