package com.brightease.bju.dao.pre;

import com.brightease.bju.bean.pre.PreLineEnterprise;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 预报名企业关联（可报名企业） Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface PreLineEnterpriseMapper extends BaseMapper<PreLineEnterprise> {
    List<Long> getCountEnterPrise(@Param("id")Long id);
}
