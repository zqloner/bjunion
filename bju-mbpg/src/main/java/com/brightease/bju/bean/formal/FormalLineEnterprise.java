package com.brightease.bju.bean.formal;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 正式报名关联企业人数表
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineEnterprise implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 正式报名线路id
     */
    private Long formalId;

    private Long enterpriseId;

    /**
     * 限报人数
     */
    private Integer maxCount;

    /**
     * 当前报名人数
     */
    private Integer nowCount;

    /**
     * 企业名称
     */
    @TableField(exist = false)
    private String enterpriseName;

    /**
     * 1 未审核 2审核中 3审核通过 4审核不通过
     */
    private Integer examineStatus;

    /**
     * 报名时间
     */
    private LocalDate regDate;

    /**
     * 修改时间
     */
    private LocalDateTime updateTime;
}
