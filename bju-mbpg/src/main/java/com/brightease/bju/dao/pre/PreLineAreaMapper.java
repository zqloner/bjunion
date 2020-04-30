package com.brightease.bju.dao.pre;

import com.brightease.bju.bean.pre.PreLineArea;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 预报名 疗养地区 关联 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface PreLineAreaMapper extends BaseMapper<PreLineArea> {
    List<Long> getCountAreas(@Param("id") Long id);

}
