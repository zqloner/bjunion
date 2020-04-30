package com.brightease.bju.bean.formal;

import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 正式报名审计
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineExamine implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long formalLineId;

    private Long formalLineEnterpriseId;

    /**
     * 企业id
     */
    private Long enterpriseId;

    /**
     * 审核企业id
     */
    private Long examineId;

    /**
     * 审核单位
     */
    private String examineName;
    /**
     * 申请单位
     */
    private String requestName;

    /**
     * 原因
     */
    private String message;

    /**
     * 是否通过 0 否 1 通过 2 待审核
     */
    private Integer examineStatus;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;


}
