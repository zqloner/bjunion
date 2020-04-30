package com.brightease.bju.controller.statistics;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.dto.exportdto.ExportStatisticsCostDto;
import com.brightease.bju.bean.dto.formallinetatisticvo.SanatoriumGroupVo;
import com.brightease.bju.bean.formal.FormalCostInfo;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseUserService;
import com.brightease.bju.service.formal.FormalCostInfoService;
import com.brightease.bju.service.formal.FormalLineLeaderService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.service.sanatorium.SanatoriumSanatoriumService;
import com.brightease.bju.service.ticket.TicketInfoService;
import com.brightease.bju.util.ExcelUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Created by zhaohy on 2019/9/29.
 */
@Controller
@RequestMapping("/statistics")
@Api(value = "统计",tags = "统计")
public class StatisticsController {

    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    @Autowired
    private EnterpriseUserService userService;

    @Autowired
    private FormalLineUserService formalLineUserService;

    @Autowired
    private FormalCostInfoService formalCostInfoService;

    @Autowired
    private SanatoriumSanatoriumService sanatoriumService;

    @Autowired
    private TicketInfoService ticketInfoService;

    @Autowired
    private FormalLineLeaderService formalLineLeaderService;


    @GetMapping("/getEnterprisesCount")
    @ResponseBody
    @ApiOperation(value = "企业数量")
    public CommonResult getEnterprisesCount() {
        return enterpriseService.getCount();
    }

    @GetMapping("/getCountByUserType")
    @ResponseBody
    @ApiOperation(value = "统计不同类型的人数")
    public CommonResult getUserCount() {
        return userService.getUserCount();
    }

    @GetMapping("/getAllUsersCount")
    @ResponseBody
    @ApiOperation(value = "服务疗养疗养职工总人数")
    public CommonResult getAllUsers() {
        return CommonResult.success(formalLineUserService.count(new QueryWrapper<>(new FormalLineUser().setYesNo(Constants.TEAM_YES).setExamine(Constants.EXAMINE_PASS))));
    }

    @GetMapping("/getAllCostCount")
    @ResponseBody
    @ApiOperation(value = "疗养群体统计")
    public CommonResult getAllCostCount() {
        return CommonResult.success(formalCostInfoService.getAllCostSum());
    }

    @GetMapping("/getCostInfoList")
    @ResponseBody
    @ApiOperation("疗养群体统计")
    public CommonResult getCostInfoList(StatisticsCostDto costDto,
                                        @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        return formalLineUserService.getCostInfoList(costDto,pageNum,pageSize);
    }

    @GetMapping("/getCostInfoListNoPages")
    @ResponseBody
    @ApiOperation("疗养群体统计")
    public CommonResult getCostInfoListNoPages(StatisticsCostDto costDto){
        return formalLineUserService.getCostInfoListNoPage(costDto);
    }



    @GetMapping("/exportCostInfoList")
    @ResponseBody
    @ApiOperation("疗养群体统计列表导出")
    public void exportCostInfoList(StatisticsCostDto costDto, HttpServletResponse response){
        List<StatisticsCostDto> dataList = formalLineUserService.exportCostInfoList(costDto);
        ExcelUtils.createExcel(response, dataList, StatisticsCostDto.class, "疗养群体统计列表信息.xls");
    }

    @GetMapping("/getAllSanatoriumCount")
    @ResponseBody
    @ApiOperation("疗养院接待情况")
    public CommonResult getAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto,
                                              @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                              @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        return CommonResult.success(CommonPage.restPage(sanatoriumService.getAllSanatoriumCount(statisticsSanatoriumDto, pageNum, pageSize)));
    }

    @GetMapping("/exportAllSanatoriumCount")
    @ResponseBody
    @ApiOperation("疗养院接待情况列表导出")
    public void exportAllSanatoriumCount(StatisticsSanatoriumDto statisticsSanatoriumDto, HttpServletResponse response){
        List<StatisticsSanatoriumDto> dataList = sanatoriumService.exportAllSanatoriumCount(statisticsSanatoriumDto);
        ExcelUtils.createExcel(response, dataList, StatisticsSanatoriumDto.class, "疗养院接待情况列表信息.xls");
    }

    @GetMapping("getTraffic")
    @ResponseBody
    @ApiOperation("交通出行统计")
    public CommonResult getTraffic() {
        return ticketInfoService.getTraffic();
    }

    @GetMapping("getTrafficInfoList")
    @ResponseBody
    @ApiOperation("交通出行统计列表")
    public CommonResult getTrafficInfoList(StatisticsTicketDto ticketDto,
                                           @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                           @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return ticketInfoService.getTrafficInfoList(ticketDto,pageNum,pageSize);
    }

    @GetMapping("getTrafficInfoListNoPage")
    @ResponseBody
    @ApiOperation("交通出行统计列表")
    public CommonResult getTrafficInfoList(StatisticsTicketDto ticketDto) {
        return ticketInfoService.getTrafficInfoListNoPage(ticketDto);
    }


    @GetMapping("exportTrafficInfoList")
    @ResponseBody
    @ApiOperation("交通出行统计列表导出")
    public void exportTrafficInfoList(StatisticsTicketDto ticketDto, HttpServletResponse response) {
        List<StatisticsTicketDto> ticketDtos =  ticketInfoService.exportTrafficInfoList(ticketDto);
        ExcelUtils.createExcel(response, ticketDtos, StatisticsTicketDto.class, "交通出行统计列表信息.xls");
    }


    @GetMapping("getLeaderList")
    @ResponseBody
    @ApiOperation("领队统计")
    public CommonResult getLeaderList(LeaderLeaderDto leaderDto,
                                      @RequestParam(value = "age", required = false) String age,
                                      @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                      @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        if(age != null && age !="") {
            LocalDate date = LocalDate.parse(age, fmt);
            leaderDto.setBirthday(date);
        }
        return formalLineLeaderService.getLeaderList(leaderDto,pageNum,pageSize);
    }

    @GetMapping("exportLeaderList")
    @ResponseBody
    @ApiOperation("领队统计列表导出")
    public void exportLeaderList(LeaderLeaderDto leaderDto, HttpServletResponse response ,@RequestParam(value = "age", required = false) String age) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        if(age != null && age !="") {
            LocalDate date = LocalDate.parse(age, fmt);
            leaderDto.setBirthday(date);
        }
        List<LeaderLeaderDto> dataList = formalLineLeaderService.exportLeaderList(leaderDto);
        ExcelUtils.createExcel(response, dataList, LeaderLeaderDto.class, "领队统计列表信息.xls");
    }


}
