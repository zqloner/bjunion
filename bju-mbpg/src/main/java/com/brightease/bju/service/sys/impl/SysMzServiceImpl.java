package com.brightease.bju.service.sys.impl;

import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.sys.SysMz;
import com.brightease.bju.dao.sys.SysMzMapper;
import com.brightease.bju.service.sys.SysMzService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-05
 */
@Service
public class SysMzServiceImpl extends ServiceImpl<SysMzMapper, SysMz> implements SysMzService {
    @Autowired
    private RedisUtil redisUtil;

    @Override
    public List<SysMz> getList() {
        if (redisUtil.exists("mz")) {
           return JSON.parseObject(redisUtil.get("mz", Constants.REDIS_DB_0), new TypeReference<List<SysMz>>(){});
        }
        List<SysMz> mzs = list(new QueryWrapper<>(new SysMz()));
        redisUtil.set("mz", JSON.toJSONString(mzs), Constants.REDIS_DB_0);
        return mzs;
    }
}
