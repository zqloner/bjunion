package com.brightease.bju.bean.dto.predto;

import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 张奇
 * 用于封装预报名管理的修改和查看内容
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class AreaEnterpriseMonth {
    //路线id
    private Long preId;
    //路线名字
    private String title;
    //描述
    private String describetion;
    //地区名字和id
    private List<PreAreaAndName> preAreaAndNames;
    //月份名字和id
    private List<PreMonthAndName> preMonthAndNames;
    //报名信息
    private List<PreRegistrationStatisticsDto> preRegistrationStatisticsDtos;
}
