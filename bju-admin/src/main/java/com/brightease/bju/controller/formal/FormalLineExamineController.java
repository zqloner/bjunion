package com.brightease.bju.controller.formal;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.formal.FormalLineExamine;
import com.brightease.bju.service.formal.FormalLineExamineService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 * 正式报名审计 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalLineExamine")
public class FormalLineExamineController {

    @Autowired
    private FormalLineExamineService examineService;

    @GetMapping("/examine")
    @ResponseBody
    @ApiOperation("审核是否通过 examinStatus 0 不通过 1通过")
    public CommonResult examine(FormalLineExamine formalLineExamine) {
        return examineService.examineByAdmin(formalLineExamine.setExamineId(1l).setExamineName("北京总工会"));
    }

    @GetMapping("/examineList")
    @ResponseBody
    @ApiOperation("审核记录list")
    public CommonResult examineListByFleId(FormalLineExamine formalLineExamine) {
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.eq("formal_line_enterprise_id", formalLineExamine.getFormalLineEnterpriseId());
        queryWrapper.orderByDesc("update_time");
        return CommonResult.success(examineService.list(queryWrapper));
    }


}
