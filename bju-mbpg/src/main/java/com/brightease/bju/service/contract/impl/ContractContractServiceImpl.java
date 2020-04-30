package com.brightease.bju.service.contract.impl;

import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.contract.ContractContract;
import com.brightease.bju.bean.dto.ContractContractDto;
import com.brightease.bju.dao.contract.ContractContractMapper;
import com.brightease.bju.service.contract.ContractContractService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 合同管理 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class ContractContractServiceImpl extends ServiceImpl<ContractContractMapper, ContractContract> implements ContractContractService {

    @Resource ContractContractMapper contractContractMapper;
    /**
     * 合同分页查询
     * @param contractContract
     * @return
     */
    @Override
    public  List<ContractContractDto> findByConditions(ContractContract contractContract) {
        List<ContractContractDto> contractContractDtos = contractContractMapper.findByConditions(contractContract);
        contractContractDtos.forEach(x->{
            // 0未开始 1服务中  2已结束
            if (x.getContractEndTime().isBefore(LocalDate.now())) {
                x.setContractStatus(Constants.CONTRAT_IS_END);
            } else if (x.getContractBeginTime().isAfter(LocalDate.now())) {
                x.setContractStatus(Constants.CONTRAT_NOT_START);
            } else {
                x.setContractStatus(Constants.CONTRAT_IN_START);
            }
        });
        return  contractContractDtos;
    }

    /**
     * 通过id集合查询合同
     * @param ids
     * @return
     */
    @Override
    public List<ContractContractDto> findByIds(List<Long> ids) {
        List<ContractContractDto> contractContractDtos = contractContractMapper.findByIds(ids);
        return contractContractDtos;
    }

    @Override
    public ContractContract fingContractContractByContractName(String constractName) {
        return contractContractMapper.fingContractContractByContractName(constractName);
    }

    @Override
    public int insert(ContractContract contractContract) {
        return contractContractMapper.insert(contractContract);
    }


}
