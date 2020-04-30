package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.formal.FormalLineExamine;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 正式报名审计 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalLineExamineService extends IService<FormalLineExamine> {

    CommonResult examine(FormalLineExamine formalLineExamine);

    CommonResult examineByAdmin(FormalLineExamine formalLineExamine);
}
