package com.brightease.bju.controller.sys;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.service.sys.SysMzService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by zhaohy on 2019/10/12.
 */
@Controller
@RequestMapping("/sysMz")
@Api("民族")
public class SysMzController {

    @Autowired
    private SysMzService mzService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("获取民族")
    public CommonResult getList() {
        return CommonResult.success(mzService.getList());
    }
}
