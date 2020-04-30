package com.brightease.bju.service.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineDto;
import com.brightease.bju.bean.dto.SanatoriumOrderDto;
import com.brightease.bju.bean.dto.formallinedto.FormalLineImportDto;
import com.brightease.bju.bean.formal.FormalLine;
import com.baomidou.mybatisplus.extension.service.IService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 正式报名线路 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface FormalLineService extends IService<FormalLine> {

    CommonResult getFormalLineList(Map<String ,Object> param, int pageNum, int pageSize);

    CommonResult getFormalSanatoriumInfo(Map<String, Object> param);

    CommonResult getFormalLineUserList(Map<String, Object> param, int pageNum, int pageSize);

    CommonResult getFormalLineCompanyList(Map<String, Object> param);

    CommonResult getList(String name, Long userType, Integer pageNum, Integer pageSize,String startTime,String endTime,Long isTeam);

    CommonResult addFormalLine(FormalLine formalLine);

    CommonResult updateFormalLine(FormalLine formalLine);

    FormalLine getInfoById(Long id);

    CommonResult delById(Long id);

    CommonResult updateIsTeam(FormalLine formalLine);

    CommonResult getRegistList(Long userId,Long type, Long userType,int pageNum,int pageSize);

    List<FormalLine> getStatisticsList(FormalLineDto formalLineDto);

    List<FormalLineDto> getFLLeaderList(String name, Integer userType);

    CommonResult getMySanatoriumOrderLis(SanatoriumOrderDto orderDto, Integer pageNum, Integer pageSize);

    List<FormalLine> getStatisticsListExamineYes(FormalLineDto formalLineDto);

    CommonResult getListNopageIsTeam();

    SanatoriumOrderDto getLineDetail(Long formalId);

    CommonResult addFormalLineBatch(List<FormalLineImportDto> importlist);

    boolean checkFormalLineUserList(String formalid);

    CommonResult checkIsFirstFormalRecord(Long userId, Long userType);

    List<FormalLine> getFormalLinesForRecord( LocalDate nowTime, Integer lineStatus);
}
