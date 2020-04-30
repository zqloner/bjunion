package com.brightease.bju.service.pre;

import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import com.brightease.bju.bean.pre.PreLineStatistics;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 预报名  企业  职工类型 关联 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface PreLineStatisticsService extends IService<PreLineStatistics> {
    List<PreLineStatistics> findByPreId(Long preId, Long userType,Long shiroId);
    List<PreLineStatistics> findByEnterprisIds(Long preId, Long userType,List<Long> shiroId);
//    List<PreRegistrationStatisticsDto> findByCurrentEnterPriseId(Long preId, Long userType,Long enterPriseId);
}
