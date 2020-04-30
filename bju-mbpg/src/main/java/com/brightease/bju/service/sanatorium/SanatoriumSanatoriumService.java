package com.brightease.bju.service.sanatorium;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.StatisticsSanatoriumDto;
import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养院 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface SanatoriumSanatoriumService extends IService<SanatoriumSanatorium> {

    CommonResult getList(SanatoriumSanatorium sanatorium,int pageNum,int pageSize);
    CommonResult getListNoPage(SanatoriumSanatorium sanatorium);

    List<StatisticsSanatoriumDto> getAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto, int pageNum,int pageSize);

    public List<StatisticsSanatoriumDto> exportAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto);

    List<SanatoriumSanatorium> myIndex();
}
