package com.brightease.bju.service.enterprise.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseRole;
import com.brightease.bju.dao.enterprise.EnterpriseRoleMapper;
import com.brightease.bju.service.enterprise.EnterpriseRoleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 企业职工角色表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class EnterpriseRoleServiceImpl extends ServiceImpl<EnterpriseRoleMapper, EnterpriseRole> implements EnterpriseRoleService {

    @Autowired
    private EnterpriseRoleMapper enterpriseRoleMapper;
    @Autowired
    private EnterpriseRoleService enterpriseRoleService;

    @Override
    public CommonResult addEnterpriseRole(EnterpriseRole role) {

        if (role.getType() != null){

            if (role.getType() == 1 || role.getType() == 2 || role.getType() == 3) {

                enterpriseRoleService.save(role);
            }
                return CommonResult.success(role);
        }else {
           return CommonResult.failed("添加失败");
        }
    }
}