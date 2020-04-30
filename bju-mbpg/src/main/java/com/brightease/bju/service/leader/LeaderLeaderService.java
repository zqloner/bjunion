package com.brightease.bju.service.leader;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.leader.LeaderLeader;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 领队 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
public interface LeaderLeaderService extends IService<LeaderLeader> {
    LeaderLeader fingUserByUserLoginName(String username);

    CommonResult getlist(LeaderLeader leaderLeader,int pageNum,int pageSize);

    boolean ckoldpwd(Long id, String oldPwd,String newPwd);
}
