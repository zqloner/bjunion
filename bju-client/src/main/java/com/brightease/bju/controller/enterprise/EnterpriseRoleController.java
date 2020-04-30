package com.brightease.bju.controller.enterprise;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseRole;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.brightease.bju.service.enterprise.EnterpriseRoleService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 * 企业职工角色表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/enterpriseRole")
public class EnterpriseRoleController {

    @Autowired
    private EnterpriseRoleService enterpriseRoleService;

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加企业职工角色", notes = "添加企业角色")
    public CommonResult add(EnterpriseRole role) {

        enterpriseRoleService.addEnterpriseRole(role);

        return CommonResult.success(role);
    }
}
