package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineEnterpriseDto;
import com.brightease.bju.bean.dto.FormalLineEnterpriseParams;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
import com.brightease.bju.shiro.ShiroUtils;
import com.github.pagehelper.PageHelper;
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
 * 正式报名关联企业人数表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalLineEnterprise")
@Api(value = "正式线路企业报名信息",tags = "正式线路企业报名信息")
public class FormalLineEnterpriseController {

    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("正式线路报名审计")
    public CommonResult list(FormalLineEnterpriseDto enterpriseDto,
                             @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                             @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        Long enterpriseId = ShiroUtils.getUserId();
        return formalLineEnterpriseService.getList(enterpriseDto,enterpriseId,pageNum,pageSize);
    }


    @GetMapping("/regList")
    @ResponseBody
    @ApiOperation("正式报名记录")
    public CommonResult regList(FormalLineEnterpriseParams params,
                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        params.setEId(ShiroUtils.getUserId());
        return formalLineEnterpriseService.regRecord(params, pageNum, pageSize);
    }

    @GetMapping("/regListPid")
    @ResponseBody
    @ApiOperation("正式报名记录")
    public CommonResult regListPid(FormalLineEnterpriseParams params,
                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        params.setPId(ShiroUtils.getUserId());
        return formalLineEnterpriseService.regRecord(params, pageNum, pageSize);
    }

    @GetMapping("/infoList")
    @ResponseBody
    @ApiOperation("查看线路下企业报名的详细信息")
    public CommonResult getInfoList(FormalLineEnterprise formalLineEnterprise,
                                    @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                    @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalLineEnterpriseService.getInfoList(formalLineEnterprise)));
    }
}
