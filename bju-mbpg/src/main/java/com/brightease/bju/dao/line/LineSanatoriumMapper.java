package com.brightease.bju.dao.line;

import com.brightease.bju.bean.line.LineSanatorium;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 * 疗养院和线路中间表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface LineSanatoriumMapper extends BaseMapper<LineSanatorium> {

}
