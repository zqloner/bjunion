package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.enterprise.EnterpriseUser;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * Created by zhaohy on 2019/9/23.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineUsersDto extends EnterpriseUser {
    private Long LId;

    //企业名称
    private String enterpriseName;
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
