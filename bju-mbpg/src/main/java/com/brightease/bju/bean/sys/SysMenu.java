package com.brightease.bju.bean.sys;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 系统菜单表
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 0管理端 1用户端
     */
    private Integer type;

    /**
     * 名称
     */
    private String name;

    /**
     * 编码
     */
    private String code;

    private String icon;

    /**
     * url
     */
    private String url;

    /**
     * 权限
     */
    private String persmission;

    /**
     * 描述
     */
    private String descript;

    /**
     * 父级id
     */
    private Long pid;

    /**
     * 状态 0不可用 1可用
     */
    private Integer status;


}
