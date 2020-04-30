package com.brightease.bju.controller.enterprise;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.enterprise.EnterpriseExamine;
import com.brightease.bju.service.enterprise.EnterpriseExamineService;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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
@Api("企业审核")
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
    @ApiOperation("企业审核")
    public CommonResult updateExaminStatus(EnterpriseExamine examine) {
        Long id = ShiroUtils.getSysUser().getId();
        return examineService.changeExaminStatus(examine.setExamineId(id));
    }

    @GetMapping("/getExamineList")
    @ResponseBody
    @ApiOperation("审核列表")
    public CommonResult getExamineLog(Long id) {
        return CommonResult.success(examineService.getExamineList(new EnterpriseExamine().setEnterpriseId(id)));
    }
}
