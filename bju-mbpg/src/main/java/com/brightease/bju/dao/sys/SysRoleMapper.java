package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.dto.rolesandnewsdto.RoleAndMenusDdo;
import com.brightease.bju.bean.dto.rolesandnewsdto.RoleAndMenusDto;
import com.brightease.bju.bean.sys.SysRole;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 系统角色表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SysRoleMapper extends BaseMapper<SysRole> {

    RoleAndMenusDto getRoleMenus(@Param("roleId") Long roleId);
    List<RoleAndMenusDdo> getList();
}
