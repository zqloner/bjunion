package com.brightease.bju.service.enterprise;

import com.baomidou.mybatisplus.extension.service.IService;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.EnterPriseTreeDto;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.predto.EnterPriseZnodeDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;

import java.util.List;

/**
 * <p>
 * 企业表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
public interface EnterpriseEnterpriseService extends IService<EnterpriseEnterprise> {

    CommonResult getlist(EnterpriseEnterprise enterprise, int pageNum, int pageSize);

    List<EnterpriseDto> getListNoPage(EnterpriseEnterprise enterprise);

    CommonResult addEnterprise(EnterpriseEnterprise enterprise);

    CommonResult updateAndWaitExamine(EnterpriseEnterprise enterprise);

    CommonResult updateLowerLevelModel(Long id);

    CommonResult restPassword(Long id);

    List<EnterpriseEnterprise> getLowerLevelOld(Long userId);

    List<EnterpriseEnterprise> getLowerLevel(EnterpriseEnterprise enterprise);

    EnterpriseEnterprise fingUserByUserLoginName(String username);

    /**
     * 查询企业树形数据
     * @return
     */
    List<EnterPriseTreeDto> findEnterPriseTree();

    public CommonResult getCount();

    EnterpriseDto getEnterpriseInfoById(Long id);

    List<EnterPriseZnodeDto> findFirstEnterPrise();

    List<EnterPriseZnodeDto> findTwoEnterPrise(Long id);

    List<EnterPriseZnodeDto> findTwoEnterPriseNotIsLaoMo(Long id);

    EnterpriseDto getClientEnterpriseInfo(Long userId);

    CommonResult batchUpdateModel(List<Long> ids, Integer modelStatus);
}
