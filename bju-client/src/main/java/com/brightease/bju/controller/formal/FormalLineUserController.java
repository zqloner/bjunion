package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.formallinedto.FormalLineVo;
import com.brightease.bju.bean.formal.FormalLineUser;
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
 * 正式报名的用户 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalLineUser")
@Api(value = "正式线路报名用户管理",tags = "正式线路报名用户管理")
public class FormalLineUserController {

    @Autowired
    private FormalLineUserService userService;

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation("正式线路报名")
    public CommonResult add(@RequestBody FormalLineVo formalLineVo) {
        Long enterpriseId = ShiroUtils.getUserId();
        return userService.add(formalLineVo.getUsers(),enterpriseId);
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation("报名修改")
    public CommonResult update(@RequestBody FormalLineVo formalLineVo) {
        Long enterpriseId = ShiroUtils.getUserId();
        return userService.updateRegeistUsers(formalLineVo.getUsers(),enterpriseId,formalLineVo.getForId());
    }

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "查看正式报名的用户",notes = "查看正式报名的用户")
    public CommonResult list(Long formalLineId,Long enterpriseId,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return userService.getFormalRecordUsers(enterpriseId, formalLineId,pageSize,pageNum);
    }

    @GetMapping("/regList")
    @ResponseBody
    @ApiOperation(value = "查看当前登录正式报名的用户",notes = "查看当前登录正式报名的用户")
    public CommonResult regList(Long formalLineId,Long enterpriseId) {
        return userService.getFormalRecordUsersNoPage(ShiroUtils.getUserId(), formalLineId);
    }

    @GetMapping("/auditlist")
    @ResponseBody
    @ApiOperation(value = "查看下级企业正式报名的用户",notes = "查看下级企业正式报名的用户")
    public CommonResult auditlist(Long formalLineId,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return userService.getNextEnterpriseRegUsers(formalLineId,pageNum,pageSize);
    }
}
