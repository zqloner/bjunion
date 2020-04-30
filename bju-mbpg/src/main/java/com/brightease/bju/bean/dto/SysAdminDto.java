package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 管理员账号管理
 * Created by zhangqi on 2019/9/26.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysAdminDto {

    //Id
    private Long id;

    //账号
    private String admin;

    //角色名称
    private String name;

    //姓名
    private String realName;

    //手机号码
    private String tel;

    //添加时间
    private LocalDateTime  addTime;

    //角色id
    private Long roleId;
    //角色id
    private String password;
    //角色id
    private String note;

}
