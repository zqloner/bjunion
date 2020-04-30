package com.brightease.bju.service.enterprise.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.enterprise.EnterpriseExamine;
import com.brightease.bju.dao.enterprise.EnterpriseExamineMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseExamineService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 企业审核 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class EnterpriseExamineServiceImpl extends ServiceImpl<EnterpriseExamineMapper, EnterpriseExamine> implements EnterpriseExamineService {
    @Autowired
    private EnterpriseExamineMapper mapper;

    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult changeExaminStatus(EnterpriseExamine examine) {
        EnterpriseEnterprise enterprise = enterpriseService.getById(examine.getExamineId());
        if (enterprise == null) {
            CommonResult.failed("审核企业不存在！");
        }
        EnterpriseEnterprise request = enterpriseService.getById(examine.getEnterpriseId());
        //增加一条审核记录
        save(examine.setExamineId(enterprise.getId()).setExamineName(enterprise.getName()).setCreateTime(LocalDateTime.now()).setRequestName(request.getName()));
        if (examine.getExamineStatus() == Constants.STATUS_VALID && enterprise.getId() == 1) {
            //如果是总工会并且审核通过，修改企业状态为已经通过
            enterpriseService.updateById(new EnterpriseEnterprise().setId(examine.getEnterpriseId()).setExamineStatus(Constants.EXAMINE_RESULT_YES).setUpdateTime(LocalDateTime.now()));
        } else if (examine.getExamineStatus() == Constants.STATUS_VALID && enterprise.getId() != 1) {
            //如果不是总工会，并且审核通过。设置状态为审核中
            enterpriseService.updateById(new EnterpriseEnterprise().setId(examine.getEnterpriseId()).setExamineStatus(Constants.EXAMINE_RESULT_ING).setUpdateTime(LocalDateTime.now()));
        } else {
            //设置审核不通过。
            enterpriseService.updateById(new EnterpriseEnterprise().setId(examine.getEnterpriseId()).setExamineStatus(Constants.EXAMINE_RESULT_NO).setUpdateTime(LocalDateTime.now()));
        }

        return CommonResult.success("操作成功");
    }

    @Override
    public List<EnterpriseExamine> getExamineList(EnterpriseExamine examine) {
        return list(new QueryWrapper<EnterpriseExamine>().eq("enterprise_id", examine.getEnterpriseId()).orderByDesc("create_time"));
    }
}
