package com.brightease.bju.service.sanatorium.impl;

import com.brightease.bju.bean.sanatorium.SanatoriumBrief;
import com.brightease.bju.dao.sanatorium.SanatoriumBriefMapper;
import com.brightease.bju.service.sanatorium.SanatoriumBriefService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 疗养简介 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class SanatoriumBriefServiceImpl extends ServiceImpl<SanatoriumBriefMapper, SanatoriumBrief> implements SanatoriumBriefService {
    @Autowired
    private SanatoriumBriefMapper mapper;
    @Override
    public List<SanatoriumBrief> getList() {
        return mapper.getList();
    }
}
