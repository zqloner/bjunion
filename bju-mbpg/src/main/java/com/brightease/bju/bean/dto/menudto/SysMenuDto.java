package com.brightease.bju.bean.dto.menudto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 权限(角色添加)
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysMenuDto {
    private Long id;
    private String name;
    private Long pid;
    private List<SysMenuDto> children;
}
