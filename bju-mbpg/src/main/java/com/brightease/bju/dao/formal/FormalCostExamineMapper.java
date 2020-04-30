package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.dto.FormalCostExamineDto;
import com.brightease.bju.bean.formal.FormalCostExamine;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
@Mapper
@Repository
public interface FormalCostExamineMapper extends BaseMapper<FormalCostExamine> {

    List<Map<String,Object>> getCostExamineStatus(Map<String, Object> param);

    List<FormalCostExamineDto> getList(FormalCostExamineDto examineDto);

    List<FormalCostExamine> getExamineList(@Param("costId") Long costId);
}
