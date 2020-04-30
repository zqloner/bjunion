package com.brightease.bju.dao.pre;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import com.brightease.bju.bean.pre.PreLineStatistics;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 预报名  企业  职工类型 关联 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface PreLineStatisticsMapper extends BaseMapper<PreLineStatistics> {
    List<PreLineStatistics> findByPreId(@Param("preId") Long preId, @Param("userType") Long userType, @Param("enterPriseId") Long enterPriseId);
    List<PreLineStatistics> findByEnterprisIds(@Param("preId") Long preId, @Param("userType") Long userType, @Param("ids") List<Long> ids);

    //根据当前企业id查找报名信息
//    List<PreRegistrationStatisticsDto> findByCurrentEnterPriseId(@Param("preId") Long preId, @Param("userType") Long userType, @Param("enterPriseId") Long enterPriseId);

}
