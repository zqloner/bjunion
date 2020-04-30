package com.brightease.bju.controller.sys;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.sys.SysArea;
import com.brightease.bju.service.sys.SysAreaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 * 地区信息表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/sysArea")
@Api(value = "获取所有省份",tags = "获取所有省份")
public class SysAreaController {

    @Autowired
    private SysAreaService areaService;

    @GetMapping("/pList")
    @ResponseBody
    @ApiOperation(value = "修养基地，获取所有省份")
    public CommonResult getAllProvice() {
        return CommonResult.success(areaService.list(new QueryWrapper<>(new SysArea().setRegionType(1))));
    }

    @GetMapping("/cList")
    @ResponseBody
    @ApiOperation(value = "修养基地，根据省份查找城市")
    public CommonResult getCityByPId(@RequestParam Long pid) {
        if (pid == null) {
            return CommonResult.failed("参数错误");
        }
        return CommonResult.success(areaService.list(new QueryWrapper<>(new SysArea().setParentId(pid))));
    }


}
