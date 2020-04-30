package com.brightease.bju.dao.formal;

import com.brightease.bju.bean.dto.FormalLineEnterpriseDto;
import com.brightease.bju.bean.dto.FormalLineEnterpriseParams;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * <p>
 * 正式报名关联企业人数表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface FormalLineEnterpriseMapper extends BaseMapper<FormalLineEnterprise> {

    List<FormalLineEnterpriseDto> getList(@Param("dto") FormalLineEnterpriseDto dto, @Param("enterprises") List<EnterpriseEnterprise> enterprises);

    List<FormalLineEnterpriseDto> getRegRecordList(FormalLineEnterpriseParams params);

    List<FormalLineEnterprise> getInfoList(FormalLineEnterprise formalLineEnterprise);
}
