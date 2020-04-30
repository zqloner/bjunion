package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.dto.menudto.SysMenuDto;
import com.brightease.bju.bean.sys.SysMenu;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 系统菜单表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Mapper
@Repository
public interface SysMenuMapper extends BaseMapper<SysMenu> {

    List<SysMenuDto> getMyMenus();
}
