package com.brightease.bju.bean.enterprise;

import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 企业审核
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class EnterpriseExamine implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 审核企业id
     */
    private Long examineId;

    /**
     * 企业id
     */
    private Long enterpriseId;

    /**
     * 原因
     */
    private String message;

    /**
     * 是否通过 0 否 1 通过
     */
    private Integer examineStatus;

    private LocalDateTime createTime;

    /**
     * 审核单位
     */
    private String examineName;
    /**
     * 申请单位
     */
    private String requestName;


}
