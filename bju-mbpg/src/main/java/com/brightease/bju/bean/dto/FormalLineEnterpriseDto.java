package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.bean.formal.FormalLineExamine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.List;

/**
 * Created by zhaohy on 2019/9/20.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineEnterpriseDto extends FormalLineEnterprise {

//    //审核记录
//    private List<FormalLineExamine> examines;

    //线路名称
    private String lineName;

    //用户类型
    private Integer userType;

    private Integer lineStatus;

    //报名时间开始
    private LocalDate start;
    //报名时间结束
    private LocalDate end;
    //企业名称
    private String eName;

    private Long pid;
}
