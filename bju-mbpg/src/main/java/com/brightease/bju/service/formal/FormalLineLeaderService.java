package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.LeaderLeaderDto;
import com.brightease.bju.bean.formal.FormalLineLeader;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 线路领队关联表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalLineLeaderService extends IService<FormalLineLeader> {

    CommonResult addLeader(Long formalLindeId, Long leaderId);

    CommonResult updateLeader(Long formalLindeId, Long leaderId);

    CommonResult getLeaderList(LeaderLeaderDto leaderDto, Integer pageNum, Integer pageSize);

    public List<LeaderLeaderDto> exportLeaderList(LeaderLeaderDto leaderDto);
}
