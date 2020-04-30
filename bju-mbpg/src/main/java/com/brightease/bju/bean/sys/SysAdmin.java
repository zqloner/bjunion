package com.brightease.bju.bean.sys;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 系统管理员
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysAdmin implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String name;

    private String salt;

    /**
     * 手机号
     */
    private String phone;

    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 状态 0不可用 1可用
     */
    private Integer status;

    //备注
    private  String note;


}
