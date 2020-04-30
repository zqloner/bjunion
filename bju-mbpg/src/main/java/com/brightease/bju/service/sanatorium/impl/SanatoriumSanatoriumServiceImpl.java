package com.brightease.bju.service.sanatorium.impl;

import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.SanatoriumDto;
import com.brightease.bju.bean.dto.StatisticsSanatoriumDto;
import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import com.brightease.bju.dao.sanatorium.SanatoriumSanatoriumMapper;
import com.brightease.bju.service.sanatorium.SanatoriumSanatoriumService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养院 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class SanatoriumSanatoriumServiceImpl extends ServiceImpl<SanatoriumSanatoriumMapper, SanatoriumSanatorium> implements SanatoriumSanatoriumService {

    @Autowired
    private SanatoriumSanatoriumMapper sanatoriumMapper;

    @Override
    public CommonResult getList(SanatoriumSanatorium sanatorium, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(sanatoriumMapper.getList(sanatorium)));
    }

    @Override
    public CommonResult getListNoPage(SanatoriumSanatorium sanatorium) {
        return CommonResult.success(sanatoriumMapper.getList(sanatorium));
    }

    @Override
    public List<StatisticsSanatoriumDto> getAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto,int pageNum,int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return sanatoriumMapper.getAllSanatoriumCount(statisticsSanatoriumDto);
    }

    @Override
    public List<StatisticsSanatoriumDto> exportAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto) {
        return sanatoriumMapper.getAllSanatoriumCount(statisticsSanatoriumDto);
    }

    @Override
    public List<SanatoriumSanatorium> myIndex() {
        return sanatoriumMapper.myIndex();
    }
}
