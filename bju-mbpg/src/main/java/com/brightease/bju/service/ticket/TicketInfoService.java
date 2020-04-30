package com.brightease.bju.service.ticket;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.StatisticsTicketDto;
import com.brightease.bju.bean.dto.TicketInfoDto;
import com.brightease.bju.bean.dto.UserTickeInfoDto;
import com.brightease.bju.bean.ticket.TicketInfo;
import com.baomidou.mybatisplus.extension.service.IService;

import java.math.BigDecimal;
import java.util.List;

/**
 * <p>
 * 正式报名的用户出行信息 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface TicketInfoService extends IService<TicketInfo> {

    CommonResult getList(String lineName, Integer userType, Integer pageNum, Integer pageSize);


    CommonResult getInfoById(Integer id);

    CommonResult getUserTicketList(UserTickeInfoDto userTickeInfoDto, Integer pageNum, Integer pageSize);

    List<UserTickeInfoDto> getUserTicketListNoPage(UserTickeInfoDto userTickeInfoDto);

    CommonResult batchAdd(Long toolId, String tickeInfo, BigDecimal price, Integer goOrType, Long formalId);

    CommonResult getTraffic();

    CommonResult getTrafficInfoList(StatisticsTicketDto ticketDto, Integer pageNum, Integer pageSize);

    CommonResult getTrafficInfoListNoPage(StatisticsTicketDto ticketDto);

    public List<StatisticsTicketDto> exportTrafficInfoList(StatisticsTicketDto ticketDto);
}
