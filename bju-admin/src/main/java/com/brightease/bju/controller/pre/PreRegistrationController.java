package com.brightease.bju.controller.pre;

import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import com.brightease.bju.bean.dto.PreRegistrationStatisticsVO;
import com.brightease.bju.service.pre.PreLineService;
import com.brightease.bju.service.pre.PreLineStatisticsService;
import com.brightease.bju.util.ExcelUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("/preRegistration")
@Api(value = "预报名统计",tags = "预报名统计")
public class PreRegistrationController {
    @Resource
    private PreLineService preLineService;
    @Resource
    private PreLineStatisticsService preLineStatisticsService;

    /**
     * 这个是预报名统计的条件查询
     * @param preRegistrationStatisticsVO
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping("findPregistrationStatictis")
    @ApiOperation("预报名统计的条件查询")
    @ResponseBody
    public CommonResult findPregistrationStatictis(PreRegistrationStatisticsVO preRegistrationStatisticsVO,
                                                   @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                                   @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize)
    {
        PageHelper.startPage(pageNum,pageSize);
        List<PreRegistrationStatisticsDto> dataList = preLineService.findPreRegistrationCountByConditions(preRegistrationStatisticsVO);
        return CommonResult.success(CommonPage.restPage(dataList),"查询成功");
    }

    /**
     * 导出预报名统计
     * @param response
     * @param
     */
    @GetMapping("/downloadPregistrationStatictisCount")
    @ApiOperation("导出预报名统计")
    public void downloadTemplate(HttpServletResponse response, PreRegistrationStatisticsVO preRegistrationStatisticsVO)
    {
        List<PreRegistrationStatisticsDto> dateList = preLineService.findPreRegistrationCountByConditions(preRegistrationStatisticsVO);
        ExcelUtils.createExcel(response,dateList, PreRegistrationStatisticsDto.class,"预报名统计信息.xls");
    }

}
