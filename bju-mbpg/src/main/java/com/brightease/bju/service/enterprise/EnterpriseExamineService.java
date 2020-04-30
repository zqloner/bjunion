package com.brightease.bju.service.enterprise;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseExamine;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 企业审核 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface EnterpriseExamineService extends IService<EnterpriseExamine> {

    CommonResult changeExaminStatus(EnterpriseExamine examine);

    List<EnterpriseExamine> getExamineList(EnterpriseExamine examine);
}
