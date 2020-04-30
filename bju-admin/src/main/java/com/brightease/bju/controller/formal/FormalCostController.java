package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.LeaderExamineCostDto;
import com.brightease.bju.bean.dto.PreRegistrationStatisticsDto;
import com.brightease.bju.bean.dto.rolesandnewsdto.FormalCostParamsDto;
import com.brightease.bju.bean.formal.FormalCost;
import com.brightease.bju.bean.formal.FormalCostExamine;
import com.brightease.bju.dao.formal.FormalCostMapper;
import com.brightease.bju.service.formal.FormalCostAppendService;
import com.brightease.bju.service.formal.FormalCostExamineService;
import com.brightease.bju.service.formal.FormalCostInfoService;
import com.brightease.bju.service.formal.FormalCostService;
import com.brightease.bju.shiro.ShiroUtils;
import com.brightease.bju.util.ExcelUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 疗养费用详情 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalCost")
@Api(value = "费用相关",tags = "费用相关")
public class FormalCostController {

    @GetMapping("/tovestMoney")
    public String tovestMoney(String pagedata,ModelMap mdap){
        if(null==pagedata||!"".equals(pagedata)){
            pagedata = "1";
        }
        mdap.put("pagedata",pagedata);
        return "/leader/vestMoney";
    }


    @GetMapping("/tovestMoneyDe")
    public String tovestMoneyDe(String pagedata,String formalid, String costid,String lineid,ModelMap mdap){
        mdap.put("formalid",formalid);
        mdap.put("costid",costid);
        mdap.put("lineid",lineid);
        mdap.put("pagedata",pagedata);
        return "/leader/vestMoneyDe";
    }
    @GetMapping("/tovestMoneyAdd")
    public String tovestMoneyAdd(String pagedata,String formalid, String lineid, ModelMap mdap){
        mdap.put("formalid",formalid);
        mdap.put("lineid",lineid);
        mdap.put("pagedata",pagedata);
        return "/leader/vestMoneyAdd";
    }
    @GetMapping("/tovestMoneyModify")
    public String tovestMoneyModify(String pagedata,String formalid, String costid,String lineid, ModelMap mdap){
        mdap.put("formalid",formalid);
        mdap.put("costid",costid);
        mdap.put("lineid",lineid);
        mdap.put("pagedata",pagedata);
        return "/leader/vestMoneyModify";
    }

