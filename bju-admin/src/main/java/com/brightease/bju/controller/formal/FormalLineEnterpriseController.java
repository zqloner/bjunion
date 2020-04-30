package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineEnterpriseParams;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
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
public class FormalLineEnterpriseController {

    @Autowired
    private FormalLineEnterpriseService enterpriseService;
    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("正式报名审计list  查询企业报名人数")
    public CommonResult list(FormalLineEnterpriseParams dto,
                             @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                             @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        return enterpriseService.getRegList(dto,pageNum,pageSize);
    }

    @GetMapping("/infoList")
    @ResponseBody
    @ApiOperation("查看线路下企业报名的详细信息")
    public CommonResult getInfoList(FormalLineEnterprise formalLineEnterprise) {
        return CommonResult.success(formalLineEnterpriseService.getInfoList(formalLineEnterprise));
    }

}
