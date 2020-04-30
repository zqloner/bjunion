package com.brightease.bju.controller.pre;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.service.pre.PreFindAllService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * 查询所有的地域，企业，以树形展示
 */
@Controller
@RequestMapping("/preFindAll")
@Api(value = "地域,企业全查，以树形展示",tags = "以树形展示，地域,企业全查")
public class PreFindAllController {
    @Resource
    private PreFindAllService preFindAllService;

    @GetMapping("findAll")
    @ApiOperation("查询出所有的地域，企业,以树形展示")
    @ResponseBody
    public CommonResult findAll() {
        return preFindAllService.preFindAll();
    }

    @GetMapping("findAllZondes")
    @ApiOperation("预报名统计单选树的全查")
    @ResponseBody
    public CommonResult findAllZonedes(){
        return preFindAllService.preFindAllZonede();
    }


}
