package com.brightease.bju.controller.pre;

import cn.hutool.db.PageResult;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.PreRegistrationRecordDto;
import com.brightease.bju.bean.dto.PreRegistrationRecordVO;
import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import com.brightease.bju.bean.dto.PreRegistrationStatisticsVO;
import com.brightease.bju.bean.dto.predto.AreaEnterpriseMonth;
import com.brightease.bju.bean.pre.PreLineStatistics;
import com.brightease.bju.service.pre.PreLineService;
import com.brightease.bju.service.pre.PreLineStatisticsService;
import com.brightease.bju.shiro.ShiroUtils;
import com.brightease.bju.util.ExcelUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("/preRegistration")
@Api(value = "预报名",tags = "预报名")
public class PreRegistrationController {
    @Resource
    private PreLineService preLineService;
    @Resource
    private PreLineStatisticsService preLineStatisticsService;

    /**
     * 查询当前企业能看到的预报名路线
     * @return
     */
    @GetMapping("getCourrentPreLines")
    @ApiOperation("查询当前企业预报名路线,ttl为路线状态，0为报名未开始，1为开始报名，2为查看报名，3为报名已结束,4为已报名并且报名结束")
    @ResponseBody
    public CommonResult getCourrentPreLines(@RequestParam(value = "userType",required = false) Long userType
                                            ){
        return preLineService.getCourrentPreLines( ShiroUtils.getUserId(),userType,LocalDateTime.now());
    }

    /**
     * 前往报名页面
     * @param preId
     * @return
     */
    @GetMapping("toRegister")
    @ApiOperation("去往报名页面,通过路线id查询出VO")
    @ResponseBody
    public CommonResult toRegister(@RequestParam("preId") Long preId){
        return preLineService.toUpdatePreLines(preId);
    }

    /**
     * 执行报名操作
     * @param preLineStatistics
     * @return
     */
    @PostMapping("doRegister")
    @ApiOperation("执行报名操作")
    @ResponseBody
    public CommonResult doRegister(@RequestBody List<PreLineStatistics> preLineStatistics){
       preLineStatisticsService.saveBatch(preLineStatistics);
       return CommonResult.success(null,"报名成功");
    }

    /**
     * 查看报名信息
     * @param preId
     * @return
     */
    @GetMapping("findRegistration")
    @ApiOperation("查看报名信息")
    @ResponseBody
    public CommonResult findRegistration(@RequestParam("preId") Long preId, @RequestParam("userType") Long userType){
        return CommonResult.success(preLineStatisticsService.findByPreId(preId,userType, ShiroUtils.getUserId()));
    }

    /**
     * 修改报名信息
     * @param preLineStatistics
     * @return
     */
    @PostMapping("updateRegistration")
    @ApiOperation("修改报名信息")
    @ResponseBody
    public CommonResult updateRegistration(@RequestBody List<PreLineStatistics> preLineStatistics){
        return preLineService.updateRegistration(preLineStatistics, ShiroUtils.getUserId());
    }

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
                                                   @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
                                                   @RequestParam(value = "beginTime",required = false) String beginTime,
                                                   @RequestParam(value = "overTime",required = false) String overTime){
        PageHelper.startPage(pageNum,pageSize);
        preRegistrationStatisticsVO.setStartTime(beginTime);
        preRegistrationStatisticsVO.setEndTime(overTime);
        preRegistrationStatisticsVO.setEnterpriseId(ShiroUtils.getUserId());
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
    public void downloadTemplate(HttpServletResponse response, PreRegistrationStatisticsVO preRegistrationStatisticsVO) {
        List<PreRegistrationStatisticsDto> dateList = preLineService.findPreRegistrationCountByConditions(preRegistrationStatisticsVO);
        ExcelUtils.writeExcel(response,dateList, PreRegistrationStatisticsDto.class,"报名统计.xls");
    }

    /**
     * 预报名记录的条件查询
     * @param preRegistrationRecordVO
     * @return
     */
    @GetMapping("preGistrationStatictisRecord")
    @ApiOperation("预报名记录条件查询")
    @ResponseBody
    public CommonResult preGistrationStatictisRecord(PreRegistrationRecordVO preRegistrationRecordVO,
                                                     @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                                     @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        PageHelper.startPage(pageNum,pageSize);
        preRegistrationRecordVO.setEnterPriseId(ShiroUtils.getUserId());
        List<PreRegistrationRecordDto> dataList = preLineService.findPreRegistrationRecordDto(preRegistrationRecordVO, ShiroUtils.getUserId());
        return CommonResult.success(CommonPage.restPage(dataList),"查询成功");
    }

    /**
     * 预报名记录管理的查看详情
     * @param preId
     * @return
     */
    @GetMapping("preGistrationStatictisRecordViewDetail")
    @ApiOperation("预报名记录管理的查看详情")
    @ResponseBody
    public CommonResult preGistrationStatictisRecordViewDetail(@RequestParam("preId")@ApiParam("路线preId") Long preId){
        List<PreLineStatistics> preLineStatistics  = preLineStatisticsService.list(new QueryWrapper<>(new PreLineStatistics().setPreId(preId)));
        return CommonResult.success(CommonPage.restPage(preLineStatistics),"查询成功");
    }

    /**
     *    根据路线id查找该路线对应的月份,地区，企业和相应的id   名字和id集合
     *    预报名的开始报名功能需要的controller
     * @param preId
     * @return
     */
    @GetMapping("findAreaEnterpriseMonth")
    @ApiOperation("据路线id查找该路线对应的月份,地区，企业和相应的id <名字和id集合>")
    @ResponseBody
    public CommonResult findAreaEnterpriseMonth(@RequestParam("preId") Long preId,
                                                @RequestParam(value = "userType",required = false) Long userType){
        return CommonResult.success(preLineService.findAreaEnterpriseMonth(preId,userType,ShiroUtils.getUserId()),"查询成功");
    }

    /**
     *    根据路线id查找该路线对应的月份,地区，企业和相应的id   名字和id集合
     *    预报名的开始报名功能需要的controller
     * @param preId
     * @return
     */
    @GetMapping("findPreLineDetail")
    @ApiOperation("据路线id查找该路线对应的月份,地区，企业和相应的id <名字和id集合>")
    @ResponseBody
    public CommonResult preLineDetail(@RequestParam("preId") Long preId,
                                      @RequestParam(value = "userType",required = false) Long userType,
                                      @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                      @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        return preLineService.findPreDetail(pageNum,pageSize,preId,userType,ShiroUtils.getUserId());
    }

}
