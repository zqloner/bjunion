package com.brightease.bju.bean.formal;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 疗养费用详情
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalCostInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long costId;

    /**
     * 费用类型
     */
    private String costType;

    /**
     * 费用明细
     */
    private String costInfo;

    /**
     * 费用明细
     */
    private Long costInfoId;

    /**
     * 消费人id
     */
    private Long userId;

    /**
     * 消费人
     */
    private String costUser;

    /**
     * 消费总额
     */
    private BigDecimal price;

    /**
     * 备注
     */
    private String remarks;

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
