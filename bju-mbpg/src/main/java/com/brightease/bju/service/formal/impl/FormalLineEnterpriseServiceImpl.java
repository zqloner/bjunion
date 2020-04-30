package com.brightease.bju.service.formal.impl;

import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineEnterpriseDto;
import com.brightease.bju.bean.dto.FormalLineEnterpriseParams;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.dao.formal.FormalLineEnterpriseMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 正式报名关联企业人数表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalLineEnterpriseServiceImpl extends ServiceImpl<FormalLineEnterpriseMapper, FormalLineEnterprise> implements FormalLineEnterpriseService {

    @Autowired
    private FormalLineEnterpriseMapper mapper;

    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    @Override
    public CommonResult getList(FormalLineEnterpriseDto enterpriseDto, Long enterpriseId, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<EnterpriseEnterprise> enterprises = enterpriseService.getLowerLevelOld(enterpriseId);
        if(CollectionUtils.isEmpty(enterprises)){
            enterprises.add(new EnterpriseEnterprise().setId(enterpriseId));
        }
        return CommonResult.success(CommonPage.restPage(mapper.getList(enterpriseDto, enterprises)));
    }

    @Override
    public CommonResult regRecord(FormalLineEnterpriseParams params, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(mapper.getRegRecordList(params)));
    }

    @Override
    public List<FormalLineEnterprise> getInfoList(FormalLineEnterprise formalLineEnterprise) {
        return mapper.getInfoList(formalLineEnterprise);
    }

    @Override
    public CommonResult getRegList(FormalLineEnterpriseParams dto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(mapper.getRegRecordList(dto)));
    }

    @Override
    public List<FormalLineEnterpriseDto> getRegListNoPage(FormalLineEnterpriseParams dto) {
        return mapper.getRegRecordList(dto);
    }
}
