package com.brightease.bju.dao.line;

import com.brightease.bju.bean.dto.LineLineDto;
import com.brightease.bju.bean.line.LineLine;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 路线 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface LineLineMapper extends BaseMapper<LineLine> {
    LineLine getByLineId(Long id);
    List<LineLine> myIndex();

    @Select("SELECT id,NAME,brief,pic_url,create_time,is_del,creator_id,creator_name,is_del,STATUS FROM line_line WHERE is_del = 1 AND STATUS = 1")
    List<LineLine> getListNoPage();

    List<LineLine> getList(LineLineDto dto);

    List<LineLine> getLineIdAndName();
}
