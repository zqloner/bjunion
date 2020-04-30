package com.brightease.bju.service.sys.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.rolesandnewsdto.RoleAndMenusDdo;
import com.brightease.bju.bean.dto.rolesandnewsdto.RoleAndMenusDto;
import com.brightease.bju.bean.sys.SysMenu;
import com.brightease.bju.bean.sys.SysRole;
import com.brightease.bju.bean.sys.SysRoleMenu;
import com.brightease.bju.dao.sys.SysRoleMapper;
import com.brightease.bju.service.sys.SysMenuService;
import com.brightease.bju.service.sys.SysRoleMenuService;
import com.brightease.bju.service.sys.SysRoleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 系统角色表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class SysRoleServiceImpl extends ServiceImpl<SysRoleMapper, SysRole> implements SysRoleService {

    @Autowired
    SysRoleMapper sysRoleMapper;

    @Autowired
    SysRoleMenuService sysRoleMenuService;

    @Autowired
    SysMenuService sysMenuService;



    @Override
    public  List<RoleAndMenusDdo> getList() {
        List<RoleAndMenusDdo> roles = sysRoleMapper.getList();
        return roles;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addRole(SysRole role, List<Long> ids) {
        save(role.setCreateTime(LocalDateTime.now()));
        if(ids !=null && ids.size()>0){
            ids.forEach(x->sysRoleMenuService.save(new SysRoleMenu().setMenuId(x).setRoleId(role.getId())));
        }
        return CommonResult.success(null,"添加成功");
    }

    @Override
    public CommonResult toUpdateRole(Long id) {
        return CommonResult.success(sysRoleMapper.getRoleMenus(id));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateRole(SysRole role, List<Long> ids) {
            saveOrUpdate(role);
            sysRoleMenuService.remove(new QueryWrapper<>(new SysRoleMenu().setRoleId(role.getId())));
            if(ids !=null && ids.size()>0){
                ids.forEach(item->sysRoleMenuService.save(new SysRoleMenu().setRoleId(role.getId()).setMenuId(item)));
            }
            return CommonResult.success(null,"修改成功");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult deleteRole(Long id) {
        sysRoleMenuService.remove(new QueryWrapper<>(new SysRoleMenu().setRoleId(id)));
        removeById(id);
       return CommonResult.success(null,"删除成功");
    }

}


