package com.brightease.bju.service.formal.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.LeaderLeaderDto;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineLeader;
import com.brightease.bju.bean.leader.LeaderLeader;
import com.brightease.bju.dao.formal.FormalLineLeaderMapper;
import com.brightease.bju.service.formal.FormalLineLeaderService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.leader.LeaderLeaderService;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <p>
 * 线路领队关联表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalLineLeaderServiceImpl extends ServiceImpl<FormalLineLeaderMapper, FormalLineLeader> implements FormalLineLeaderService {

    @Autowired
    private FormalLineService formalLineService;

    @Autowired
    private LeaderLeaderService leaderService;

    @Autowired
    private FormalLineLeaderMapper formalLineLeaderMapper;

    @Override
    public CommonResult addLeader(Long formalLindeId, Long leaderId) {
        FormalLine formalLine = formalLineService.getById(formalLindeId);
        if (formalLine == null) {
            return CommonResult.failed("线路不存在");
        }
        LeaderLeader leader = leaderService.getOne(new QueryWrapper<>(new LeaderLeader().setId(leaderId).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        if (leader == null) {
            return CommonResult.failed("领队不存在");
        }
        FormalLineLeader formalLineLeader = getOne(new QueryWrapper<>(new FormalLineLeader().setFormalId(formalLindeId)));
        List<FormalLine> formalLineLeaders = formalLineLeaderMapper.getLeaderStatus(leaderId);
        if (formalLineLeaders.size() > 0) {
            for (FormalLine lineLeader : formalLineLeaders) {
                //现在的时间断包含之前的
                if (formalLine.getSBenginTime().isBefore(lineLeader.getSBenginTime()) && formalLine.getSEndTime().isAfter(lineLeader.getSEndTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                //现在的时间断在之前的之内
                if (formalLine.getSBenginTime().isAfter(lineLeader.getSBenginTime()) && formalLine.getSEndTime().isBefore(lineLeader.getSEndTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                //前半段相交
                if (formalLine.getSEndTime().isBefore(lineLeader.getSEndTime()) && formalLine.getSEndTime().isAfter(lineLeader.getSBenginTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                //后半段相交
                if (formalLine.getSBenginTime().isBefore(lineLeader.getSEndTime()) && formalLine.getSBenginTime().isAfter(lineLeader.getSBenginTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                if (formalLine.getSBenginTime().isEqual(lineLeader.getSBenginTime())
                        || formalLine.getSEndTime().isEqual(lineLeader.getSEndTime())
                        || formalLine.getSBenginTime().isEqual(lineLeader.getSEndTime())
                        || formalLine.getSEndTime().isEqual(lineLeader.getSBenginTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
            }
        }
        return save(new FormalLineLeader().setFormalId(formalLindeId).setLeaderId(leaderId)) ? CommonResult.success("添加领队成功"):CommonResult.failed("添加失败");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateLeader(Long formalLindeId, Long leaderId) {
        FormalLine formalLine = formalLineService.getById(formalLindeId);
        if (formalLine == null) {
            return CommonResult.failed("线路不存在");
        }
        LeaderLeader leader = leaderService.getOne(new QueryWrapper<>(new LeaderLeader().setId(leaderId).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        if (leader == null) {
            return CommonResult.failed("领队不存在");
        }
        FormalLineLeader formalLineLeader = getOne(new QueryWrapper<>(new FormalLineLeader().setFormalId(formalLindeId)));
        List<FormalLine> formalLineLeaders = formalLineLeaderMapper.getLeaderStatus(leaderId);
        if (formalLineLeaders.size() > 0) {
            for (FormalLine lineLeader : formalLineLeaders) {
                //现在的时间断包含之前的
                if (formalLine.getSBenginTime().isBefore(lineLeader.getSBenginTime()) && formalLine.getSEndTime().isAfter(lineLeader.getSEndTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                //现在的时间断在之前的之内
                if (formalLine.getSBenginTime().isAfter(lineLeader.getSBenginTime()) && formalLine.getSEndTime().isBefore(lineLeader.getSEndTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                //前半段相交
                if (formalLine.getSEndTime().isBefore(lineLeader.getSEndTime()) && formalLine.getSEndTime().isAfter(lineLeader.getSBenginTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                //后半段相交
                if (formalLine.getSBenginTime().isBefore(lineLeader.getSEndTime()) && formalLine.getSBenginTime().isAfter(lineLeader.getSBenginTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
                if (formalLine.getSBenginTime().isEqual(lineLeader.getSBenginTime())
                        || formalLine.getSEndTime().isEqual(lineLeader.getSEndTime())
                        || formalLine.getSBenginTime().isEqual(lineLeader.getSEndTime())
                        || formalLine.getSEndTime().isEqual(lineLeader.getSBenginTime())) {
                    return CommonResult.failed("该领队已经被分配");
                }
            }
        }
        return updateById(formalLineLeader.setFormalId(formalLindeId).setLeaderId(leaderId)) ? CommonResult.success("修改成功") : CommonResult.failed("修改失败");
    }

    @Override
    public CommonResult getLeaderList(LeaderLeaderDto leaderDto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalLineLeaderMapper.getLeaderList(leaderDto)));
    }

    @Override
    public List<LeaderLeaderDto> exportLeaderList(LeaderLeaderDto leaderDto) {
        return formalLineLeaderMapper.getLeaderList(leaderDto) ;
    }

    /**
     * 检查线路和领队参数
     * @param formalLindeId
     * @param leaderId
     * @return
     */
    private CommonResult checkFormalAndLeader(Long formalLindeId, Long leaderId) {
        FormalLine formalLine = formalLineService.getById(formalLindeId);
        if (formalLine == null) {
            return CommonResult.failed("线路不存在");
        }
        LeaderLeader leader = leaderService.getOne(new QueryWrapper<>(new LeaderLeader().setId(leaderId).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        if (leader == null) {
            return CommonResult.failed("领队不存在");
        }
        return null;
    }
}
