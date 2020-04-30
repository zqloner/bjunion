package com.brightease.bju.controller.formal;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.FormalLineDto;
import com.brightease.bju.bean.dto.FormalLineExportDto;
import com.brightease.bju.bean.dto.formallinedto.FormalLineImportDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.bean.line.LineLine;
import com.brightease.bju.dao.formal.FormalLineMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.line.LineLineService;
import com.brightease.bju.util.ExcelUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by zhaohy on 2019/9/18.
 */
@Controller
@RequestMapping("/formalLineSingUp")
@Api(value = "正式报名线路", tags = "正式报名线路")
public class FormalLineOperationController {

    @Autowired
    private FormalLineService formalLineService;
    @Autowired
    private LineLineService lineService;
    @Autowired
    private EnterpriseEnterpriseService enterpriseService;
    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;
    @Autowired
    private FormalLineMapper formalLineMapper;


    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "正式报名线路list")
    public CommonResult getList(String name, Long userType,String startTime,String endTime,Long isTeam,
                                @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return formalLineService.getList(name, userType, pageNum, pageSize,startTime,endTime,isTeam);
    }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加正式报名线路")
    public CommonResult add(@RequestBody FormalLine formalLine) {
        return formalLineService.addFormalLine(formalLine);
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "修改线路")
    public CommonResult update(@RequestBody FormalLine formalLine) {
         return formalLineService.updateFormalLine(formalLine);
    }


    @GetMapping("/getInfoById/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id获取信息")
    public CommonResult getInfoById(@PathVariable(value = "id") Long id) {
        return CommonResult.success(formalLineService.getInfoById(id));
    }

    @GetMapping("/del/{id}")
    @ResponseBody
    @ApiOperation(value = "id删除正式线路")
    public CommonResult delById(@PathVariable(value = "id") Long id) {
        return formalLineService.delById(id);
    }

    @GetMapping("/isTeam")
    @ResponseBody
    @ApiOperation(value = "设置成团或者不成团")
    public CommonResult updateIsTeam(FormalLine formalLine) {
        return formalLineService.updateIsTeam(formalLine);
    }

    /**
     * @param response
     */
    @GetMapping("/downloadTemplate")
    @ApiOperation("下载导入模板")
    public void downloadTemplate(HttpServletResponse response) {
        //部门
        List<String> enterprises = enterpriseService.getListNoPage(new EnterpriseEnterprise().setStatus(Constants.STATUS_VALID)
                .setIsDel(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES))
                .stream().map(EnterpriseDto::getName).collect(Collectors.toList());
        //线路
        List<String> listNoPageLines = lineService.getListNoPage().stream().map(LineLine::getName).collect(Collectors.toList());
        ExcelUtils.createFormalLineTemplate(response, enterprises, listNoPageLines, "正式线路导入模板.xlsx");
    }

    /**
     * 下期开发
     *
     * @param file
     * @return
     */
    @PostMapping("/upload")
    @ResponseBody
    @ApiOperation("导入正式线路")
    public CommonResult upload(MultipartFile file) {
        if (file == null) return CommonResult.failed("Excel不能为空！");
        List<FormalLine> formalLines = ExcelUtils.readExcel("", FormalLine.class, file,1);
        formalLines.stream().forEach(x->x.setUpdateTime(LocalDateTime.now()));
        Map<String, EnterpriseDto> dtoMap = enterpriseService.getListNoPage(new EnterpriseEnterprise().setStatus(Constants.STATUS_VALID)
                .setIsDel(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES)).stream().collect(Collectors.toMap(EnterpriseDto::getName, a -> a, (k1, k2) -> k1));
        Map<String, LineLine> lineMap = lineService.getListNoPage().stream().collect(Collectors.toMap(LineLine::getName, a -> a, (k1, k2) -> k1));
        if(formalLines.size()==0){
            return CommonResult.failed("数据为空！");
        }
        List<FormalLineImportDto> importlist = new ArrayList<>();
        for (int i = 0; i < formalLines.size(); i++) {
            FormalLine line = formalLines.get(i);
            FormalLine newLine = new FormalLine();
            FormalLineImportDto dto = new FormalLineImportDto();
            String lineName = line.getName();
            if (lineName.equals("") || lineName == null) {
                return  CommonResult.failed("第" + (i + 1) + "行错误，线路名称不能为空");
            }
            newLine.setLineId(lineMap.get(lineName).getId());

            LocalDate sBenginTime = line.getSBenginTime();
            if (sBenginTime == null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，疗养开始时间不能为空");
            }
            newLine.setSBenginTime(sBenginTime);

            LocalDate sEndTime = line.getSEndTime();
            if (sEndTime == null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，疗养结束时间不能为空");
            }
            newLine.setSEndTime(sEndTime);

            String eName = line.getEName();
            if (eName.equals("") || eName == null) {
                return  CommonResult.failed("第" + (i + 1) + "行错误，报名单位不能为空");
            }
            FormalLineEnterprise enterprise = new FormalLineEnterprise();
            enterprise.setEnterpriseId(dtoMap.get(eName).getId());

            Integer maxCount = line.getMaxCount();
            if (maxCount == null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，限报人数不能为空");
            }
            enterprise.setMaxCount(maxCount);
            newLine.setMaxCount(maxCount);

            LocalDateTime rBeginTime = line.getRBeginTime();
            if (rBeginTime == null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，报名开始时间不能为空");
            }
            newLine.setRBeginTime(rBeginTime);

            LocalDateTime rEndTime = line.getREndTime();
            if (rEndTime == null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，报名结束时间不能为空");
            }
            String userType = line.getUserTypeStr();
            if (userType.equals("") || userType == null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，职工类型不能为空");
            }
            if(userType.equals("普通职工")){
                newLine.setUserType(1l);
            }else if(userType.equals("优秀职工")){
                newLine.setUserType(2l);
            }else{
                newLine.setUserType(3l);
            }

            newLine.setREndTime(rEndTime);
            dto.setFormalLine(newLine);
            dto.setFormalLineEnterprise(enterprise);
            importlist.add(dto);
        }
        return formalLineService.addFormalLineBatch(importlist);
    }


    @GetMapping("/statistics")
    @ResponseBody
    @ApiOperation("报名统计")
    public CommonResult getStatisticsList(FormalLineDto formalLineDto,
                                          @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                          @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalLineService.getStatisticsListExamineYes(formalLineDto)));
    }

    @GetMapping("/listNoPageIsTeam")
    @ResponseBody
    @ApiOperation(value = "正式报名已成团的线路list。调整人员到其他线路使用")
    public CommonResult getList() {
        return formalLineService.getListNopageIsTeam();
    }

    @GetMapping("/getLineDetail/{formalId}")
    @ResponseBody
    @ApiOperation(value = "查看线路的详细信息")
    public CommonResult getLineDetail(@PathVariable(value = "formalId") Long formalId) {
        return CommonResult.success(formalLineService.getLineDetail(formalId));
    }

    @GetMapping(value = {"/lineAdd"})
    public String companyDetails(Model model, Long userType, Long id) {
//        List<LineLine> lineList = lineService.list(new QueryWrapper<>(new LineLine().setIsDel(Constants.DELETE_VALID)));
        List<LineLine> lineList = lineService.getLineIdAndName();
        List<EnterpriseDto> enterprises = enterpriseService.getListNoPage(new EnterpriseEnterprise().setStatus(Constants.STATUS_VALID).setStatus(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES));
        model.addAttribute("lineList", lineList);
        model.addAttribute("enterprises", JSON.toJSONString(enterprises));
        model.addAttribute("userType", userType);
        model.addAttribute("id", id);
        return "bjzgh/formal/lineAdd";
    }

    @GetMapping(value = {"/lineDetail"})
    public String lineDetail(Model model, Long id, Long type) {
        FormalLine formalLine;
        Long fleId;
        formalLine = formalLineService.getInfoById(id);
        fleId = formalLine.getId();
        model.addAttribute("formalLine", formalLine);
        model.addAttribute("fleId", fleId);
        model.addAttribute("type", type);
        return "bjzgh/formal/lineDetail";
    }

    @GetMapping("/download")
    @ApiOperation("正式报名统计导出")
    public void LeaderCostListExport(FormalLineDto dto, HttpServletResponse response) {
        List<FormalLine> formalLines = formalLineMapper.getFormallineExamineYes(dto);
        List<FormalLineExportDto> dtos = new ArrayList<>();
        for (FormalLine formalLine : formalLines) {
            FormalLineExportDto exportDto = new FormalLineExportDto();
            exportDto.setLineStatus(formalLine.getLineStatus());
            exportDto.setMaxCount(formalLine.getMaxCount());
            exportDto.setName(formalLine.getName());
            exportDto.setNowCount(formalLine.getNowCount());
            exportDto.setSBenginTime(formalLine.getSBenginTime());
            exportDto.setSEndTime(formalLine.getSEndTime());
            dtos.add(exportDto);
        }
        ExcelUtils.createExcel(response,dtos, FormalLineExportDto.class,"正式报名统计.xls");
    }
}
