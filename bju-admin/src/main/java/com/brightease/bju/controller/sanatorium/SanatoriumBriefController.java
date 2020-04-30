package com.brightease.bju.controller.sanatorium;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.sanatorium.SanatoriumBrief;
import com.brightease.bju.service.sanatorium.SanatoriumBriefService;
import com.brightease.bju.service.sanatorium.SanatoriumSanatoriumService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;

/**
 * <p>
 * 疗养简介 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/sanatoriumBrief")
@Api(value = "疗养简介",tags = "疗养简介")
public class SanatoriumBriefController {

    @Autowired
    private SanatoriumBriefService service;

    @GetMapping("/getById")
    @ResponseBody
    @ApiOperation(value = "根据id查看详情")
    public CommonResult getById(Long id) {
        return CommonResult.success(service.getById(id));
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "编辑")
    public CommonResult update(SanatoriumBrief brief) {
        return service.updateById(brief.setUpdateTime(LocalDateTime.now())) ? CommonResult.success("修改成功"):CommonResult.failed("修改失败");
    }

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "查询list")
    public CommonResult getList() {
        return CommonResult.success(service.getList());
    }
}
