package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineUsersDto;
import com.brightease.bju.bean.dto.FormalLineUsersExportDto;
import com.brightease.bju.bean.dto.StatisticsCostDto;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.baomidou.mybatisplus.extension.service.IService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 正式报名的用户 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalLineUserService extends IService<FormalLineUser> {

    CommonResult add(List<FormalLineUser> users, Long enterpriseId);

    CommonResult getRegeistUsers(Long enterpriseId, Long formalLineId,int pageSize,int pageNum);

    CommonResult updateRegeistUsers(List<FormalLineUser> users, Long enterpriseId,Long formalLineId);

    CommonResult getFormalRecordUsers(Long enterpriseId, Long formalLineId,int pageSize,int pageNum);

    List<FormalLineUsersExportDto> getFormalRecordExportUsers(Long formalLineId);

    CommonResult getFormalRecordUsersNoPage(Long enterpriseId, Long formalLineId);

    CommonResult getUsers(FormalLineUsersDto formalLineUsersDto);

    List<FormalLineUsersExportDto> getUsersNoPage(List<Long> enterPriseIds);

    CommonResult updateUserToOtherLine(Long userId,Long oldLineId, Long otherLineId);

    CommonResult getCostInfoList(StatisticsCostDto costDto, Integer pageNum, Integer pageSize);

    public CommonResult getCostInfoListNoPage(StatisticsCostDto costDto);


    public List<StatisticsCostDto>  exportCostInfoList(StatisticsCostDto costDto);

    CommonResult getNextEnterpriseRegUsers(Long formalLineUserId,Integer pageNum, Integer pageSize);

    List<Long> getRecordUserIds();
}
