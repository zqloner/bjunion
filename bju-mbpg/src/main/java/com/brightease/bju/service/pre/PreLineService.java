package com.brightease.bju.service.pre;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.dto.predto.AreaEnterpriseMonth;
import com.brightease.bju.bean.pre.PreLine;
import com.baomidou.mybatisplus.extension.service.IService;
import com.brightease.bju.bean.pre.PreLineStatistics;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 预报名线路 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface PreLineService extends IService<PreLine> {
    CommonResult getPreLines(Long userType, String title,Integer type,Integer pageNum, Integer pageSize,Long shiroId);
    CommonResult addPreLines(PreLineVO preLineVO);
    CommonResult toUpdatePreLines(Long preId);
    CommonResult doUpdatePreLines(PreLineVO preLineVO);
    CommonResult deletePreLine(Long preId);
    CommonResult addClientPreLines(PreLineVO preLineVO);
    CommonResult getCourrentPreLines(Long id, Long userType, LocalDateTime nowTime);
    PreLineVTO findVtoById(Long id,Long userType,LocalDateTime nowTime);
    CommonResult updateRegistration(List<PreLineStatistics> preLineStatistics,Long enterpriseId);
    List<PreRegistrationStatisticsDto> findPreRegistrationCountByConditions(PreRegistrationStatisticsVO preRegistrationStatisticsVO);
    List<PreRegistrationRecordDto> findPreRegistrationRecordDto(PreRegistrationRecordVO preRegistrationRecordVO,Long enterPriseId);
    //    <!-- 根据路线id查找该路线对应的月份,地区，企业和相应的id  -->
    public AreaEnterpriseMonth findAreaEnterpriseMonth(Long preId,Long userType,Long enterPriseId);
    public CommonResult findPreDetail(Integer pageNum,Integer pageSize,Long preId,Long userType,Long enterPriseId);
    //到达线路下发详情
    public CommonResult toLowerDetail(Long preId,Long shiroId);
    //到达下发设置
    public CommonResult toLowerInstall(Long preId,Long shiroId);

    //下发详情的修改
    public CommonResult toUpdateLower(Long preId);

    //下发详情的修改
    public CommonResult doUpdateLower(PreLineVO preLineVO);

    //地区条件查
    public CommonResult areaOnChange(Long preId,String title);

}
