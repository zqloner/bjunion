package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.formal.FormalLineExamine;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 * 正式报名审计 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalLineExamineMapper extends BaseMapper<FormalLineExamine> {

}
