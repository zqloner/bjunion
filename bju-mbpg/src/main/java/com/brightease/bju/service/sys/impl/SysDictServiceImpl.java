package com.brightease.bju.service.sys.impl;

import com.brightease.bju.bean.sys.SysDict;
import com.brightease.bju.dao.sys.SysDictMapper;
import com.brightease.bju.service.sys.SysDictService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class SysDictServiceImpl extends ServiceImpl<SysDictMapper, SysDict> implements SysDictService {

    @Resource
    private SysDictMapper sysDictMapper;
    @Override
    public SysDict findByValue(String value) {
        return sysDictMapper.findByMothValue(value);
    }
}
