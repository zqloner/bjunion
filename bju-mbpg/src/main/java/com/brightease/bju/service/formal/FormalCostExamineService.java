package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalCostExamineDto;
import com.brightease.bju.bean.formal.FormalCostExamine;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
public interface FormalCostExamineService extends IService<FormalCostExamine> {

    CommonResult getCostExamineStatus(Map<String, Object> param);

    CommonResult getList(FormalCostExamineDto examineDto, Integer pageNum, Integer pageSize);

    CommonResult updateExamineStatus(FormalCostExamineDto examineDto,Long userId);

    CommonResult getExamineList(Long costId);
}
