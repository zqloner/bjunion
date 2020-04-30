package com.brightease.bju.service.leader.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.leader.LeaderLeader;
import com.brightease.bju.dao.leader.LeaderLeaderMapper;
import com.brightease.bju.service.leader.LeaderLeaderService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 领队 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Service
public class  LeaderLeaderServiceImpl extends ServiceImpl<LeaderLeaderMapper, LeaderLeader> implements LeaderLeaderService {
    @Autowired
    private LeaderLeaderMapper leaderMapper;

    @Override
    public LeaderLeader fingUserByUserLoginName(String username) {
        return leaderMapper.selectOne(new QueryWrapper<>(new LeaderLeader().setUsername(username).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
    }

    @Override
    public CommonResult getlist(LeaderLeader leaderLeader,int pageNum,int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.eq("is_del", Constants.DELETE_VALID);
        queryWrapper.eq("status", Constants.STATUS_VALID);
        if (leaderLeader != null) {
            if (leaderLeader.getUsername() != null && leaderLeader.getUsername() != "") {
                queryWrapper.like("username", leaderLeader.getUsername());
            }
            if (leaderLeader.getName() != null && leaderLeader.getName() != "") {
                queryWrapper.like("name", leaderLeader.getName());
            }
            if (leaderLeader.getSex() != null ) {
                queryWrapper.eq("sex", leaderLeader.getSex());
            }
            if (leaderLeader.getIDCard() != null && leaderLeader.getIDCard() != "") {
                queryWrapper.like("IDCard", leaderLeader.getIDCard());
            }
            if (leaderLeader.getGuideNum() != null && leaderLeader.getGuideNum() != "") {
                queryWrapper.like("guide_num", leaderLeader.getGuideNum());
            }
        }
        queryWrapper.orderByDesc("create_time");
        return CommonResult.success(CommonPage.restPage(list(queryWrapper)));
    }

    @Override
    public boolean ckoldpwd(Long id, String oldPwd,String newPwd) {
        LeaderLeader leaderLeader = getById(id);
        if (oldPwd.equals(leaderLeader.getPassword())){
            leaderLeader.setPassword(newPwd);
            updateById(leaderLeader);
            return true;
        }
        return false;
    }
}
