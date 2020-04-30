package com.brightease.bju.controller.sanatorium;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.SanatoriumOrderDto;
import com.brightease.bju.bean.dto.StatisticsCostDto;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by zhaohy on 2019/10/12.
 */
@Controller
@RequestMapping("/sanatoriumOrder")
@Api(value = "疗养订单",tags = "疗养订单")
public class SanatoriumOrderController {

    @Autowired
    private FormalLineService formalLineService;
    @Autowired
    private FormalLineUserService formalLineUserService;

    @GetMapping("/getList")
    @ResponseBody
    @ApiOperation("我的订单")
    public CommonResult getList(SanatoriumOrderDto orderDto,
                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        Long eid = ShiroUtils.getUserId();
        return formalLineService.getMySanatoriumOrderLis(orderDto.setEnterpriseId(eid), pageNum, pageSize);
    }


    @GetMapping("/info/{id}")
    @ResponseBody
    @ApiOperation("查看详情")
    public CommonResult getInfo(@PathVariable Long id,
                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        StatisticsCostDto dto = new StatisticsCostDto();
        dto.setFormallineId(id);
        dto.setEId(ShiroUtils.getUserId());
        return formalLineUserService.getCostInfoList(dto,pageNum,pageSize);
    }


}
