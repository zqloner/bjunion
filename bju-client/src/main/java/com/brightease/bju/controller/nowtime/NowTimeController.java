package com.brightease.bju.controller.nowtime;

import com.brightease.bju.api.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;

/**
 * 查询所有的地域，月份，企业，方便页面使用id渲染名字
 */
@Controller
@RequestMapping("/getCurrentTime")
@Api(value = "获取服务器时间",tags = "获取服务器时间")
public class NowTimeController {
    @GetMapping
    @ApiOperation("获取服务器时间")
    @ResponseBody
    public CommonResult getCurrentTime(){
        LocalDateTime localDateTime = LocalDateTime.now();
        return CommonResult.success(localDateTime);
    }
}
