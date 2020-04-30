package com.brightease.bju.dao.ticket;

import com.brightease.bju.bean.dto.StatisticsTicketDto;
import com.brightease.bju.bean.dto.TicketInfoDto;
import com.brightease.bju.bean.dto.UserTickeInfoDto;
import com.brightease.bju.bean.ticket.TicketInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 正式报名的用户出行信息 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface TicketInfoMapper extends BaseMapper<TicketInfo> {

    List<TicketInfoDto> getList(@Param("lineName") String lineName, @Param("userType") Integer userType, @Param("id") Integer id);

    List<UserTickeInfoDto> getUserTicketList(UserTickeInfoDto userTickeInfoDto);

    List<Map<String,Object>> getTraffic();

    List<StatisticsTicketDto> getTrafficInfoList(StatisticsTicketDto ticketDto);
}
