package com.brightease.bju.controller.ticket;


import com.baomidou.mybatisplus.extension.api.R;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.UserTickeInfoDto;
import com.brightease.bju.bean.ticket.TicketInfo;
import com.brightease.bju.service.ticket.TicketInfoService;
import com.brightease.bju.util.ExcelUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.util.List;

/**
 * <p>
 * 正式报名的用户出行信息 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/ticketInfo")
@Api(value = "票务相关",tags = "票务相关")
public class TicketInfoController {

    @Autowired
    private TicketInfoService ticketInfoService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("票务列表")
    public CommonResult list(String lineName,Integer userType,
                             @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                             @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return ticketInfoService.getList(lineName, userType, pageNum, pageSize);
    }

    @GetMapping("/getById")
    @ResponseBody
    @ApiOperation("根据id查看详细信息")
    public CommonResult getInfoById(Integer id) {
        if (id == null) {
            return CommonResult.failed("参数错误");
        }
        return ticketInfoService.getInfoById(id);
    }

    @GetMapping("/userTicketList")
    @ResponseBody
    @ApiOperation("获取用户票务信息")
    public CommonResult getUserTicketList(UserTickeInfoDto userTickeInfoDto,
                                          @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                          @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return ticketInfoService.getUserTicketList(userTickeInfoDto, pageNum, pageSize);
    }

    @GetMapping("/exportUserTicketList")
    @ResponseBody
    @ApiOperation("导出票务列表")
    public void exportList(HttpServletResponse response, UserTickeInfoDto userTickeInfoDto) {
        List<UserTickeInfoDto> userTicketListNoPage = ticketInfoService.getUserTicketListNoPage(userTickeInfoDto);
        ExcelUtils.createExcel(response,userTicketListNoPage,UserTickeInfoDto.class,"票务列表.xlsx");
    }

    @PostMapping("/batchAdd")
    @ResponseBody
    @ApiOperation("批量添加出行工具信息 0为出行 1为返程")
    public CommonResult batchAdd(Long toolId, String tickeInfo, BigDecimal price, Integer goOrType,Long formalId) {
        return ticketInfoService.batchAdd(toolId, tickeInfo, price, goOrType,formalId);
    }

    @PostMapping("/updateById")
    @ResponseBody
    @ApiOperation("根据id修改出行或者返程车票信息")
    public CommonResult updateById(TicketInfo ticketInfo) {
        return ticketInfoService.updateById(ticketInfo)?CommonResult.success("修改成功"):CommonResult.failed("修改失败");
    }
}
