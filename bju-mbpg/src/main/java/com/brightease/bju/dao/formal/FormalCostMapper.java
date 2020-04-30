package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.formal.FormalCost;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

import java.util.List;

/**
 * <p>
 * 疗养费用详情 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalCostMapper extends BaseMapper<FormalCost> {
    List<FormalCostDto> getCostList(@Param("lineName") String lineName,@Param("status")Long status);

    List<Map<String,Object>> getFormalCostList(Map<String, Object> param);
    FormalCostInfoDto getInfoById(@Param("id") Long id, @Param("isLeader") Integer isLeader);

    List<StatisticsCostFormalLineDto> getZghPrice(StatisticsCostDto costDto);

    List<StatisticsCostFormalLineDto> getLeaderPrice(StatisticsCostDto costDto);

    FormalCostInfoDto getInfoByFormalIdAndUserId(@Param("formallineId") Long formallineId, @Param("id") Long id);

    List<LeaderExamineCostDto> getLeaderCostList(LeaderExamineCostDto dto);

    FormalCostInfoDto getformalInfo(@Param("id") Long id);
}
