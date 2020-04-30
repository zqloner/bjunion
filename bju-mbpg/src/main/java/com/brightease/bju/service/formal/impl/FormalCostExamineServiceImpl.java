package com.brightease.bju.service.formal.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalCostExamineDto;
import com.brightease.bju.bean.formal.FormalCost;
import com.brightease.bju.bean.formal.FormalCostExamine;
import com.brightease.bju.dao.formal.FormalCostExamineMapper;
import com.brightease.bju.service.formal.FormalCostExamineService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.formal.FormalCostService;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
@Service
public class FormalCostExamineServiceImpl extends ServiceImpl<FormalCostExamineMapper, FormalCostExamine> implements FormalCostExamineService {

    @Autowired
    private FormalCostExamineMapper formalCostExamineMapper;
    @Autowired
    private FormalCostService formalCostService;
    @Override
    public CommonResult getCostExamineStatus(Map<String, Object> param) {

        CommonResult result = CommonResult.success(formalCostExamineMapper.getCostExamineStatus(param));

        return result;
    }

    @Override
    public CommonResult getList(FormalCostExamineDto examineDto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalCostExamineMapper.getList(examineDto)));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateExamineStatus(FormalCostExamineDto examineDto,Long userId) {
        FormalCost cost = formalCostService.getById(examineDto.getId());
        if (cost == null) {
            CommonResult.failed("参数错误！");
        }
        //同步审核状态
        formalCostService.updateById(new FormalCost().setId(cost.getId()).setExamineStatus(examineDto.getExamineStatus()));
        FormalCostExamine examine = new FormalCostExamine().setId(examineDto.getId()).setExamineId(userId)
                .setExamineStatus(examineDto.getExamineStatus()).setMessage(examineDto.getMessage());
        return update(examine, new QueryWrapper<>(new FormalCostExamine().setFormalCostId(cost.getId()))) ? CommonResult.success("审核成功"):CommonResult.failed("审核失败");
//        FormalCostExamine examine = getById(examineDto.getId());
//        if (examine == null) {
//            CommonResult.failed("参数错误！");
//        }
//        //同步审核状态
//        formalCostService.updateById(new FormalCost().setId(examine.getFormalCostId()).setExamineStatus(examineDto.getExamineStatus()));
//        return updateById(new FormalCostExamine().setId(examineDto.getId()).setExamineId(userId)
//                .setExamineStatus(examineDto.getExamineStatus())
//                .setMessage(examineDto.getMessage())) ? CommonResult.success("审核成功"):CommonResult.failed("审核失败");

    }

    @Override
    public CommonResult getExamineList(Long costId) {
        return CommonResult.success(formalCostExamineMapper.getExamineList(costId));
    }
}
