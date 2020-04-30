package com.brightease.bju.controller.login;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.controller.BaseController;
import com.brightease.bju.shiro.LeaderUserToken;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * leader用户登录controller
 * Created by zhaohy on 2019/9/2.
 */
@Controller
@Api(value ="领队登录", tags = "领队登录")
public class LeaderLoginController extends BaseController {

    @PostMapping("/leaderlogin")
    @ResponseBody
    @ApiOperation(value = "领队登录")
    public CommonResult ajaxLogin(String username, String password) {
        LeaderUserToken token = new LeaderUserToken(username, password);
        Subject subject = SecurityUtils.getSubject();
        try {
            subject.login(token);
            System.out.println(ShiroUtils.getLeader().toString());
            return CommonResult.success(ShiroUtils.getLeader().toString());
        } catch (Exception e) {
            String msg = "用户名或密码错误";
            return CommonResult.failed(msg);
        }
    }
}
