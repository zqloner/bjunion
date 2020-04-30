package com.brightease.bju.controller.sanatorium;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.sanatorium.SanatoriumBrief;
import com.brightease.bju.service.sanatorium.SanatoriumBriefService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
    @ApiOperation(value = "根据id查询详细信息")
    public CommonResult getById(@RequestParam("id") Long id) {
        return CommonResult.success(service.getById(id),"查询成功");
    }
}
