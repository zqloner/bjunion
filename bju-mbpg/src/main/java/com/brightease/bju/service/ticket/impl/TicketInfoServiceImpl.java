package com.brightease.bju.service.ticket.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.StatisticsTicketDto;
import com.brightease.bju.bean.dto.TicketInfoDto;
import com.brightease.bju.bean.dto.UserTickeInfoDto;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.bean.ticket.TicketInfo;
import com.brightease.bju.dao.ticket.TicketInfoMapper;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.service.ticket.TicketInfoService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 正式报名的用户出行信息 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class TicketInfoServiceImpl extends ServiceImpl<TicketInfoMapper, TicketInfo> implements TicketInfoService {

    @Autowired
    private TicketInfoMapper mapper;

    @Autowired
    private FormalLineUserService formalLineUserService;

    @Autowired
    private FormalLineService formalLineService;

    @Override
    public CommonResult getList(String lineName, Integer userType, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(mapper.getList(lineName,userType,null)));
    }


    @Override
    public CommonResult getInfoById(Integer id) {
        List<TicketInfoDto> list = mapper.getList("", null, id);
        return CommonResult.success(list.size()!=0?list.get(0):null);
    }

    @Override
    public CommonResult getUserTicketList(UserTickeInfoDto userTickeInfoDto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        if (userTickeInfoDto.getFormalId() == null) {
            return CommonResult.failed("参数错误");
        }
        return CommonResult.success(CommonPage.restPage(mapper.getUserTicketList(userTickeInfoDto)));
    }

    @Override
    public List<UserTickeInfoDto> getUserTicketListNoPage(UserTickeInfoDto userTickeInfoDto) {
        return mapper.getUserTicketList(userTickeInfoDto);
    }

    @Override
    public CommonResult batchAdd(Long toolId, String tickeInfo, BigDecimal price, Integer goOrType,Long formalId) {
        if (toolId == null) {
            return CommonResult.failed("出行工具类型不能为空");
        }
        if (tickeInfo == null || "".equals(tickeInfo)) {
            return CommonResult.failed("车票信息不能为空");
        }
        if (price == null ||  price.compareTo(BigDecimal.ZERO) != 1) {
            return CommonResult.failed("票价错误");
        }
        FormalLine formalLine = formalLineService.getById(formalId);
        if (formalLine == null) {
            return CommonResult.failed("线路不存在");
        }
        List<TicketInfo> ticketInfos = new ArrayList<>();
        List<FormalLineUser> formalLineUsers = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser().setFormalId(formalId).setYesNo(Constants.STATUS_VALID).setExamine(Constants.EXAMINE_PASS)));
        for (FormalLineUser formalLineUser : formalLineUsers) {
            TicketInfo ticket = getOne(new QueryWrapper<>(new TicketInfo().setFormalId(formalId).setFormalLineUserId(formalLineUser.getUserId())));
            if (ticket == null) {
                ticket = new TicketInfo();
            }
            if(goOrType == 0){
                ticket.setGoType(toolId.toString()).setGoPrice(price).setGoTicketInfo(tickeInfo);
            }else if (goOrType == 1){
                ticket.setBackType(toolId.toString()).setBackPrice(price).setBackTicketInfo(tickeInfo);
            }
            ticket.setFormalLineUserId(formalLineUser.getUserId());
            ticket.setFormalId(formalId);
            ticketInfos.add(ticket);
        }
        return saveOrUpdateBatch(ticketInfos)?CommonResult.success("批量添加成功"):CommonResult.failed("批量添加失败");
    }

    @Override
    public CommonResult getTraffic() {
        return CommonResult.success(mapper.getTraffic());
    }

    @Override
    public CommonResult getTrafficInfoList(StatisticsTicketDto ticketDto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<StatisticsTicketDto> dtos = mapper.getTrafficInfoList(ticketDto);
        return CommonResult.success(CommonPage.restPage(dtos));
    }

    @Override
    public CommonResult getTrafficInfoListNoPage(StatisticsTicketDto ticketDto) {
        List<StatisticsTicketDto> dtos = mapper.getTrafficInfoList(ticketDto);
        return CommonResult.success(dtos);
    }

    @Override
    public List<StatisticsTicketDto> exportTrafficInfoList(StatisticsTicketDto ticketDto) {
        List<StatisticsTicketDto> dtos = mapper.getTrafficInfoList(ticketDto);
        return dtos;
    }


}
