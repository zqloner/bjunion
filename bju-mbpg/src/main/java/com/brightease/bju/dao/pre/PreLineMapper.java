package com.brightease.bju.dao.pre;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.dto.predto.AreaEnterpriseMonth;
import com.brightease.bju.bean.pre.PreLine;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 预报名线路 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface PreLineMapper extends BaseMapper<PreLine> {
    List<PreLineDto> findPreByConditions(@Param("userType") Long userType, @Param("title") String title, @Param("type") Integer type,@Param("shiroId")Long shiroId);
   //是否下发
    List <Long> findPreIsNext(@Param("preId")Long preId,@Param("shiroId")Long shiroId);
    PreLineVTO findVtoById(@Param("id") Long id, @Param("userType") Long userType, @Param("nowTime") LocalDateTime nowTime);
    List<PreRegistrationStatisticsDto> findPreRegistrationStatisticsCountInfo(PreRegistrationStatisticsVO preRegistrationStatisticsVO);
    List<PreRegistrationRecordDto> findPreRecordByCondition(PreRegistrationRecordVO registrationRecordVO);
    PreRegistrationRecordDto lookPreRecordByCondition(@Param("preId") Long preId, @Param("userType") Long userType, @Param("enterPriseId") Long enterPriseId);
//    <!-- 根据路线id查找该路线对应的月份,地区，企业和相应的id  -->
    AreaEnterpriseMonth findAreaEnterpriseMonth(@Param("preId") Long preId);
//        <!--通过路线id和企业id查询出报名记录-->
    List<PreRegistrationStatisticsDto> findpreRegistrationStatisticsDtos(@Param("preId") Long preId, @Param("userType") Long userType, @Param("enterPriseId") Long enterPriseId);

    Long getLowerChildId(@Param("preId")Long preId,@Param("shiroId")Long shiroId);
}
