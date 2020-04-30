package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalCostExamineDto;
import com.brightease.bju.service.formal.FormalCostExamineService;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
@Controller
@RequestMapping("/formalCostExamine")
@Api(value = "领队费用审核",tags = "领队费用审核")
public class FormalCostExamineController {
    @Autowired
    private FormalCostExamineService examineService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("获取审核list")
    public CommonResult getList(FormalCostExamineDto examineDto,
                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return examineService.getList(examineDto,pageNum,pageSize);
    }
    @PostMapping("/update")
    @ResponseBody
    @ApiOperation("修改审核状态")
    public CommonResult update(FormalCostExamineDto examineDto) {
        Long userId = ShiroUtils.getSysUser().getId();
        return examineService.updateExamineStatus(examineDto,userId);
    }

    @GetMapping("/getExamineList/{costId}")
    @ResponseBody
    @ApiOperation("领队上报费用审核的list")
    public CommonResult getExamineList(@PathVariable(value = "costId") Long costId) {
        return examineService.getExamineList(costId);
    }

}
