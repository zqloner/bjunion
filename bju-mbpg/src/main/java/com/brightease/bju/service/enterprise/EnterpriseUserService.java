package com.brightease.bju.service.enterprise;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.baomidou.mybatisplus.extension.service.IService;
import com.brightease.bju.bean.line.LineLine;

import java.util.List;

/**
 * <p>
 * 企业职工表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
public interface EnterpriseUserService extends IService<EnterpriseUser> {

    CommonResult getList(EnterpriseUser user, Long userType, int pageNum, int pageSize);


    CommonResult getCurrentAndLowerUserList(EnterpriseUser user, Long userType, int pageNum, int pageSize);

    CommonResult delById(Long id);

    CommonResult addEnterpriseUser(EnterpriseUser user);

    CommonResult updateEnterpriseUser(EnterpriseUser user);

    CommonResult getUserCount();

    List<EnterpriseUser> getListForDownLoad(EnterpriseUser user, Long userType);


    EnterpriseUser getUserById(Long id);

    CommonResult delByIds(List<Long> ids);

    CommonResult getEnterpriseUserList(EnterpriseUser setEId, Long userType);
}
