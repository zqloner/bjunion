package com.brightease.bju.service.formal.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.formal.FormalCostInfo;
import com.brightease.bju.bean.sys.SysDict;
import com.brightease.bju.dao.formal.FormalCostInfoMapper;
import com.brightease.bju.service.formal.FormalCostInfoService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.sys.SysDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用详情 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-09
 */
@Service
public class FormalCostInfoServiceImpl extends ServiceImpl<FormalCostInfoMapper, FormalCostInfo> implements FormalCostInfoService {

    @Autowired
    private FormalCostInfoMapper formalCostInfoMapper;
    @Autowired
    private SysDictService sysDictServiceImpl;

    @Override
    public CommonResult getCostInfoList(Map<String, Object> param) {

        CommonResult result = CommonResult.success(formalCostInfoMapper.getCostInfoList(param));

        return result;
    }

    @Override
    public void saveCostInfos(Long costid,String infos) {
        //先删除所有已有数据
        formalCostInfoMapper.delByCostId(costid);
        //再新增修改后数据
        JSONArray jsonArray = JSONArray.parseArray(infos);

        for (int j=0;j<jsonArray.size();j++){

            String info = jsonArray.get(j).toString();
            JSONObject parseObject = JSON.parseObject(info);
            String costType = parseObject.get("costType").toString();
            String costInfoids = parseObject.get("costInfoid").toString();
            String userId = parseObject.get("userId").toString();
            String price = parseObject.get("price").toString();
            String remarks = parseObject.get("remarks").toString();

            FormalCostInfo formalCostInfo = new FormalCostInfo();
            formalCostInfo.setCostId(costid);
            formalCostInfo.setCostType(costType);

            if(null!=userId&&!"".equals(userId)){
                formalCostInfo.setUserId(Long.valueOf(userId));
            }
            if(null!=costInfoids&&!"".equals(costInfoids)){
                Long costInfoid = Long.valueOf(costInfoids);
                SysDict sysDict = sysDictServiceImpl.getById(costInfoids);
                formalCostInfo.setCostInfo(sysDict.getValue());
                formalCostInfo.setCostInfoId(costInfoid);
            }
            formalCostInfo.setPrice(new BigDecimal(price));
            formalCostInfo.setRemarks(remarks);
            formalCostInfo.setCreateTime(LocalDateTime.now());
            formalCostInfo.setIsDel(Constants.DELETE_VALID);
            formalCostInfo.setStatus(Constants.STATUS_VALID);
            save(formalCostInfo);
        }
    }

    @Override
    public void delCostInfos(Long costid, String infolist) {
        formalCostInfoMapper.delByCostId(costid);
    }

    @Override
    public Map<String, Object> getAllCostSum() {
        return formalCostInfoMapper.getAllCostSum();
    }
}
