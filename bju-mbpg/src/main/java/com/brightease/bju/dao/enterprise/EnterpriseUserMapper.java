package com.brightease.bju.dao.enterprise;

import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 企业职工表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Mapper
@Repository
public interface EnterpriseUserMapper extends BaseMapper<EnterpriseUser> {

    List<EnterpriseUser> getList(@Param("user") EnterpriseUser user, @Param("userType")String userType);

    List<Map<String,Object>> getUserCount();

    EnterpriseUser getUserById(@Param("id") Long id);

    List<EnterpriseUser> getEnterPriseUserList(@Param("user") EnterpriseUser user,@Param("userType") String typestr);
}
