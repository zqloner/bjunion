package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineDto;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.shiro.ShiroUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 正式报名线路 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalLine")
@Api(value = "正式线路",tags = "正式线路")
public class FormalLineController {

    @Autowired
    private FormalLineService formalLineService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("查看正式线路的列表")
    public CommonResult getList(Long type,Long userType,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                                        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        Long userId = ShiroUtils.getUserId();
        return formalLineService.getRegistList(userId,type,userType,pageNum,pageSize);
    }

    @GetMapping("/statistics")
    @ResponseBody
    @ApiOperation("报名统计")
    public CommonResult getStatisticsList(FormalLineDto formalLineDto,
                                          @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                          @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalLineService.getStatisticsList(formalLineDto.setPId(ShiroUtils.getUserId()))));
    }

    @GetMapping("/getInfoById/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id获取信息")
    public CommonResult getInfoById(@PathVariable(value = "id") Long id) {
        return CommonResult.success(formalLineService.getInfoById(id));
    }

    @GetMapping("/checkIsFirstFormalRecord")
    @ResponseBody
    @ApiOperation(value = "检验是否是一年之中第一次正式报名")
    public CommonResult checkIsFirstFormalRecord(@RequestParam(value = "userType") Long userType) {
        return formalLineService.checkIsFirstFormalRecord(ShiroUtils.getUserId(),userType);
    }
}
