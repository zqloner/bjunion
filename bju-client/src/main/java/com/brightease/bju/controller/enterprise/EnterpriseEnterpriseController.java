package com.brightease.bju.controller.enterprise;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.predto.EnterPriseZnodeDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.sys.SysArea;
import com.brightease.bju.service.PasswordService;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.sys.SysAreaService;
import com.brightease.bju.shiro.ShiroUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
    @Autowired
    private SysAreaService areaService;
    @Autowired
    private PasswordService passwordService;

    @PostMapping("/save")
    @ResponseBody
    @ApiOperation(value = "企业注册", notes = "企业注册")
    public CommonResult saveEnterprise(EnterpriseEnterprise enterprise) {
        return enterpriseService.addEnterprise(enterprise);
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "修改企业详细信息,提交审核" ,notes = "修改企业详细信息,提交审核")
    public CommonResult updateEnterprise(EnterpriseEnterprise enterprise) {
        return enterpriseService.updateAndWaitExamine(enterprise.setExamineStatus(Constants.EXAMINE_RESULT_WAIT));
    }

    @GetMapping("/changeModel/{id}")
    @ResponseBody
    @ApiOperation(value = "修改下级企业的劳模权限" ,notes = "修改下级企业的劳模权限")
    public CommonResult updateLowerLevelModel(@PathVariable("id") Long id) {
        return enterpriseService.updateLowerLevelModel(id);
    }

    @GetMapping("/batchUpdateModel")
    @ResponseBody
    @ApiOperation(value = "批量修改下级企业的劳模权限" ,notes = "批量修改下级企业的劳模权限")
    public CommonResult batchUpdateModel(@RequestParam("ids[]") List<Long> ids,Integer modelStatus){
        return enterpriseService.batchUpdateModel(ids, modelStatus);
    }

    @GetMapping("/restPassword/{id}")
    @ResponseBody
    @ApiOperation(value = "重置下级企业的密码" ,notes = "重置下级企业的密码")
    public CommonResult restPassword(@PathVariable("id") Long id) {
        return enterpriseService.restPassword(id);
    }

    @GetMapping("/getInfo/{id}")
    @ResponseBody
    @ApiOperation(value = "获取企业详细信息" ,notes = "根据id获取企业详细信息")
    public CommonResult getEnterprise(@PathVariable("id") Long id) {
        return CommonResult.success(enterpriseService.getById(id));
    }

    @GetMapping("/getLowerLevel")
    @ResponseBody
    @ApiOperation(value = "获取下级企业列表",notes = "获取下级企业列表")
    public CommonResult getLowerLevelEnterprise(EnterpriseEnterprise enterprise,
                                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        return CommonResult.success(CommonPage.restPage(enterpriseService.getLowerLevel(enterprise.setPid(ShiroUtils.getUserId()))));
    }

    @GetMapping("/getMyInfo")
    @ResponseBody
    @ApiOperation(value = "获取当前登录企业详细信息" ,notes = "获取当前登录企业详细信息")
    public CommonResult getMyInfo() {
        return CommonResult.success(enterpriseService.getById(ShiroUtils.getUserId()));
    }

    @GetMapping("/getList")
    @ResponseBody
    @ApiOperation(value = "获取企业List" ,notes = "获取企业List")
    public CommonResult getList(EnterpriseEnterprise enterprise) {
        return CommonResult.success(enterpriseService.getListNoPage(enterprise.setId(ShiroUtils.getUserId()).setPid(ShiroUtils.getUserId()).setStatus(Constants.STATUS_VALID).setStatus(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES)));
    }


    @GetMapping(value = {"/information"})
    public String information(Model model,Boolean pageFlag) {
        EnterpriseEnterprise e = ShiroUtils.getSysUser();
        if (e == null) {
            return "redirect:/route?name=index&noId=true";
        }
        EnterpriseDto enterprise = enterpriseService.getClientEnterpriseInfo(e.getId().longValue());
        if(enterprise.getExamineStatus() == null || enterprise.getExamineStatus() == 0 || pageFlag != null){
            List<SysArea> areas = areaService.list(new QueryWrapper<>(new SysArea().setRegionType(1)));
            List<EnterpriseDto> enterpriseList = enterpriseService.getListNoPage(new EnterpriseEnterprise().setStatus(Constants.STATUS_VALID).setStatus(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES));
            model.addAttribute("areas",areas);
            model.addAttribute("enterpriseList",enterpriseList);
            model.addAttribute("enterprise",enterprise);
            return "personal/information";
        }else{
            model.addAttribute("enterprise",enterprise);
            return "personal/toExamine";
        }
    }
    @GetMapping(value = {"/toExamine"})
    public String toExamine(Model model) {
        EnterpriseDto enterprise = enterpriseService.getClientEnterpriseInfo(ShiroUtils.getUserId());
        model.addAttribute("enterprise",enterprise);
        return "personal/toExamine";
    }

    @GetMapping(value = {"/companyDetails"})
    public String companyDetails(Model model,Long id) {
        EnterpriseDto enterprise = enterpriseService.getEnterpriseInfoById(id);
        model.addAttribute("enterprise",enterprise);
        return "personal/companyDetails";
    }

    @GetMapping("/getLowLevelEnterprise")
    @ResponseBody
    @ApiOperation(value = "获取当前登录企业及其下级企业" ,notes = "获取当前登录企业及其下级企业")
    public CommonResult getLowLevelEnterprise() {
        List<EnterPriseZnodeDto> enterprises = enterpriseService.findTwoEnterPrise(ShiroUtils.getUserId());
        EnterpriseEnterprise byId = enterpriseService.getById(ShiroUtils.getUserId());
        EnterPriseZnodeDto curentEnterprise = new EnterPriseZnodeDto();
        curentEnterprise.setId(byId.getId());
        curentEnterprise.setName(byId.getName());
        enterprises.add(0,curentEnterprise);
        return CommonResult.success(enterprises);
    }

    @GetMapping("/getLowLevelEnterpriseNotIsLaoMo")
    @ResponseBody
    @ApiOperation(value = "获取当前登录企业及其下级非劳模企业" ,notes = "获取当前登录企业及其下级非非劳模企业")
    public CommonResult getLowLevelEnterpriseNotIsLaoMo() {
        List<EnterPriseZnodeDto> enterprises = enterpriseService.findTwoEnterPriseNotIsLaoMo(ShiroUtils.getUserId());
        EnterpriseEnterprise byId = enterpriseService.getById(ShiroUtils.getUserId());
        EnterPriseZnodeDto curentEnterprise = new EnterPriseZnodeDto();
        curentEnterprise.setId(byId.getId());
        curentEnterprise.setName(byId.getName());
        enterprises.add(0,curentEnterprise);
        return CommonResult.success(enterprises);
    }
}
