package com.brightease.bju.controller.login;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.controller.BaseController;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 用户端登录
 * Created by zhaohy on 2019/9/3.
 */
@Controller
@Api("用户登录")
public class LoginController extends BaseController {

    @PostMapping("/login")
    @ResponseBody
    @ApiOperation("用户登录")
    public CommonResult login(String username, String password) {
        UsernamePasswordToken token = new UsernamePasswordToken(username, password);
        Subject subject = SecurityUtils.getSubject();
        try {
            subject.login(token);
            return CommonResult.success(ShiroUtils.getSysUser());
        } catch (Exception e) {
            String msg = "用户名或密码错误";
            return CommonResult.failed(msg);
        }
    }

    @GetMapping("/login")
    public String login() {
        return "";
    }

    @GetMapping("/register")
    public String register() {
        return "/register/register";
    }

}
