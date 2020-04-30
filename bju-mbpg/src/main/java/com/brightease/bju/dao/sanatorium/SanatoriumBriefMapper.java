package com.brightease.bju.dao.sanatorium;

import com.brightease.bju.bean.sanatorium.SanatoriumBrief;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 疗养简介 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface SanatoriumBriefMapper extends BaseMapper<SanatoriumBrief> {

    @Select("SELECT id,model_name,update_time FROM sanatorium_brief WHERE is_del=1 AND STATUS = 1")
    List<SanatoriumBrief> getList();
}
