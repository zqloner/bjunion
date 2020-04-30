package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.formal.FormalCostInfo;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用详情 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
public interface FormalCostInfoService extends IService<FormalCostInfo> {

    CommonResult getCostInfoList(Map<String, Object> param);

    void saveCostInfos(Long costid,  String infolist);

    void delCostInfos(Long costid, String infolist);

    Map<String,Object> getAllCostSum();
}
