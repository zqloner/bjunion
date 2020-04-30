package com.brightease.bju.service.sys.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.SysAdminDto;
import com.brightease.bju.bean.sys.SysAdmin;
import com.brightease.bju.bean.sys.SysAdminRole;
import com.brightease.bju.dao.sys.SysAdminMapper;
import com.brightease.bju.service.sys.SysAdminRoleService;
import com.brightease.bju.service.sys.SysAdminService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 系统管理员 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
@Service
public class SysAdminServiceImpl extends ServiceImpl<SysAdminMapper, SysAdmin> implements SysAdminService {

    @Autowired
    private SysAdminMapper adminMapper;

    @Autowired
    private SysAdminRoleService sysAdminRoleService;

    @Override
    @Transactional(rollbackFor = Exception.class)

    public SysAdmin fingUserByUserLoginName(String loginName) {

        return adminMapper.selectOne(new QueryWrapper<>(new SysAdmin().setUsername(loginName).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
    }

    @Override
    public List<SysAdminDto> getAountList() {
        return adminMapper.getAountList();
    }


    @Override
    public SysAdminDto getAcountById(Long id) {
        return adminMapper.getAcountById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addAdmin(SysAdmin admin, Long id) {
        List<SysAdmin> admins = list(new QueryWrapper<>(new SysAdmin().setUsername(admin.getUsername()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        if (CollectionUtil.isNotEmpty(admins)) {
            return CommonResult.failed("账号已存在");
        }
        save(admin.setCreateTime(LocalDateTime.now()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID));
        sysAdminRoleService.save(new SysAdminRole().setAdminId(admin.getId()).setRoleId(id));
        return CommonResult.success("null", "新增成功");
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateAdmin(SysAdmin admin, Long roleId) {

        SysAdmin sysAdmin = adminMapper.selectById(admin.getId());
        sysAdmin.setNote(admin.getNote());
        sysAdmin.setPassword(admin.getPassword());
        sysAdmin.setUsername(admin.getUsername());
        adminMapper.updateById(sysAdmin);
        SysAdminRole sysAdminRole = sysAdminRoleService.getOne(new QueryWrapper<>(new SysAdminRole().setAdminId(admin.getId()))).setRoleId(roleId);
        sysAdminRoleService.saveOrUpdate(sysAdminRole);
        return CommonResult.success(admin);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult deleteAdmin(Long id) {
        saveOrUpdate(getById(id).setIsDel(Constants.DELETE_INVALID));
        sysAdminRoleService.remove(new QueryWrapper<>(new SysAdminRole().setAdminId(id)));
        return CommonResult.success(null, "删除成功");
    }

    @Override
    public CommonResult changePassword(Long id) {
        saveOrUpdate(getById(id).setPassword(new Md5Hash("111111").toHex()));
        return CommonResult.success("null", "重置密码成功");
    }

    @Override
    public CommonResult updatePwd(Long id, String newPwd, String oldPwd) {
        SysAdmin my = getById(id);
        if (!my.getPassword().equals(oldPwd)) {
            return CommonResult.failed("原始密码错误");
        }
        return CommonResult.success(updateById(new SysAdmin().setId(my.getId()).setPassword(newPwd)));
    }
}
