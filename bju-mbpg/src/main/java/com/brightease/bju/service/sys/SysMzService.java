package com.brightease.bju.service.sys;

import com.brightease.bju.bean.sys.SysMz;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-05
 */
public interface SysMzService extends IService<SysMz> {

    List<SysMz> getList();
}
