package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

/**
 * Created by zhaohy on 2019/10/10.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class StatisticsCostFormalLineDto {
    private Long formallineId;
    private Long usersCount;
    private BigDecimal allPrice;

    private BigDecimal lyfy;
    private BigDecimal ldfy;
    private BigDecimal jtfy;


}
