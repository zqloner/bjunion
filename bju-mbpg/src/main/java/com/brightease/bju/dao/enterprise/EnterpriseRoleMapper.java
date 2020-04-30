package com.brightease.bju.dao.enterprise;

import com.brightease.bju.bean.enterprise.EnterpriseRole;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 * 企业职工角色表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface EnterpriseRoleMapper extends BaseMapper<EnterpriseRole> {

}
