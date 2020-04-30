package com.brightease.bju.controller.sys;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.homedto.HomeDto;
import com.brightease.bju.service.line.LineLineService;
import com.brightease.bju.service.sanatorium.SanatoriumSanatoriumService;
import com.brightease.bju.service.sys.SysNewsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller
@RequestMapping("/sysHome")
@Api("查询首页展示的内容")
public class SysHomeController {
    @Resource
    private SysNewsService sysNewsService;
    @Resource
    private LineLineService lineLineService;
    @Resource
    private SanatoriumSanatoriumService sanatoriumService;


    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("获取首页内容")
    public CommonResult findHome(){
        HomeDto homeDto = new HomeDto();
        homeDto.setNews(sysNewsService.getNewsList(null,null,null,null));
        homeDto.setLines(lineLineService.myIndex());
        homeDto.setSanatoriums(sanatoriumService.myIndex());
        return CommonResult.success(homeDto);
    }
}
