package com.brightease.bju.service.formal.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.FormalCostInfoDto;
import com.brightease.bju.bean.dto.LeaderExamineCostDto;
import com.brightease.bju.bean.dto.StatisticsCostDto;
import com.brightease.bju.bean.dto.StatisticsCostFormalLineDto;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.brightease.bju.bean.formal.*;
import com.brightease.bju.dao.formal.FormalCostMapper;
import com.brightease.bju.service.enterprise.EnterpriseUserService;
import com.brightease.bju.service.formal.*;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import java.util.Map;

/**
 * <p>
 * 疗养费用详情 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalCostServiceImpl extends ServiceImpl<FormalCostMapper, FormalCost> implements FormalCostService {
    @Autowired
    private FormalCostAppendService appendService;
    @Autowired
    private FormalLineService formalLineService;
    @Autowired
    private FormalCostInfoService costInfoService;
    @Autowired
    private FormalCostInfoService formalCostInfoServiceImpl;
    @Autowired
    private FormalCostAppendService formalCostAppendServiceImpl;
    @Autowired
    private FormalCostExamineService formalCostExamineServiceImpl;
    @Autowired
    private FormalCostMapper formalCostMapper;
    @Autowired
    private EnterpriseUserService userService;

    /**
     * 查询当前领队所带团费用情况
     * */
    @Override
    public CommonResult getFormalCostList(Map<String, Object> param, int startNumber, Integer pageSize) {
        PageHelper.startPage(startNumber, pageSize);
        CommonResult result = CommonResult.success(CommonPage.restPage(formalCostMapper.getFormalCostList(param)));
        return result;
    }

    @Override
    public List<StatisticsCostFormalLineDto> getZghPrice(StatisticsCostDto costDto) {
        return formalCostMapper.getZghPrice(costDto);
    }

    @Override
    public List<StatisticsCostFormalLineDto> getLeaderPrice(StatisticsCostDto costDto) {
        return formalCostMapper.getLeaderPrice(costDto);
    }

    @Override
    public FormalCostInfoDto getInfoByUserId(Long formallineId, Long id) {
        return formalCostMapper.getInfoByFormalIdAndUserId(formallineId,id);
    }

    @Override
    public CommonResult getLeaderCostList(LeaderExamineCostDto dto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalCostMapper.getLeaderCostList(dto)));
    }

    @Override
    public CommonResult saveCostInfoList(Long leaderid, String formalid, String lineid, String totalmoney, String costid, String infolist, String appendlist) {

        try{
            BigDecimal price = new BigDecimal(totalmoney);
            //费用表
            FormalCost formalCost = new FormalCost();
            formalCost.setPrice(price);
            formalCost.setExamineStatus(Constants.COST_STATUS_WAITING);

            Long thecostid = 0l;
            if(null==costid||"".equals(costid)){
                formalCost.setIsLeader(1);
                formalCost.setIsDel(Constants.DELETE_VALID);
                formalCost.setStatus(Constants.STATUS_VALID);
                formalCost.setCreateTime(LocalDateTime.now());
                formalCost.setFormalId(Long.valueOf(formalid));
                formalCost.setLineId(Long.valueOf(lineid));
                save(formalCost);
                thecostid = formalCost.getId();
            }else {
                thecostid = Long.valueOf(costid);
                formalCost.setId(thecostid);
                updateById(formalCost);
            }

            //审核表
            FormalCostExamine formalCostExamine = new FormalCostExamine();
            formalCostExamine.setReqId(leaderid);
            formalCostExamine.setMessage("费用提交，待审核");
            formalCostExamine.setIsDel(Constants.DELETE_VALID);
            formalCostExamine.setStatus(Constants.STATUS_VALID);
            formalCostExamine.setFormalCostId(thecostid);
            formalCostExamine.setExamineStatus(Constants.EXAMINE_WAITING);
            formalCostExamine.setCreateTime(LocalDateTime.now());
            formalCostExamineServiceImpl.save(formalCostExamine);

            //保存列表与附件数据
            formalCostInfoServiceImpl.saveCostInfos(thecostid,infolist);
            formalCostAppendServiceImpl.saveCostAppends(thecostid,appendlist);
            return CommonResult.success("提交成功！");
        }catch (Exception e){
            System.out.println(e);
            return CommonResult.failed("提交失败！");
        }
    }

    @Override
    public CommonResult getCostList(String lineName,Long status, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalCostMapper.getCostList(lineName,status)));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addFormalCost(List<FormalCostInfo> costList, List<FormalCostAppend> appends, Long id) {
        FormalLine formalLine = formalLineService.getById(id);
        if (formalLine == null) {
            return CommonResult.failed("线路不存在");
        }
        BigDecimal all = costList.stream().map(FormalCostInfo::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        FormalCost cost = new FormalCost();
        cost.setCreateTime(LocalDateTime.now()).setFormalId(formalLine.getId()).setLineId(formalLine.getLineId())
                .setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)
                .setIsLeader(Constants.STATUS_INVALID).setPrice(all);
        save(cost);
        costList.forEach(i->i.setCostId(cost.getId()).setCreateTime(LocalDateTime.now())
                .setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID));
        costInfoService.saveBatch(costList);
        appends.forEach(i->i.setCostId(cost.getId()).setFormalId(formalLine.getId())
                .setCreateTime(LocalDateTime.now()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID));
        appendService.saveBatch(appends);
        return CommonResult.success("添加费用成功");
    }

    @Override
    public CommonResult getInfoById(Long id,Integer isLeader) {
        FormalCostInfoDto formalCostInfoDto = formalCostMapper.getInfoById(id,isLeader);
        if (formalCostInfoDto == null) {
            formalCostInfoDto = formalCostMapper.getformalInfo(id);
        }
        List<FormalCostInfo> infos = formalCostInfoServiceImpl.list(new QueryWrapper<>(new FormalCostInfo().setCostId(formalCostInfoDto.getId()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        for (FormalCostInfo info : infos) {
            if (info.getCostType()!= null && info.getCostType().equals("2")) {
                EnterpriseUser user = userService.getById(info.getUserId());
                info.setCostUser(user.getName());
            }else {
                info.setCostUser("所有人");
            }
        }
        List<FormalCostAppend> appends = formalCostAppendServiceImpl.list(new QueryWrapper<>(new FormalCostAppend().setCostId(formalCostInfoDto.getId()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        formalCostInfoDto.setInfos(infos);
        formalCostInfoDto.setAppends(appends);
        return CommonResult.success(formalCostInfoDto);
    }
}
