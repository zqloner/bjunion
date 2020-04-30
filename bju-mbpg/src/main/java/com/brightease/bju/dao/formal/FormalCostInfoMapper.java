package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.formal.FormalCostInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用详情 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
@Mapper
@Repository
public interface FormalCostInfoMapper extends BaseMapper<FormalCostInfo> {

    List<Map<String,Object>> getCostInfoList(Map<String, Object> param);

    Map<String,Object> getAllCostSum();

    void delByCostId(Long costid);
}
