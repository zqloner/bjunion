package com.brightease.bju.controller.sanatorium;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import com.brightease.bju.service.sanatorium.SanatoriumSanatoriumService;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * <p>
 * 疗养院 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/sanatoriumSanatorium")
@Api(value = "疗养院管理",tags = "疗养院管理")
public class SanatoriumSanatoriumController {

    @Autowired
    private SanatoriumSanatoriumService sanatoriumService;

    @PostMapping("/lsit")
    @ResponseBody
    @ApiOperation(value = "疗养院查询",notes = "疗养院查询")
    public CommonResult getList(SanatoriumSanatorium sanatorium,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return sanatoriumService.getList(sanatorium,pageNum,pageSize);
    }

    @GetMapping("/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id查看疗养院",notes = "根据id查看疗养院")
    public CommonResult getbyId(@PathVariable("id") Long id) {
        return CommonResult.success(sanatoriumService.getById(id));
    }

    @PostMapping("/save")
    @ResponseBody
    @ApiOperation(value = "添加",notes = "疗养院添加")
    public CommonResult save(SanatoriumSanatorium sanatorium) {
        return CommonResult.success(sanatoriumService.save(sanatorium.setCreateTime(LocalDateTime.now()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "添加修改信息",notes = "疗养院信息修改")
    public CommonResult update(SanatoriumSanatorium sanatorium) {
        return CommonResult.success(sanatoriumService.updateById(sanatorium));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseBody
    @ApiOperation(value = "删除疗养院",notes = "删除疗养院")
    public CommonResult delete(@PathVariable("id") Long id) {
        return CommonResult.success(sanatoriumService.updateById(new SanatoriumSanatorium().setId(id).setIsDel(Constants.DELETE_INVALID)));
    }

    @GetMapping("/lsitNoPage")
    @ResponseBody
    @ApiOperation(value = "疗养院查询",notes = "疗养院查询")
    public CommonResult lsitNoPage(SanatoriumSanatorium sanatorium) {
        return sanatoriumService.getListNoPage(sanatorium);
    }


}
