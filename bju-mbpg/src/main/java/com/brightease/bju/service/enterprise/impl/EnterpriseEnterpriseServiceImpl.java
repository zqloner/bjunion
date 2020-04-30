package com.brightease.bju.service.enterprise.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.EnterPriseTreeDto;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.predto.EnterPriseZnodeDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.enterprise.EnterpriseExamine;
import com.brightease.bju.dao.enterprise.EnterpriseEnterpriseMapper;
import com.brightease.bju.service.PasswordService;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseExamineService;
import com.github.pagehelper.PageHelper;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 企业表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
@Service
public class EnterpriseEnterpriseServiceImpl extends ServiceImpl<EnterpriseEnterpriseMapper, EnterpriseEnterprise> implements EnterpriseEnterpriseService {

    @Autowired
    private EnterpriseEnterpriseMapper enterpriseMapper;
    @Autowired
    private EnterpriseExamineService examineService;
    @Autowired
    private PasswordService passwordService;

    /***
     * 查询审核通过的企业
     * @param enterprise
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public CommonResult getlist(EnterpriseEnterprise enterprise, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(enterpriseMapper.getList(enterprise)));
    }

    @Override
    public List<EnterpriseDto> getListNoPage(EnterpriseEnterprise enterprise) {
        return enterpriseMapper.getListNoPage(enterprise);
    }

    /**
     * 添加企业信息
     * @param enterprise
     * @return
     */
    @Override
    public CommonResult addEnterprise(EnterpriseEnterprise enterprise) {
        EnterpriseEnterprise nameRepeat = getOne(new QueryWrapper<>(new EnterpriseEnterprise().setName(enterprise.getName())));
        if (nameRepeat != null) {
            return CommonResult.failed("企业名称已经存在");
        }
        EnterpriseEnterprise accountRepeat = getOne(new QueryWrapper<>(new EnterpriseEnterprise().setAccount(enterprise.getAccount())));
        if (accountRepeat != null) {
            return CommonResult.failed("账号已经存在");
        }
        if (enterprise.getPid() != null) {
            if(enterprise.getPid() == 1){
                enterprise.setModelStatus(Constants.MODEL_STATUS_OPEN);
            }else {
                enterprise.setModelStatus(Constants.MODEL_STATUS_CLOSE);
            }
        }

        boolean f = save(enterprise.setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID).setCreateTime(LocalDateTime.now()).setModelStatus(0).setExamineStatus(0));
        return f ? CommonResult.success(enterprise) : CommonResult.failed();
    }

    /**
     * 修改企业信息，提交审核
     * @param enterprise
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateAndWaitExamine(EnterpriseEnterprise enterprise) {
        if(enterprise.getPid() == 1){
            enterprise.setModelStatus(Constants.MODEL_STATUS_OPEN);
            enterprise.setExamineStatus(Constants.EXAMINE_RESULT_ING);
        }else {
            enterprise.setModelStatus(Constants.MODEL_STATUS_CLOSE);
        }
        //修改企业信息之后，设置审核状态为未审核（等待审核）
        if (enterprise.getPid() != null) {
            if(enterprise.getPid() != 1){
                EnterpriseEnterprise father = getById(enterprise.getPid());
                if (father.getPid() != 1  ) {
                    return CommonResult.failed("上级企业选择错误！");
                }
            }
        }
        updateById(enterprise.setUpdateTime(LocalDateTime.now()));
        //添加新的审核信息
        examineService.save(new EnterpriseExamine().setEnterpriseId(enterprise.getId()).setRequestName(enterprise.getName()).setExamineStatus(Constants.EXAMINE_WAITING).setCreateTime(LocalDateTime.now()));
        return CommonResult.success(enterprise);
    }

    @Override
    public CommonResult updateLowerLevelModel(Long id) {
        EnterpriseEnterprise enterprise = getById(id);
        if (enterprise == null) {
            return CommonResult.failed("下级企业不存在");
        }
        updateById(enterprise.setModelStatus((enterprise.getModelStatus() == null || enterprise.getModelStatus() == Constants.MODEL_STATUS_CLOSE) ? Constants.MODEL_STATUS_OPEN : Constants.MODEL_STATUS_CLOSE));
        return CommonResult.success(enterprise);
    }

    @Override
    public CommonResult restPassword(Long id) {
        EnterpriseEnterprise enterprise = getById(id);
        if (enterprise == null) {
            return CommonResult.failed("下级企业不存在");
        }
        updateById(enterprise.setPassword(new Md5Hash(Constants.INIT_PWD).toHex()));
        return CommonResult.success(enterprise);
    }

    @Override
    public List<EnterpriseEnterprise> getLowerLevelOld(Long userId) {
        return list(new QueryWrapper<>(new EnterpriseEnterprise().setPid(userId).setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID)));
    }

    @Override
    public List<EnterpriseEnterprise> getLowerLevel(EnterpriseEnterprise enterprise) {
        return enterpriseMapper.getLowerLevel(enterprise);
    }

    @Override
    public EnterpriseEnterprise fingUserByUserLoginName(String username) {
        return getOne(new QueryWrapper<>(new EnterpriseEnterprise().setAccount(username).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
    }

    /**
     * 查找企业树形数据
     * @return
     */
    @Override
    public List<EnterPriseTreeDto> findEnterPriseTree() {
        return enterpriseMapper.findEnterPriseTree();
    }
    @Override
    public CommonResult getCount() {
        return CommonResult.success(enterpriseMapper.getCount());
    }

    @Override
    public EnterpriseDto getEnterpriseInfoById(Long id) {
        return enterpriseMapper.getList(new EnterpriseDto().setId(id));
    }

    //一级单位查
    @Override
    public List<EnterPriseZnodeDto> findFirstEnterPrise() {
        return enterpriseMapper.findFirstEnterPrise();
    }

    //根据一级单位查询出二级单位
    @Override
    public List<EnterPriseZnodeDto> findTwoEnterPrise(Long id) {
        return enterpriseMapper.findTwoEnterPrise(id);
    }

    //根据一级单位查询出不具有劳模权限二级单位,用于二级部门给三级部门正式报名
    @Override
    public List<EnterPriseZnodeDto> findTwoEnterPriseNotIsLaoMo(Long id) {
        return enterpriseMapper.findTwoEnterPriseNotIsLaoMo(id);
    }

    @Override
    public EnterpriseDto getClientEnterpriseInfo(Long userId) {
        return enterpriseMapper.getClientList(new EnterpriseDto().setId(userId));
    }

    @Override
    public CommonResult batchUpdateModel(List<Long> ids, Integer modelStatus) {
        List<EnterpriseEnterprise> enterprises = ids.stream().map(i->new EnterpriseEnterprise().setId(i).setModelStatus(modelStatus)).collect(Collectors.toList());
        return updateBatchById(enterprises)?CommonResult.success("修改成功"):CommonResult.failed("修改失败");
    }
}
