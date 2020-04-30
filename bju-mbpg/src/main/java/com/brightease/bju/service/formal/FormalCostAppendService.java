package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.formal.FormalCostAppend;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用附件 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalCostAppendService extends IService<FormalCostAppend> {

    CommonResult getCostAppendList(Map<String, Object> param);

    void saveCostAppends(Long costid, String appendlist);

    void delCostAppends(Long costid, String appendlist);
}
