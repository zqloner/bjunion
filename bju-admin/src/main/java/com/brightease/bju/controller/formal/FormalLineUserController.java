package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineEnterpriseDto;
import com.brightease.bju.bean.dto.FormalLineEnterpriseParams;
import com.brightease.bju.bean.dto.FormalLineUsersDto;
import com.brightease.bju.bean.dto.FormalLineUsersExportDto;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.util.ExcelUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
@Api(value = "正式线路人员管理",tags = "正式线路人员管理")
public class FormalLineUserController {

    @Autowired
    private FormalLineUserService formalLineUserService;
    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("正式线路人员列表")
    public CommonResult getUsers(FormalLineUsersDto formalLineUsersDto,
                                 @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                 @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return formalLineUserService.getUsers(formalLineUsersDto);
    }

    @PostMapping("/change")
    @ResponseBody
    @ApiOperation("调整人员到其他线路")
    public CommonResult updateUserToOtherLine(Long userId,Long oldLineId, Long otherLineId) {
        return formalLineUserService.updateUserToOtherLine(userId,oldLineId,otherLineId);
    }

    @GetMapping("/exportList")
    @ApiOperation(value = "导出正式报名的用户",notes = "导出正式报名的用户")
    public void exportUserList(HttpServletResponse response, FormalLineEnterpriseParams formalLineEnterpriseParams) {
        List<FormalLineEnterpriseDto> regListNoPage = formalLineEnterpriseService.getRegListNoPage(formalLineEnterpriseParams);
        List<Long> lineEnterPriseIds = regListNoPage.stream().map(FormalLineEnterpriseDto::getId).collect(Collectors.toList());
        List<FormalLineUsersExportDto> usersNoPage = new ArrayList<>();
        if (lineEnterPriseIds != null && lineEnterPriseIds.size() > 0) {
            usersNoPage = formalLineUserService.getUsersNoPage(lineEnterPriseIds);
        }
        ExcelUtils.createExcel(response,usersNoPage, FormalLineUsersExportDto.class,"正式报名用户.xls");
    }


}
