package com.brightease.bju.dao.pre;

import com.brightease.bju.bean.pre.PreLineMonth;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 * 预报名月份关联 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface PreLineMonthMapper extends BaseMapper<PreLineMonth> {

}
