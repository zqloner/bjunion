package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.brightease.bju.annotation.ExcelColumn;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * Created by zhaohy on 2019/9/23.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineUsersExportDto  implements Serializable {
    @ExcelColumn(value = "姓名",col = 1)
    private String name;


    //企业名称
    @ExcelColumn(value = "公司名字",col = 2)
    private String enterpriseName;

    /**
     * 京卡卡号
     */
    @ExcelColumn(value = "京卡卡号",col = 3)
    private String cardId;



    /**
     * 身份证号
     */
    @TableField("IDCard")
    @ExcelColumn(value = "身份证号",col = 4)
    private String IDCard;

    /**
     * 联系方式
     */
    @ExcelColumn(value = "联系方式",col = 5)
    private String phone;



    /**
     * 线路企业id
     */
    private Long lineEnterpriseId;

    private Long formalId;

    private Long userId;

    //企业id
    private Long enterpriseId;

    /**
     * 是否出团 0 否 1是
     */
    private Integer yesNo;

    /**
     * 审核是否通过 0 否 1是
     */
    private Integer examine;

    //路线状态
    private Long lineStatus;
}
