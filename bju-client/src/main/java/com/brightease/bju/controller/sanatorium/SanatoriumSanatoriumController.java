package com.brightease.bju.controller.sanatorium;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import com.brightease.bju.service.sanatorium.SanatoriumSanatoriumService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/lsit")
    @ResponseBody
    @ApiOperation(value = "疗养院查询",notes = "疗养院查询")
    public CommonResult getList(SanatoriumSanatorium sanatorium, @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "8") Integer pageSize) {
        return sanatoriumService.getList(sanatorium,pageNum,pageSize);
    }

    @GetMapping("/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id查看疗养院",notes = "根据id查看疗养院")
    public CommonResult getbyId(@PathVariable("id") Long id) {
        return CommonResult.success(sanatoriumService.getById(id));
    }
}
