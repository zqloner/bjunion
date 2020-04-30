package com.brightease.bju.controller.enterprise;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.brightease.bju.service.enterprise.EnterpriseUserService;
import com.brightease.bju.shiro.ShiroUtils;
import com.brightease.bju.util.ExcelUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * <p>
 * 企业职工表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Controller
@RequestMapping("/enterpriseUser")
@Api(value = "企业职工" ,tags = "企业职工")
public class EnterpriseUserController {

    @Autowired
    private EnterpriseUserService userService;

    @GetMapping("list")
    @ResponseBody
    @ApiOperation(value = "企业职工库",notes = "查询所有企业的职工")
    public CommonResult getList(EnterpriseUser user,Long userType, @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return userService.getList(user,userType,pageNum,pageSize);
    }

    @GetMapping("/downLoadUsersExcel")
    @ApiOperation("导出企业职工列表")
    public void downLoadUsersExcel(EnterpriseUser user, Long userType, HttpServletResponse response) {
        List<EnterpriseUser> users = userService.getListForDownLoad(user,userType);
        ExcelUtils.createExcel(response,users,EnterpriseUser.class,"企业职工.xls");
    }
}
