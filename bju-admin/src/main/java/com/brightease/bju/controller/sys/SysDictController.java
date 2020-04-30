package com.brightease.bju.controller.sys;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.sys.SysDict;
import com.brightease.bju.service.sys.SysDictService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/sysDict")
@Api("字典")
public class SysDictController {
    @Autowired
    private SysDictService sysDictService;

    @GetMapping("/travel")
    @ResponseBody
    @ApiOperation("获取出行类型")
    public CommonResult getDictList(){
        return CommonResult.success(sysDictService.list(new QueryWrapper<>(new SysDict().setType("travel"))));
    }

    @GetMapping("/adminCost")
    @ResponseBody
    @ApiOperation("获取后台疗养费用明细")
    public CommonResult getAdminCostList(){
        return CommonResult.success(sysDictService.list(new QueryWrapper<>(new SysDict().setType(Constants.ADMIN_CSOT_TYPE))));
    }

    @GetMapping("/leaderCost")
    @ResponseBody
    @ApiOperation("获取后台疗养费用明细")
    public CommonResult getLeaderCostList(){
        return CommonResult.success(sysDictService.list(new QueryWrapper<>(new SysDict().setType(Constants.LEADER_CSOT_TYPE))));
    }
}
