package com.brightease.bju.service.sys;

import com.brightease.bju.bean.sys.SysDict;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface SysDictService extends IService<SysDict> {
    SysDict findByValue(String value);
}
