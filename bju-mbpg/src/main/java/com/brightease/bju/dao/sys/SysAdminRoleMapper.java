package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.sys.SysAdminRole;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.brightease.bju.bean.sys.SysMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 系统管理员角色中间表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SysAdminRoleMapper extends BaseMapper<SysAdminRole> {

    List<SysMenu> getUserMenus(@Param("id") Long id, @Param("type") Integer type);
}
