package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalCostInfoDto;
import com.brightease.bju.bean.dto.LeaderExamineCostDto;
import com.brightease.bju.bean.dto.StatisticsCostDto;
import com.brightease.bju.bean.dto.StatisticsCostFormalLineDto;
import com.brightease.bju.bean.formal.FormalCost;
import com.baomidou.mybatisplus.extension.service.IService;
import com.brightease.bju.bean.formal.FormalCostAppend;
import com.brightease.bju.bean.formal.FormalCostInfo;

import java.util.List;

import java.util.Map;

/**
 * <p>
 * 疗养费用详情 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalCostService extends IService<FormalCost> {
    CommonResult getCostList(String lineName,Long status, Integer pageNum, Integer pageSize);

    CommonResult addFormalCost(List<FormalCostInfo> costList, List<FormalCostAppend> appends, Long id);

    CommonResult getInfoById(Long id,Integer isLeader);
    CommonResult getFormalCostList(Map<String, Object> param, int startNumber, Integer pageSize);

    List<StatisticsCostFormalLineDto> getZghPrice(StatisticsCostDto costDto);

    List<StatisticsCostFormalLineDto> getLeaderPrice(StatisticsCostDto costDto);

    FormalCostInfoDto getInfoByUserId(Long formallineId, Long id);

    CommonResult getLeaderCostList(LeaderExamineCostDto dto, Integer pageNum, Integer pageSize);

    CommonResult saveCostInfoList(Long leaderid, String formalid, String lineid, String totalmoney, String costid, String infolist, String appendlist);
}
