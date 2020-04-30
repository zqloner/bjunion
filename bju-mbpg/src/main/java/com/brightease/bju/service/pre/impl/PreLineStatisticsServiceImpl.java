package com.brightease.bju.service.pre.impl;

import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import com.brightease.bju.bean.pre.PreLineStatistics;
import com.brightease.bju.dao.pre.PreLineStatisticsMapper;
import com.brightease.bju.service.pre.PreLineStatisticsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * <p>
 * 预报名  企业  职工类型 关联 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class PreLineStatisticsServiceImpl extends ServiceImpl<PreLineStatisticsMapper, PreLineStatistics> implements PreLineStatisticsService {

    @Resource
    private PreLineStatisticsMapper preLineStatisticsMapper;
    @Override
    public List<PreLineStatistics> findByPreId(Long preId, Long userType,Long shiroId) {
        return preLineStatisticsMapper.findByPreId(preId,userType,shiroId);
    }

    @Override
    public List<PreLineStatistics> findByEnterprisIds(Long preId, Long userType,List<Long> shiroId) {
        return preLineStatisticsMapper.findByEnterprisIds(preId,userType,shiroId);
    }

//    @Override
//    public List<PreRegistrationStatisticsDto> findByCurrentEnterPriseId(Long preId, Long userType, Long enterPriseId) {
//        return preLineStatisticsMapper.findByCurrentEnterPriseId(preId,userType,enterPriseId);
//    }
}
