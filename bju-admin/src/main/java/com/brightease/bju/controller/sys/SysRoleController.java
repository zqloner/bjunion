package com.brightease.bju.controller.sys;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.rolesandnewsdto.RoleAndMenusDto;
import com.brightease.bju.bean.sys.SysAdminRole;
import com.brightease.bju.bean.sys.SysRole;
import com.brightease.bju.service.sys.SysAdminRoleService;
import com.brightease.bju.service.sys.SysRoleService;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * <p>
 * 系统角色表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/sysRole")
@Api(value = "系统角色管理",tags = "角色设置")
public class SysRoleController {

    @Autowired
    private SysRoleService sysRoleService;
    @Autowired
    private SysAdminRoleService sysAdminRoleService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "查询角色列表",notes = "查询角色")
    public CommonResult getList(@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){

        PageHelper.startPage(pageNum,pageSize);
        return CommonResult.success(CommonPage.restPage(sysRoleService.getList()));
   }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加角色", notes = "添加角色")
    public CommonResult add(SysRole role, @RequestParam(value = "ids[]",required = false)List<Long> ids) {
        return sysRoleService.addRole(role,ids);
    }

    @GetMapping("/toUpdateRole")
    @ResponseBody
    @ApiOperation(value = "到达修改界面")
    public CommonResult toUpdateRole(@RequestParam("id") Long id) {
        return sysRoleService.toUpdateRole(id);
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "修改角色信息", notes = "修改角色")
    public CommonResult update(SysRole role,@RequestParam(value = "ids[]",required = false)List<Long> ids){
        return sysRoleService.updateRole(role,ids);
    }

    @GetMapping("/deleteRole")
    @ResponseBody
    @ApiOperation(value = "删除角色信息",notes = "删除角色")
    public CommonResult deleteRole(@RequestParam("id") Long id) {
        if(sysAdminRoleService.list(new QueryWrapper<>(new SysAdminRole().setRoleId(id)))!=null &&sysAdminRoleService.list(new QueryWrapper<>(new SysAdminRole().setRoleId(id))).size()>0){
            return CommonResult.failed("已有管理员关联该角色,不能删除");
        }
        return CommonResult.success(sysRoleService.deleteRole(id));
    }


}
