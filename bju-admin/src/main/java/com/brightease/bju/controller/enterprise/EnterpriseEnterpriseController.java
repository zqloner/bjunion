package com.brightease.bju.controller.enterprise;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 企业表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
@Controller
@RequestMapping("/enterpriseEnterprise")
@Api(value = "企业管理",tags = "企业管理")
public class EnterpriseEnterpriseController {

    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    @GetMapping("/getList")
    @ResponseBody
    @ApiOperation(value = "获取企业List" ,notes = "获取企业List")
    public CommonResult getList(EnterpriseEnterprise enterprise,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return enterpriseService.getlist(enterprise.setStatus(Constants.STATUS_VALID).setStatus(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES),pageNum,pageSize);
    }

    @GetMapping("/getExamineList")
    @ResponseBody
    @ApiOperation(value = "获取待审核企业List" ,notes = "获取待审核企业List")
    public CommonResult getExamineList(EnterpriseEnterprise enterprise,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return enterpriseService.getlist(enterprise.setStatus(Constants.STATUS_VALID).setStatus(Constants.DELETE_VALID),pageNum,pageSize);
    }

    @GetMapping("/getEnterpriseAll")
    @ResponseBody
    @ApiOperation(value = "获取所有企业无分页" ,notes = "获取所有企业无分页")
    public CommonResult getEnterpriseAll(EnterpriseEnterprise enterprise) {
        return CommonResult.success(enterpriseService.getListNoPage(enterprise.setStatus(Constants.STATUS_VALID).setStatus(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES)));
    }

    @GetMapping("/getInfo/{id}")
    @ResponseBody
    @ApiOperation(value = "获取企业详细信息" ,notes = "根据id获取企业详细信息")
    public CommonResult getEnterprise(@PathVariable("id") Long id) {
        return CommonResult.success(enterpriseService.getEnterpriseInfoById(id));
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "修改企业详细信息" ,notes = "重置密码，或者修改权限,")
    public CommonResult updateEnterprise(EnterpriseEnterprise enterprise) {
        //如果是修改权限
        if (enterprise.getPid() != null) {
            //当前企业信息
            EnterpriseEnterprise old = enterpriseService.getById(enterprise.getId());
            //二级部门降级
            if (old.getPid() == 1 && enterprise.getPid() != 1) {
                //判断当前二级部门下是否有三级部门
                List<EnterpriseDto> enterprises = enterpriseService.getListNoPage(new EnterpriseEnterprise().setPid(old.getId()));
                if(enterprises.size()>0) return CommonResult.failed("当前企业有下属企业，不能修改为三级部门");
            }
            //判断目标部门是否是三级部门，如果是不可以修改
            EnterpriseEnterprise target = enterpriseService.getById(enterprise.getPid());
            if (target.getPid() != 1 && target.getPid()!= 0) {
                return CommonResult.failed("上级企业选择错误");
            }
            //如果是二级部门，默认开启劳模权限。三级部门默认关闭劳模权限
            if(enterprise.getPid() == 1){
                enterprise.setModelStatus(Constants.MODEL_STATUS_OPEN);
            }else{
                enterprise.setModelStatus(Constants.MODEL_STATUS_CLOSE);
            }
        }

        return CommonResult.success(enterpriseService.updateById(enterprise));
    }

    @PostMapping("/save")
    @ResponseBody
    @ApiOperation(value = "企业注册", notes = "企业注册")
    public CommonResult saveEnterprise(EnterpriseEnterprise enterprise) {
        return enterpriseService.addEnterprise(enterprise.setExamineStatus(Constants.EXAMINE_RESULT_NO_REQUEST));
    }

    @GetMapping("/findFirstEnterPrise")
    @ResponseBody
    @ApiOperation(value = "查询所有的一级企业", notes = "查询所有的一级企业")
    public CommonResult findFirstEnterPrise() {
        return CommonResult.success(enterpriseService.findFirstEnterPrise());
    }

    @GetMapping("/findTwoLevelEnterPrise")
    @ResponseBody
    @ApiOperation(value = "根据一级企业查询出二级单位", notes = "根据一级企业查询出二级单位")
    public CommonResult findTwoLevelEnterPrise(@RequestParam(value = "id",required = false) Long id) {
        return CommonResult.success(enterpriseService.findTwoEnterPrise(id));
    }

}
