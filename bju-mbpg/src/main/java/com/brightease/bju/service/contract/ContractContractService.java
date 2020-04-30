package com.brightease.bju.service.contract;

import com.brightease.bju.bean.contract.ContractContract;
import com.baomidou.mybatisplus.extension.service.IService;
import com.brightease.bju.bean.dto.ContractContractDto;

import java.util.List;

/**
 * <p>
 * 合同管理 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface ContractContractService extends IService<ContractContract> {
    List<ContractContractDto> findByConditions(ContractContract contractContract);
    List<ContractContractDto> findByIds(List<Long> ids);
    ContractContract fingContractContractByContractName(String constractName);
    int insert(ContractContract contractContract);
}