    @Autowired
    private FormalCostService formalCostServiceImpl;
    @Autowired
    private FormalCostInfoService formalCostInfoServiceImpl;
    @Autowired
    private FormalCostAppendService formalCostAppendServiceImpl;
    @Autowired
    private FormalCostExamineService formalCostExamineServiceImpl;
    @Autowired
    private FormalCostMapper formalCostMapper;
    /**
     * 查询当前领队所带团费用情况
     * */
    @GetMapping("/getFormalCostList")
    @ResponseBody
    @ApiOperation(value = "领队我的疗养团疗养费用",notes = "领队我的疗养团疗养费用")
    public CommonResult getFormalCostList(String usertype, String linename, String examinestatus, String starttime, String endtime, Integer pageNumber, Integer pageSize){
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Long  leaderid = ShiroUtils.getLeader().getId();
            Long utype = 1l;
            if(null!=usertype&&!"".equals(usertype)){
                utype = Long.valueOf(usertype);
            }

            Map<String ,Object> param = new HashMap<String ,Object>();
            param.put("usertype",utype);
            param.put("leaderid",leaderid);
            if (pageNumber == null || pageNumber <= 0) {
                pageNumber = 1;
            }
            if (pageSize == null || pageSize <= 0) {
                pageSize = 10;
            }

            if(null!=linename&&!"".equals(linename)){
                param.put("linename",linename);
            }
            if(null!=examinestatus&&!"".equals(examinestatus)){
                param.put("examinestatus",Integer.valueOf(examinestatus));
            }
            if(null!=starttime&&!"".equals(starttime)){
                param.put("starttime",format.parse(starttime));
            }
            if(null!=endtime&&!"".equals(endtime)){
                param.put("endtime",format.parse(endtime));
            }
            CommonResult result = formalCostServiceImpl.getFormalCostList(param,pageNumber,pageSize);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }
    /**
     * 查询该疗养团费用详情
     * */
    @GetMapping("/getCostInfoList")
    @ResponseBody
    @ApiOperation(value = "疗养团疗养费用详情",notes = "疗养团疗养费用详情")
    public CommonResult getCostInfoList(String costid, Integer pageNumber, Integer pageSize){
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            Map<String ,Object> param = new HashMap<String ,Object>();
            param.put("costid", Long.valueOf(costid));

            if (pageNumber == null || pageNumber <= 0) {
                pageNumber = 1;
            }
            if (pageSize == null || pageSize <= 0) {
                pageSize = 10;
            }
            CommonResult result = formalCostInfoServiceImpl.getCostInfoList(param);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }
    /**
     * 查询该疗养团发票列表
     * */
    @GetMapping("/getCostAppendList")
    @ResponseBody
    @ApiOperation(value = "疗养团发票",notes = "疗养团发票")
    public CommonResult getCostAppendList(String costid){
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            Map<String ,Object> param = new HashMap<String ,Object>();
            param.put("costid", Long.valueOf(costid));


            CommonResult result = formalCostAppendServiceImpl.getCostAppendList(param);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }
    /**
     * 保存该疗养团费用详情
     * */
    @PostMapping("/saveCostInfoList")
    @ResponseBody
    @ApiOperation(value = "保存疗养团疗养费用详情",notes = "保存疗养团疗养费用详情")
    public CommonResult saveCostInfoList(String formalid,String lineid,String totalmoney, String costid,String infolist, String appendlist){
        try {
            //Long leaderid = ShiroUtils.getLeader().getId();
            Long leaderid = ShiroUtils.getLeader().getId();
            CommonResult result =formalCostServiceImpl.saveCostInfoList(leaderid,formalid,lineid,totalmoney, costid,infolist, appendlist);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }
    /**
     * 删除该疗养团费用详情
     * */
    @PostMapping("/delCostInfoList")
    @ResponseBody
    @ApiOperation(value = "删除疗养团疗养费用详情",notes = "删除疗养团疗养费用详情")
    public CommonResult delCostInfoList(String totalmoney, String costid,String infolist,String appendlist){
        try {
            BigDecimal price = new BigDecimal(totalmoney);
            FormalCost formalCost = new FormalCost();
            formalCost.setPrice(price);
            formalCost.setId(Long.valueOf(costid));
            formalCostServiceImpl.updateById(formalCost);

            formalCostInfoServiceImpl.delCostInfos(Long.valueOf(costid),infolist);
            formalCostAppendServiceImpl.delCostAppends(Long.valueOf(costid),appendlist);

            return CommonResult.success("更新成功");
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }
    /**
     * 疗养团费用审核状态查询
     * */
    @GetMapping("/getCostExamineStatus")
    @ResponseBody
    @ApiOperation(value = "疗养团费用审核状态查询",notes = "疗养团费用审核状态查询")
    public CommonResult getCostExamineStatus(String costid){
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            Map<String ,Object> param = new HashMap<String ,Object>();
            param.put("costid", Long.valueOf(costid));

            CommonResult result = formalCostExamineServiceImpl.getCostExamineStatus(param);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("疗养费用列表")
    public CommonResult list(String lineName,Long status,
                             @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                             @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return formalCostServiceImpl.getCostList(lineName,status,pageNum,pageSize);
    }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation("添加疗养费用")
    public CommonResult add(@RequestBody FormalCostParamsDto formalCostParamsDto) {
        return formalCostServiceImpl.addFormalCost(formalCostParamsDto.getCosts(),formalCostParamsDto.getAppends(),formalCostParamsDto.getId());
    }

    @GetMapping("/getById")
    @ResponseBody
    @ApiOperation("根据id查看费用")
    public CommonResult getById(Long id) {
        return formalCostServiceImpl.getInfoById(id,0);
    }
    @GetMapping("/getByIdForLeader")
    @ResponseBody
    @ApiOperation("根据id查看费用")
    public CommonResult getByIdForLeader(Long id) {
        return formalCostServiceImpl.getInfoById(id,1);
    }

    @GetMapping("/getLeaderCostList")
    @ResponseBody
    @ApiOperation("领队费用审核list")
    public CommonResult getLeaderCostList(LeaderExamineCostDto dto,
                                          @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                          @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return formalCostServiceImpl.getLeaderCostList(dto,pageNum,pageSize);
    }

    @GetMapping("/downloadLeaderCost")
    @ApiOperation("领队费用审核导出列表")
    public void LeaderCostListExport(LeaderExamineCostDto dto, HttpServletResponse response) {
        List<LeaderExamineCostDto> leaderCostList = formalCostMapper.getLeaderCostList(dto);
        ExcelUtils.createExcel(response,leaderCostList, LeaderExamineCostDto.class,"领队费用审核.xls");
    }

}
