package com.brightease.bju.dao.contract;

import com.brightease.bju.bean.contract.ContractContract;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.brightease.bju.bean.dto.ContractContractDto;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 * 合同管理 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Mapper
@Repository
public interface ContractContractMapper extends BaseMapper<ContractContract> {
    List<ContractContractDto> findByConditions(ContractContract contractContract);
    List<ContractContractDto> findByIds(List<Long> ids);
    ContractContract fingContractContractByContractName(String constractName);
}
