package com.brightease.bju.task;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.formal.FormalCost;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.service.formal.FormalCostService;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * Created by zhaohy on 2019/10/12.
 */
@Component
@Configuration
public class LineStatusChangeTask {
    @Autowired
    private FormalLineService formalLineService;
    @Autowired
    private FormalCostService formalCostService;
    @Autowired
    private FormalLineUserService formalLineUserService;

    /**
     * 每天凌晨执行一次
     * 查询线路状态为5（票务购票） 判断是否到达出团时间。是修改状态为 4(出团中)
     */
    @Scheduled(cron = "0 0 0 * * ? ")
    private void changeTeamOut() {
        LocalDate localDate = LocalDate.now();
        List<FormalLine> formalLines = formalLineService.list(new QueryWrapper<>(new FormalLine().setLineStatus(Constants.LINE_STATUS_BUY_TICKET)));
        formalLines.stream().filter(i->i.getSBenginTime().isBefore(localDate)?true:false).forEach(i->i.setLineStatus(Constants.LINE_STATUS_OUT).setUpdateTime(LocalDateTime.now()));
        formalLineService.updateBatchById(formalLines);
    }

    /**
     * 每天凌晨执行一次
     * 查询线路状态为4（出团中） 判断是否到达疗养结束时间。是修改状态为 7(已结束)
     */
    @Scheduled(cron = "0 5 0 * * ? ")
    private void teamEnd() {
        LocalDate localDate = LocalDate.now();
        List<FormalLine> formalLines = formalLineService.list(new QueryWrapper<>(new FormalLine().setLineStatus(Constants.LINE_STATUS_OUT)));
        formalLines.stream().filter(i->i.getSEndTime().isBefore(localDate)?true:false).forEach(i->i.setLineStatus(Constants.LINE_STATUS_END).setUpdateTime(LocalDateTime.now()));
        formalLineService.updateBatchById(formalLines);
    }


    /**
     * 每天凌晨执行一次
     * 查询线路状态为6（待结算） 判如果后台添加了费用。并且领队提交的费用已经审核。就改成结束7
     */
    @Scheduled(cron = "0 10 0 * * ? ")
    private void costEnd() {
        List<FormalLine> formalLines = formalLineService.list(new QueryWrapper<>(new FormalLine().setLineStatus(Constants.LINE_STATUS_CALC)));
        formalLines.stream().filter(i-> {
            FormalCost  formalCost = formalCostService.getOne(new QueryWrapper<>(new FormalCost().setFormalId(i.getId()).setIsLeader(Constants.COST_IS_LEADER)));
            FormalCost  formalCost1 = formalCostService.getOne(new QueryWrapper<>(new FormalCost().setFormalId(i.getId()).setIsLeader(Constants.COST_IS_NOT_LEADER)));
            if(formalCost!=null && formalCost1!=null && formalCost.getExamineStatus()!=null && formalCost.getExamineStatus() == Constants.COST_STATUS_PASS){
                return true;
            }
            return false;
        }).forEach(i->i.setLineStatus(Constants.LINE_STATUS_END).setUpdateTime(LocalDateTime.now()));
        formalLineService.updateBatchById(formalLines);
    }

    /**
     * 每天凌晨执行一次
     * 释放那些报名了但是没有出团的路线的用户
     */
    @Scheduled(cron = "0 15 0 * * ? ")
    private void releaseUsers() {
        List<FormalLine> formalLines = formalLineService.getFormalLinesForRecord(LocalDate.now(),Constants.LINE_STATUS_OUT);
        for (FormalLine formalLine : formalLines) {
            List<FormalLineUser> userList = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser().setFormalId(formalLine.getId())));
            userList.forEach(x->x.setYesNo(Constants.USER_YES_N0_NO));
            if (userList!=null && userList.size() > 0) {
                formalLineUserService.updateBatchById(userList);
            }
        }
    }
}
