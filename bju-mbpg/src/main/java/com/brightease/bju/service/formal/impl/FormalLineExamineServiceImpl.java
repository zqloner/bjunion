package com.brightease.bju.service.formal.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.bean.formal.FormalLineExamine;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.dao.formal.FormalLineExamineMapper;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
import com.brightease.bju.service.formal.FormalLineExamineService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 正式报名审计 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalLineExamineServiceImpl extends ServiceImpl<FormalLineExamineMapper, FormalLineExamine> implements FormalLineExamineService {

    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;
    @Autowired
    private FormalLineService formalLineService;
    @Autowired
    private FormalLineUserService formalLineUserService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult examine(FormalLineExamine formalLineExamine) {
        FormalLineExamine f = new FormalLineExamine();
        save(f.setCreateTime(LocalDateTime.now()).setUpdateTime(LocalDateTime.now())
                .setFormalLineId(formalLineExamine.getFormalLineId())
                .setFormalLineEnterpriseId(formalLineExamine.getFormalLineEnterpriseId())
                .setExamineId(formalLineExamine.getId())
                .setEnterpriseId(formalLineExamine.getEnterpriseId())
                .setExamineName(formalLineExamine.getExamineName())
                .setMessage(formalLineExamine.getMessage())
                .setRequestName(formalLineExamine.getRequestName())
                .setExamineStatus(formalLineExamine.getExamineStatus()));
        if (f.getExamineStatus() == Constants.EXAMINE_PASS) {
            FormalLineEnterprise enterprise = formalLineEnterpriseService.getById(f.getFormalLineEnterpriseId());
            formalLineEnterpriseService.updateById(enterprise.setExamineStatus(Constants.EXAMINE_WAITING).setUpdateTime(LocalDateTime.now()));
        } else if (f.getExamineStatus() == Constants.EXAMINE_NO) {
            formalLineEnterpriseService.updateById(new FormalLineEnterprise().setId(f.getFormalLineEnterpriseId()).setExamineStatus(Constants.EXAMINE_RESULT_NO).setUpdateTime(LocalDateTime.now()));
            FormalLineEnterprise enterprise = formalLineEnterpriseService.getById(f.getFormalLineEnterpriseId());
            FormalLine formalLine = formalLineService.getById(enterprise.getFormalId());
            List<FormalLineUser> formalLineUsers = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser()
                    .setFormalId(f.getFormalLineId())
                    .setEnterpriseId(f.getEnterpriseId())
                    .setLineEnterpriseId(f.getFormalLineEnterpriseId())));
            //修改状态为
            if (formalLineUsers.size() > 0) {
                formalLineUsers.forEach(x->x.setExamine(Constants.EXAMINE_NO));
                formalLineUserService.updateBatchById(formalLineUsers);
            }
        }
        return  CommonResult.success("审核成功");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult examineByAdmin(FormalLineExamine formalLineExamine) {
        FormalLineExamine f = new FormalLineExamine();
        save(f.setCreateTime(LocalDateTime.now()).setUpdateTime(LocalDateTime.now())
                .setFormalLineId(formalLineExamine.getFormalLineId())
                .setFormalLineEnterpriseId(formalLineExamine.getFormalLineEnterpriseId())
                .setExamineId(formalLineExamine.getId())
                .setEnterpriseId(formalLineExamine.getEnterpriseId())
                .setExamineName(formalLineExamine.getExamineName())
                .setMessage(formalLineExamine.getMessage())
                .setRequestName(formalLineExamine.getRequestName())
                .setExamineStatus(formalLineExamine.getExamineStatus()));
        if (f.getExamineStatus() == Constants.EXAMINE_PASS) {
            FormalLineEnterprise enterprise = formalLineEnterpriseService.getById(f.getFormalLineEnterpriseId());
            //三级部门状态审核中。二级部门状态未审核
            if(enterprise.getExamineStatus() == Constants.EXAMINE_WAITING  || enterprise.getExamineStatus() == Constants.EXAMINE_RESULT_WAIT){
                //修改报名审核为已经通过
                enterprise.setExamineStatus(Constants.EXAMINE_RESULT_YES);
                enterprise.setUpdateTime(LocalDateTime.now());
                formalLineEnterpriseService.updateById(enterprise);
                FormalLine formalLine = formalLineService.getById(enterprise.getFormalId());
                //未成团更新报名人数，已成团不处理
                UpdateCount(f, formalLine);
            }

        } else if (f.getExamineStatus() == Constants.EXAMINE_NO) {
            formalLineEnterpriseService.updateById(new FormalLineEnterprise()
                    .setId(f.getFormalLineEnterpriseId())
                    .setExamineStatus(Constants.EXAMINE_RESULT_NO).setUpdateTime(LocalDateTime.now()));
            //同步人数
            //查询更改之后的用户
            List<FormalLineUser> formalLineUsers = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser()
                    .setFormalId(f.getFormalLineId())
                    .setEnterpriseId(f.getEnterpriseId())
                    .setLineEnterpriseId(f.getFormalLineEnterpriseId())));
            if (formalLineUsers.size() > 0) {
                formalLineUsers.forEach(x->x.setExamine(Constants.EXAMINE_NO));
                formalLineUserService.updateBatchById(formalLineUsers);
            }
        }
        return  CommonResult.success("审核成功");
    }

    /**
     *  同步人数,修改用户状态
     * @param f
     * @param formalLine
     */
    private void UpdateCount(FormalLineExamine f, FormalLine formalLine) {
        if (formalLine.getIsTeam() == null || formalLine.getIsTeam() == Constants.TEAM_NO) {
            int now = formalLine.getNowCount() == null ? 0 : formalLine.getNowCount();
            //查询新加之后的用户
            List<FormalLineUser> formalLineUsers = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser()
                    .setFormalId(f.getFormalLineId())
                    .setEnterpriseId(f.getEnterpriseId())
                    .setLineEnterpriseId(f.getFormalLineEnterpriseId())));
            now = formalLineUsers.size() + now;
            //修改状态为通过审核
            if (formalLineUsers.size() > 0) {
                formalLineUsers.forEach(x -> x.setExamine(Constants.EXAMINE_PASS));
                formalLineUserService.updateBatchById(formalLineUsers);
            }
            //同步人数
            formalLineService.updateById(formalLine.setNowCount(now).setUpdateTime(LocalDateTime.now()).setUpdateTime(LocalDateTime.now()));
        }
    }
}
