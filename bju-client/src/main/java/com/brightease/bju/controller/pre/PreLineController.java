package com.brightease.bju.controller.pre;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.PreLineVO;
import com.brightease.bju.bean.pre.PreLine;
import com.brightease.bju.service.pre.PreLineService;
import com.brightease.bju.shiro.ShiroUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * <p>
 * 预报名线路 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/preLine")
@Api(value = "预报名任务下发",tags = "预报名任务下发设置")
public class PreLineController {

    @Resource
    private PreLineService preLineService;

    /**
     * 条件查询
     * @param userType
     * @param title
     * @param type
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping("findByConditions")
    @ApiOperation("预报名路线条件查询")
    @ResponseBody
    public CommonResult getPreLines(@RequestParam("userType") Long userType, String title, @ApiParam("不传为全查,0为未下发，1为已下发")@RequestParam(value = "type",required = false) Integer type,
                                    @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                    @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
        return preLineService.getPreLines(userType,title,type,pageNum,pageSize,ShiroUtils.getUserId());
    }

    /**
     *  新增下发路线(下发设置)
     * @param
     * @return
     */
    @PostMapping("addLowerPreLine")
    @ApiOperation("新增下发路线")
    @ResponseBody
    public CommonResult addPreLines(PreLine preLine,
                                    @RequestParam(value = "startTime",required = false)String startTime,
                                    @RequestParam(value = "overTime",required = false)  String overTime,
                                    @RequestParam("months[]") List<Long> months,
                                    @RequestParam("areas[]") List<Long> areas,
                                    @RequestParam("enterPrises[]") List<Long> enterPrises)
    {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime newStratTime = null;
        LocalDateTime newoverTime = null;
        if(startTime!=null && !"".equals(startTime)){
            newStratTime = LocalDateTime.parse(startTime,dateTimeFormatter);
        }
        if(overTime!=null && !"".equals(overTime)){
            newoverTime = LocalDateTime.parse(overTime,dateTimeFormatter);
        }
        PreLineVO preLineVO = new PreLineVO();
        preLine.setBeginTime(newStratTime);
        preLine.setEndTime(newoverTime);
        preLineVO.setPreLine(preLine);
        preLineVO.setAreas(areas);
        preLineVO.setMonths(months);
        preLineVO.setEnterPrises(enterPrises);
        return preLineService.addClientPreLines(preLineVO);
    }

    /**
     *  下发详情(查孩子)
     * @param preId
     * @return
     */
    @PostMapping("findOrToLowerDetail")
    @ApiOperation("下发详情,查孩子")
    @ResponseBody
    public CommonResult toLowerDetail(@ApiParam("预定路线id") @RequestParam("preId") Long preId){
        return preLineService.toLowerDetail(preId,ShiroUtils.getUserId());
    }

    /**
     *  下发设置(查自己)
     * @param preId
     * @return
     */
    @PostMapping("findOrToLowerInstall")
    @ApiOperation("到达下发设置,查自己")
    @ResponseBody
    public CommonResult toUpdatePreLines(@ApiParam("预定路线id") @RequestParam("preId") Long preId){
        return preLineService.toLowerInstall(preId, ShiroUtils.getUserId());
    }


    /**
     *  下发详情的到达修改界(路线查本身,其他查父亲的)
     * @param
     * @return
     */
    @PostMapping("toUpdateLower")
    @ApiOperation("到达修改界面")
    @ResponseBody
    public CommonResult toUpdateLower(@RequestParam("preId") Long preId){
        return preLineService.toUpdateLower(preId);
    }
    /**
     *  到达修改预定路线
     * @param
     * @return
     */
    @PostMapping("doUpdateLower")
    @ApiOperation("修改下发路线")
    @ResponseBody
    public CommonResult doUpdatePreLines(PreLine preLine,
                                         @RequestParam(value = "startTime",required = false)String startTime,
                                         @RequestParam(value = "overTime",required = false)  String overTime,
                                         @RequestParam("months[]") List<Long> months,
                                         @RequestParam("areas[]") List<Long> areas,
                                         @RequestParam("enterPrises[]") List<Long> enterPrises){
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime newStratTime = null;
        LocalDateTime newoverTime = null;
        if(startTime!=null && !"".equals(startTime)){
            newStratTime = LocalDateTime.parse(startTime,dateTimeFormatter);
        }
        if(overTime!=null && !"".equals(overTime)){
            newoverTime = LocalDateTime.parse(overTime,dateTimeFormatter);
        }
        PreLineVO preLineVO = new PreLineVO();
        preLine.setBeginTime(newStratTime);
        preLine.setEndTime(newoverTime);
        preLineVO.setPreLine(preLine);
        preLineVO.setAreas(areas);
        preLineVO.setMonths(months);
        preLineVO.setEnterPrises(enterPrises);
        return preLineService.doUpdateLower(preLineVO);
    }


}
