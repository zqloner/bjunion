package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalCost;
import com.brightease.bju.bean.formal.FormalCostAppend;
import com.brightease.bju.bean.formal.FormalCostInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.List;

/**
 * Created by zhaohy on 2019/9/25.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalCostInfoDto extends FormalCost {
    //线路名称
    private String lineName;
    //疗养开始日期
    private LocalDate sBenginTime;
    //疗养结束日期
    private LocalDate sEndTime;
    //已报人数
    private Integer nowCount;

    private List<FormalCostInfo> infos;

    private List<FormalCostAppend> appends;

    private String sanatorName;
}
