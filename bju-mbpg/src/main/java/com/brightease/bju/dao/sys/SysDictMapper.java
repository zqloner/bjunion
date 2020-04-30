package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.sys.SysDict;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 *  字典 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SysDictMapper extends BaseMapper<SysDict> {
    SysDict findByMothValue(String value);
}
