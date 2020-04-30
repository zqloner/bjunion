package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.formal.FormalLineLeader;
import com.brightease.bju.service.formal.FormalLineLeaderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 * 线路领队关联表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalLineLeader")
@Api("分配领队")
public class FormalLineLeaderController {

    @Autowired
    private FormalLineLeaderService lineLeaderService;

    @PostMapping("/addLeader")
    @ResponseBody
    @ApiOperation("为已经成团的线路添加领队")
    public CommonResult addLeader(Long formalLindeId,Long leaderId){
        return lineLeaderService.addLeader(formalLindeId,leaderId);
    }

    @PostMapping("/updateLeader")
    @ResponseBody
    @ApiOperation("修改线路的领队")
    public CommonResult updateLeader(Long formalLindeId, Long leaderId) {
        return lineLeaderService.updateLeader(formalLindeId,leaderId);
    }

}
