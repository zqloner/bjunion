package com.brightease.bju.bean.ticket;

import java.math.BigDecimal;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 正式报名的用户出行信息
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class TicketInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long formalLineUserId;

    private Long formalId;

    /**
     * 出行工具
     */
    private String goType;

    /**
     * 车票/航班/车牌号
     */
    private String goTicketInfo;

    /**
     * 价格
     */
    private BigDecimal goPrice;

    /**
     * 出行票务备注内容
     */
    private String goNote;

    /**
     * 返程工具
     */
    private String backType;

    /**
     * 车票航班火车
     */
    private String backTicketInfo;

    /**
     * 价格
     */
    private BigDecimal backPrice;

    /**
     * 返程票务备注内容
     */
    private String backNote;



}
