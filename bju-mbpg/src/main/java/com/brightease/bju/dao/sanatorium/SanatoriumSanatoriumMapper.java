package com.brightease.bju.dao.sanatorium;

import com.brightease.bju.bean.dto.SanatoriumDto;
import com.brightease.bju.bean.dto.StatisticsSanatoriumDto;
import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养院 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SanatoriumSanatoriumMapper extends BaseMapper<SanatoriumSanatorium> {

    List<SanatoriumDto> getList(SanatoriumSanatorium sanatorium);

    List<StatisticsSanatoriumDto> getAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto);

    List<SanatoriumSanatorium> myIndex();
}
