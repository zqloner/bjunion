package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 正式报名的用户 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalLineUserMapper extends BaseMapper<FormalLineUser> {

    List<FormalLineUsersDto> getRegeistUsers(@Param("enterpriseId") Long enterpriseId, @Param("formalLineId") Long formalLineId);
    List<FormalLineUsersDto> getFormalRecordUsers(@Param("enterpriseId") Long enterpriseId, @Param("formalLineId") Long formalLineId);

    List<FormalLineUsersExportDto> getFormalRecordExportUsers(@Param("formalLineId") Long formalLineId);

    List<FormalLineUsersDto> getUsers(FormalLineUsersDto formalLineUsersDto);

    List<StatisticsCostDto> getCostUsers(StatisticsCostDto costDto);

    List<StatisticsCostFormalLineDto> getAllUsersByFormalLine(StatisticsCostDto costDto);

    List<FormalLineUsersDto> getNextEnterpriseRegUsers(@Param("formalLineUserId") Long formalLineUserId);

    List<Long> getRecordUserIds(@Param("startTime") LocalDateTime startTime, @Param("nowTime") LocalDateTime nowTime);

    List<FormalLineUsersExportDto> getUsersNoPage(@Param("enterPriseIds")List<Long> enterPriseIds);
}
