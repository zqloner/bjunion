package com.brightease.bju.dao.enterprise;

import com.brightease.bju.bean.enterprise.EnterpriseExamine;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 * 企业审核 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface EnterpriseExamineMapper extends BaseMapper<EnterpriseExamine> {

}
