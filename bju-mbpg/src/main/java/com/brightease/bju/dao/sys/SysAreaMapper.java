package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.dto.AreasTreeDto;
import com.brightease.bju.bean.dto.predto.AreaZnodesDto;
import com.brightease.bju.bean.sys.SysArea;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 地区信息表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SysAreaMapper extends BaseMapper<SysArea> {
    List<AreasTreeDto> findAreasTree();

    List<AreaZnodesDto> findAreaZnodes();
}
