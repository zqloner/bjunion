package com.brightease.bju.service.enterprise;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseRole;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 企业职工角色表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface EnterpriseRoleService extends IService<EnterpriseRole> {

   //添加企业职工角色
   CommonResult addEnterpriseRole(EnterpriseRole role);

}
