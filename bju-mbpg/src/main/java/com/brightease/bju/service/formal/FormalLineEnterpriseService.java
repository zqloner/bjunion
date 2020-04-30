package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineEnterpriseDto;
import com.brightease.bju.bean.dto.FormalLineEnterpriseParams;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 正式报名关联企业人数表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalLineEnterpriseService extends IService<FormalLineEnterprise> {

    CommonResult getList(FormalLineEnterpriseDto enterpriseDto, Long enterpriseId, Integer pageNum, Integer pageSize);

    CommonResult regRecord(FormalLineEnterpriseParams params, Integer pageNum, Integer pageSize);

    List<FormalLineEnterprise> getInfoList(FormalLineEnterprise formalLineEnterprise);

    CommonResult getRegList(FormalLineEnterpriseParams dto, Integer pageNum, Integer pageSize);

    List<FormalLineEnterpriseDto> getRegListNoPage(FormalLineEnterpriseParams dto);
}
