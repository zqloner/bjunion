package com.brightease.bju.controller.pre;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.PreLineVO;
import com.brightease.bju.bean.pre.PreLine;
import com.brightease.bju.service.pre.PreLineService;
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
@Api(value = "预报名管理",tags = "预报名管理")
public class PreLineController {

    @Resource
    private PreLineService preLineService;


    @GetMapping("findByConditions")
    @ApiOperation("按职工类型和标题查询")
    @ResponseBody
    public CommonResult getPreLines(@RequestParam(value = "userType",defaultValue = "3") Long userType, String title, @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                    @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize){
       return preLineService.getPreLines(userType,title,null,pageNum,pageSize, null);
    }

    /**
     *  新增预报名路线
     * @param
     * @return
     */
    @PostMapping("addPreLines")
    @ApiOperation("新增预报名路线")
    @ResponseBody
    public CommonResult addPreLines(PreLine preLine,
                                    @RequestParam(value = "startTime",required = false)String startTime,
                                    @RequestParam(value = "overTime",required = false)  String overTime,
                                    @RequestParam(value = "areas[]",required = false) List<Long> areas,
                                    @RequestParam(value = "months[]", required = false) List<Long> months,
                                    @RequestParam(value = "enterPrises[]", required = false) List<Long> enterPrises){
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
        preLineVO.setEnterPrises(enterPrises);
        preLineVO.setMonths(months);
        preLineVO.setAreas(areas);
      return preLineService.addPreLines(preLineVO);
    }


    /**
     *  到达修改预定路线
     * @param preId
     * @return
     */
    @GetMapping("toUpdatePreLine")
    @ApiOperation("到达修改预定路线")
    @ResponseBody
    public CommonResult toUpdatePreLines(@ApiParam("预定路线id") @RequestParam("preId") Long preId){ return preLineService.toUpdatePreLines(preId); }

    /**
     *  修改预定路线
     * @param
     * @return
     */
    @PostMapping("doUpdatePreLine")
    @ApiOperation("修改预定路线")
    @ResponseBody
    public CommonResult doUpdatePreLines(PreLine preLine,
                                         @RequestParam(value = "startTime",required = false)String startTime,
                                         @RequestParam(value = "overTime",required = false)  String overTime,
                                         @RequestParam(value = "areas[]",required = false) List<Long> areas,
                                         @RequestParam(value = "months[]", required = false) List<Long> months,
                                         @RequestParam(value = "enterPrises[]", required = false) List<Long> enterPrises){
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
        preLineVO.setEnterPrises(enterPrises);
        preLineVO.setMonths(months);
        preLineVO.setAreas(areas);
      return preLineService.doUpdatePreLines(preLineVO);
    }

    /**
     *
     * @param preId
     * @return
     */
    @GetMapping("deleteById")
    @ApiOperation("删除路线")
    @ResponseBody
    public CommonResult deleteById(@RequestParam("preId") Long preId){
        return preLineService.deletePreLine(preId);
    }
}
