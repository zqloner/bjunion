package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * Created by zhaohy on 2019/9/5.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class EnterpriseDto{
    private Long id;

    /**
     * 企业账号
     */
    private String account;

    /**
     * 密码
     */
    private String password;

    /**
     * 企业名称
     */
    private String name;

    /**
     * 社会统一信用代码
     */
    private String creditCode;

    /**
     * 父id
     */
    private Long pid;

    /**
     * 联系人
     */
    private String contacts;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 地址
     */
    private String address;

    /**
     * 邮箱
     */
    private String mail;

    /**
     * 所在区域
     */
    private Long areaIdP;
    private Long areaIdC;
    private Long areaIdA;

    /**
     * 资质图片url
     */
    @TableField("QA_url")
    private String qaUrl;

    /**
     * 是否开放劳模 0否1是
     */
    private Integer modelStatus;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    private Integer status;

    /**
     * 1 未审核 2审核中 3审核通过 4审核不通过
     */
    private Integer examineStatus;
    private String parentName;
    private String addressInfo;
}
