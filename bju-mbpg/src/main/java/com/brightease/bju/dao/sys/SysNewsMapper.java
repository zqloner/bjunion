package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.sys.SysNews;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 新闻 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SysNewsMapper extends BaseMapper<SysNews> {

    public List<SysNews> getNewsList(@Param("type")Integer type, @Param("title")String title, @Param("startTime")String startTime,@Param("endTime")String endTime);

    Long getMaxSort();
}
