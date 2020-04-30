package com.brightease.bju.bean.dto.rolesandnewsdto;

import com.brightease.bju.bean.sys.SysMenu;
import com.brightease.bju.bean.sys.SysRole;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 角色和对应的权限
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class RoleAndMenusDto extends SysRole {
    //角色对应的权限列表
    private List<SysMenu> menus;
}
