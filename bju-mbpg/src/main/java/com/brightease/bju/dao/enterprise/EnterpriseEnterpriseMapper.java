package com.brightease.bju.dao.enterprise;

import com.brightease.bju.bean.dto.EnterPriseTreeDto;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.predto.EnterPriseZnodeDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 企业表 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
@Mapper
@Repository
public interface EnterpriseEnterpriseMapper extends BaseMapper<EnterpriseEnterprise> {

    List<EnterpriseDto> getList(EnterpriseEnterprise enterprise);

    List<EnterPriseTreeDto> findEnterPriseTree();

    Map<String,Object> getCount();

    EnterpriseDto getList(EnterpriseDto enterpriseDto);

    List<EnterPriseZnodeDto> findEnterPriseZnode();

    List<EnterPriseZnodeDto> findFirstEnterPrise();

    List<EnterPriseZnodeDto> findTwoEnterPrise(@Param("id") Long id);

    List<EnterpriseDto> getListNoPage(EnterpriseEnterprise enterprise);

    List<EnterpriseEnterprise> getLowerLevel(EnterpriseEnterprise enterprise);

    EnterpriseDto getClientList(EnterpriseDto enterpriseDto);

    List<EnterPriseZnodeDto> findTwoEnterPriseNotIsLaoMo(@Param("id")Long id);
}
