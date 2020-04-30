package com.brightease.bju.controller.contract;


import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.contract.ContractContract;
import com.brightease.bju.bean.dto.ContractContractDto;
import com.brightease.bju.bean.leader.LeaderLeader;
import com.brightease.bju.service.contract.ContractContractService;
import com.brightease.bju.shiro.ShiroUtils;
import com.brightease.bju.util.ExcelUtils;
import com.brightease.bju.util.ValidateIDNumber;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.util.IOUtils;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * <p>
 * 合同管理 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/contractContract")
@Api(value = "合同管理", tags = "合同管理")
public class ContractContractController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Resource
    private ContractContractService contractContractService;

    @Resource
    private ResourceLoader resourceLoader;

    /**
     * 条件查询合同
     *
     * @param contractContract
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping(value = "getConstactsInfos")
    @ApiOperation("条件查询")
    @ResponseBody
    public CommonResult getContracts(ContractContract contractContract,
                                     @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                     @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<ContractContractDto> dto = contractContractService.findByConditions(contractContract);
        return CommonResult.success(CommonPage.restPage(dto));
    }


    /**
     * 新增合同
     *
     * @param contractContract
     * @return
     */
    @PostMapping("add")
    @ApiOperation("新增合同")
    @ResponseBody
    public CommonResult<ContractContract> add(ContractContract contractContract,
                                              @RequestParam(value = "startTime", required = false) String startTime,
                                              @RequestParam(value = "overTime", required = false) String overTime) {
//        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//        LocalDate beginTime = null;
//        LocalDate endTime = null;
//        if (startTime != null && !"".equals(startTime)) {
//            beginTime = LocalDate.parse(startTime, dateTimeFormatter);
//        }
//        if (overTime != null && !"".equals(overTime)) {
//            endTime = LocalDate.parse(overTime, dateTimeFormatter);
//        }
//        contractContract.setContractBeginTime(beginTime);
//        contractContract.setContractEndTime(endTime);
        contractContract.setIsDel(Constants.DELETE_VALID);
        contractContract.setStatus(Constants.STATUS_VALID);
        contractContract.setCreateTime(LocalDate.now());
        //合同的状态   0未开始  1服务中   2已结束
        if(contractContract.getContractBeginTime().isAfter(LocalDate.now())){
            contractContract.setContractStatus(Constants.CONTRAT_NOT_START);
        }else if(contractContract.getContractEndTime().isBefore(LocalDate.now())){
            contractContract.setContractStatus(Constants.CONTRAT_IS_END);
        }else {
            contractContract.setContractStatus(Constants.CONTRAT_IN_START);
        }
        contractContract.setCreateUserid(ShiroUtils.getSysUser().getId());
        boolean b = contractContractService.saveOrUpdate(contractContract);
        if (b) {
            return CommonResult.success(contractContract, "新增成功");
        }
        return CommonResult.failed("新增失败");
    }

    /**
     * 编辑或者查看详情
     *
     * @param contractId
     * @return
     */
    @GetMapping(value = "toUpdateOrSeeDetail")
    @ApiOperation("编辑或者查看详情")
    @ResponseBody
    public CommonResult toUpdateOrSeeDetail(@RequestParam("contractId") Long contractId) {
        return CommonResult.success(contractContractService.getById(contractId));
    }


    /**
     * 新增合同
     *
     * @param contractContract
     * @return
     */
    @PostMapping("doUpdate")
    @ApiOperation("修改合同")
    @ResponseBody
    public CommonResult<ContractContract> doUpdate(ContractContract contractContract) {
//        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//        LocalDate beginTime = null;
//        LocalDate endTime = null;
//        if (startTime != null && !"".equals(startTime)) {
//            beginTime = LocalDate.parse(startTime, dateTimeFormatter);
//        }
//        if (overTime != null && !"".equals(overTime)) {
//            endTime = LocalDate.parse(overTime, dateTimeFormatter);
//        }
//        contractContract.setContractBeginTime(beginTime);
//        contractContract.setContractEndTime(endTime);
        boolean updateById = contractContractService.updateById(contractContract);
        if (updateById) {
            return CommonResult.success(null, "修改成功");
        }
        return CommonResult.failed("新增失败");
    }

    /**
     * 导出合同
     *
     * @param response
     * @param
     */
    @GetMapping("/download")
    @ApiOperation("导出合同信息")
    public void downloadTemplate(HttpServletResponse response, ContractContract contractContract) {
        List<ContractContractDto> dataList = contractContractService.findByConditions(contractContract);
        ExcelUtils.createExcel(response, dataList, ContractContractDto.class, "合同信息.xls");
    }


    @GetMapping("/downloadTemplate")
    @ApiOperation("下载合同导入模板")
    public void downloadTemplate(HttpServletResponse response, HttpServletRequest request) {
        InputStream inputStream = null;
        ServletOutputStream servletOutputStream = null;
        try {
            String filename = "合同导入模板.xls";
            String path = "xls/constracttemplate.xls";
            org.springframework.core.io.Resource resource = resourceLoader.getResource("classpath:" + path);

            response.setContentType("application/vnd.ms-excel");
            response.addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.addHeader("charset", "utf-8");
            response.addHeader("Pragma", "no-cache");
            String encodeName = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString());
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodeName + "\"; filename*=utf-8''" + encodeName);

            inputStream = resource.getInputStream();
            servletOutputStream = response.getOutputStream();
            IOUtils.copy(inputStream, servletOutputStream);
            response.flushBuffer();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (servletOutputStream != null) {
                    servletOutputStream.close();
                    servletOutputStream = null;
                }
                if (inputStream != null) {
                    inputStream.close();
                    inputStream = null;
                }
                // 召唤jvm的垃圾回收器
                System.gc();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 导入合同
     *
     * @param file
     * @return
     */
    @PostMapping("/import")
    @ApiOperation("导入合同信息")
    public CommonResult upload(MultipartFile file) {
//        public static <T> List<T> readExcel(String path, Class<T> cls, MultipartFile file)
        String path = "";
        List<ContractContract> list = ExcelUtils.readExcel(path, ContractContract.class, file,0);
        list.stream().forEach(x -> {
            if(x.getContractBeginTime().isAfter(LocalDate.now())){
                x.setContractStatus(Constants.CONTRAT_NOT_START);
            }else if(x.getContractEndTime().isBefore(LocalDate.now())){
                x.setContractStatus(Constants.CONTRAT_IS_END);
            }else {
                x.setContractStatus(Constants.CONTRAT_IN_START);
            }
            x.setIsDel(Constants.DELETE_VALID);
            x.setStatus(Constants.STATUS_VALID);
            x.setCreateTime(LocalDate.now());
            x.setCreateUserid(ShiroUtils.getSysUser().getId());
//            x.set
        });
        return contractContractService.saveBatch(list) ? CommonResult.success("添加成功！共导入" + list.size() + "条数据") : CommonResult.failed("导入失败");
    }

}
