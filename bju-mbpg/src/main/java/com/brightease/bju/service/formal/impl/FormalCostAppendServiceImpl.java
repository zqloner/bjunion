package com.brightease.bju.service.formal.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.formal.FormalCostAppend;
import com.brightease.bju.dao.formal.FormalCostAppendMapper;
import com.brightease.bju.service.formal.FormalCostAppendService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用附件 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalCostAppendServiceImpl extends ServiceImpl<FormalCostAppendMapper, FormalCostAppend> implements FormalCostAppendService {

    @Autowired
    FormalCostAppendMapper formalCostAppendMapper;

    @Override
    public CommonResult getCostAppendList(Map<String, Object> param) {
        CommonResult result = CommonResult.success(formalCostAppendMapper.getCostAppendList(param));
        return result;
    }

    @Override
    public void saveCostAppends(Long costid, String appends) {
        //先删除已有的----状态更新为删除
        formalCostAppendMapper.delAppendsByCostId(costid);
        //再新增列表中的
        if(null!=appends&&!"".equals(appends)){
            JSONArray jsonArray = JSONArray.parseArray(appends);

            for (int j=0;j<jsonArray.size();j++){
                String info = jsonArray.get(j).toString();
                JSONObject parseObject = JSON.parseObject(info);

                FormalCostAppend formalCostAppend = new FormalCostAppend();

                String name = parseObject.get("name").toString();
                String url = parseObject.get("url").toString();

                formalCostAppend.setName(name);
                formalCostAppend.setUrl(url);
                formalCostAppend.setCostId(costid);
                formalCostAppend.setCreateTime(LocalDateTime.now());
                formalCostAppend.setIsDel(Constants.DELETE_VALID);
                formalCostAppend.setStatus(Constants.STATUS_VALID);
                save(formalCostAppend);
            }
        }

    }

    @Override
    public void delCostAppends(Long costid, String appendlist) {
        formalCostAppendMapper.delAppendsByCostId(costid);
    }
}
