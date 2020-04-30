package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalLineEnterprise;
import lombok.Data;

import java.time.LocalDate;

/**
 * Created by zhaohy on 2019/9/23.
 */
@Data
public class FormalLineEnterpriseParams extends FormalLineEnterprise {
    //线路名称
    private String lineName;

    //用户类型
    private Integer userType;

    //报名时间开始
    private LocalDate start;
    //报名时间结束
    private LocalDate end;

    //疗养开始时间查询
    private LocalDate sBeginStart;
    private LocalDate sBeginEnd;
    //疗养结束时间查询
    private LocalDate sEndStart;
    private LocalDate sEndEnd;

    private Long pId;
    private Long eId;
    private Long fleId;
}
