package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalCost;
import com.brightease.bju.bean.formal.FormalLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Created by zhaohy on 2019/9/25.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalCostDto extends FormalCost{
    //线路名称
    private String lineName;
    //领队名称
    private String leaderName;
    //疗养开始日期
    private LocalDate sBenginTime;
    //疗养结束日期
    private LocalDate sEndTime;
    //已报人数
    private Integer nowCount;

}
