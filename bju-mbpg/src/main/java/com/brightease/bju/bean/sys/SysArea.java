package com.brightease.bju.bean.sys;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 地区信息表
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysArea implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "ID", type = IdType.AUTO)
    private Long id;

    @TableField("PARENT_ID")
    private Long parentId;

    @TableField("REGION_ID")
    private Long regionId;

    @TableField("REGION_PARENT_ID")
    private Long regionParentId;

    @TableField("REGION_NAME")
    private String regionName;

    /**
     * 1省 2市 3区
     */
    @TableField("REGION_TYPE")
    private Integer regionType;

    @TableField("ZIPCODE")
    private String zipcode;

    @TableField("QUHAO")
    private String quhao;

    @TableField("Status")
    private Boolean Status;


}
