package com.brightease.bju.bean.formal;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 疗养费用详情
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalCost implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long formalId;

    private Long lineId;

    /**
     * 消费总额
     */
    private BigDecimal price;

    /**
     * 备注
     */
    private String remarks;

    /**
     * 是否领队提交费用 0否，1是
     */
    private Integer isLeader;

    /**
     * 领队提交的需要审核。0未审核，1已通过，2未通过
     */
    private Integer examineStatus;

    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer status;


}
