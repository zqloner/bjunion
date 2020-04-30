package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.formal.FormalCostAppend;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用附件 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalCostAppendMapper extends BaseMapper<FormalCostAppend> {

    List<Map<String,Object>> getCostAppendList(Map<String, Object> param);

    void delAppendsByCostId(Long costid);
}
