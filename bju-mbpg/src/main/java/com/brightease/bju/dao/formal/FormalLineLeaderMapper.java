package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.dto.LeaderLeaderDto;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineLeader;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 线路领队关联表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalLineLeaderMapper extends BaseMapper<FormalLineLeader> {

    List<LeaderLeaderDto> getLeaderList(LeaderLeaderDto leaderDto);

    List<FormalLine> getLeaderStatus(@Param("leaderId") Long leaderId);
}
