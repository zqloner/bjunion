package com.brightease.bju.service.sys;

import com.brightease.bju.bean.dto.menudto.SysMenuDto;
import com.brightease.bju.bean.sys.SysMenu;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 系统菜单表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
public interface SysMenuService extends IService<SysMenu> {

    List<SysMenu> getlist(Long id);

    List<SysMenuDto> getMenuList();
}
