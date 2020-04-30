package com.brightease.bju.controller.enterprise;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.enterprise.EnterpriseExamine;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseExamineService;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 企业审核 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/enterpriseExamine")
@Api(value = "企业审计",tags = "企业审计")
public class EnterpriseExamineController {

    @Autowired
    private EnterpriseExamineService examineService;

    /**
     * 审核企业信息，是否通过
     * @param examine
     * @return
     */
    @PostMapping("/changeStauts")
    @ResponseBody
    @ApiOperation(value = "审核企业是否通过",notes = "审核企业是否通过")
    public CommonResult updateExaminStatus(EnterpriseExamine examine) {
        //管理端设置审核企业为总工会。
        return examineService.changeExaminStatus(examine.setExamineId(1l));
    }

    @GetMapping("/getExamineList")
    @ResponseBody
    @ApiOperation(value = "企业审核记录",notes = "企业审核记录")
    public CommonResult getExamineLog(EnterpriseExamine examine) {
        return CommonResult.success(examineService.getExamineList(examine));
    }

}
