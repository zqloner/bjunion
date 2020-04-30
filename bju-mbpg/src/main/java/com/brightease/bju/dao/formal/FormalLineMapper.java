package com.brightease.bju.dao.formal;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.FormalLineDto;
import com.brightease.bju.bean.dto.SanatoriumOrderDto;
import com.brightease.bju.bean.formal.FormalLine;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 正式报名线路 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalLineMapper extends BaseMapper<FormalLine> {

    List<Map<String,Object>> getFormalLineList(Map<String, Object> param);

    List<Map<String,Object>> getFormalSanatoriumInfo(Map<String, Object> param);

    List<Map<String,Object>> getFormalLineUserList(Map<String, Object> param);

    List<Map<String,Object>> getFormalLineCompanyList(Map<String, Object> param);

    List<FormalLine> getlist(@Param("name")String name, @Param("userType")Long userType,@Param("startTime")String startTime,@Param("endTime")String endTime,@Param("isTeam")Long isTeam);

    FormalLine getInfoById(@Param("id") Long id);

    List<FormalLine> getStatisticsList(FormalLineDto formalLineDto);

    List<FormalLineDto> getFLLeaderList(@Param("name") String name, @Param("userType") Integer userType);

    List<SanatoriumOrderDto> getMySanatoriumOrderLis(SanatoriumOrderDto orderDto);

    List<FormalLine> getFormallineExamineYes(FormalLineDto formalLineDto);

    List<FormalLine> getListNopageIsTeam();

    List<FormalLine> getRegList(@Param("userId") Long userId, @Param("type") Long type, @Param("userType") Long userType);

    SanatoriumOrderDto getLineDetail(@Param("formalId") Long formalId);

    List<FormalLineEnterprise> checkIsFirstFormalRecord(@Param("start")String start, @Param("end")String end,@Param("shiroId")Long shiroId, @Param("userType")Long userType);

    List<FormalLine> getFormalLinesForRecord(@Param("nowTime") LocalDate nowTime, @Param("lineStatus") Integer lineStatus);
}
