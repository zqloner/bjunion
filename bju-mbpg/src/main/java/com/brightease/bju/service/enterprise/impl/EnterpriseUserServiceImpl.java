package com.brightease.bju.service.enterprise.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.predto.EnterPriseZnodeDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.brightease.bju.bean.enterprise.EnterpriseUserRole;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.dao.enterprise.EnterpriseUserMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseUserRoleService;
import com.brightease.bju.service.enterprise.EnterpriseUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * <p>
 * 企业职工表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Service
public class EnterpriseUserServiceImpl extends ServiceImpl<EnterpriseUserMapper, EnterpriseUser> implements EnterpriseUserService {

    @Autowired
    private EnterpriseUserMapper userMapper;
    @Autowired
    private FormalLineUserService lineUserService;
    @Autowired
    private EnterpriseUserService enterpriseUserService;
    @Autowired
    private EnterpriseUserRoleService userRoleService;
    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    @Override
    public CommonResult getList(EnterpriseUser user, Long userType, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        String typestr = "";
        if (userType != null) {
            if (userType == 1) {
                typestr = "1,2,3";
            } else if (userType == 2) {
                typestr = "2,3";
            } else {
                typestr = "3";
            }
        }
        List<EnterpriseUser> users = userMapper.getList(user, typestr);
        return CommonResult.success(CommonPage.restPage(users));
    }

    /**
     * 客户端员工管理查询
     * @param user
     * @param userType
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public CommonResult getCurrentAndLowerUserList(EnterpriseUser user, Long userType, int pageNum, int pageSize) {
        List<Long> collect = new ArrayList<>();
        String typestr = "";
        if (userType != null) {
            if (userType == 1) {
                typestr = "1,2,3";
            } else if (userType == 2) {
                typestr = "2,3";
            } else {
                typestr = "3";
            }
        }
        if (user.getEnterpriseId() == null) {
             enterpriseService.findTwoEnterPrise(user.getEId()).stream().forEach(x->collect.add(x.getId()));
             collect.add(user.getEId());
        }
        collect.add(user.getEnterpriseId());
        user.setEId(null);
        user.setEnterpriseIds(collect);
        PageHelper.startPage(pageNum, pageSize);
        List<EnterpriseUser> users = userMapper.getList(user, typestr);
        return CommonResult.success(CommonPage.restPage(users));
    }


    @Override
    public CommonResult getEnterpriseUserList(EnterpriseUser user, Long userType) {
        String typestr = "";
        if (userType != null) {
            if (userType == 1) {
                typestr = "1,2,3";
            } else if (userType == 2) {
                typestr = "2,3";
            } else {
                typestr = "3";
            }
        }
        if (user!=null && user.getEnterpriseId()==null) {
            //Eid是shiroId，看控制器
            List<EnterPriseZnodeDto> twoEnterPrise = enterpriseService.findTwoEnterPriseNotIsLaoMo(user.getEId());
            List<Long> eIds = twoEnterPrise.stream().map(EnterPriseZnodeDto::getId).collect(Collectors.toList());
            eIds.add(user.getEId());
            user.setChildrenIds(eIds);
        }
        List<EnterpriseUser> users = userMapper.getEnterPriseUserList(user, typestr);
        return CommonResult.success(CommonPage.restPage(users));
    }

    @Override
    public CommonResult delById(Long id) {
        EnterpriseUser user = getById(id);
        if (user == null) {
            return CommonResult.failed("用户不存在");
        }
        if (lineUserService.list(new QueryWrapper<>(new FormalLineUser().setUserId(id))).size() > 0) {
            return CommonResult.failed("当前用户已报名线路，不可删除");
        }
        return updateById(new EnterpriseUser().setId(id).setIsDel(Constants.DELETE_INVALID)) ? CommonResult.success("删除成功") : CommonResult.failed("删除失败");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addEnterpriseUser(EnterpriseUser user) {
        if (user.getUserType() == null) {
            return CommonResult.failed("用户类型不能为空");
        }
        EnterpriseUser cardRepeat = enterpriseUserService.getOne(new QueryWrapper<>(new EnterpriseUser().setIDCard(user.getIDCard()).setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID)));
        if (cardRepeat != null) {
            return CommonResult.failed("当前用户身份证号已存在，新增失败");
        }
        user.setCreateTime(LocalDateTime.now());
        user.setStatus(Constants.STATUS_VALID);
        user.setIsDel(Constants.DELETE_VALID);
        save(user);
        userRoleService.save(new EnterpriseUserRole().setUserId(user.getId()).setRoleId(user.getUserType()));
        return CommonResult.success(user, "新增成功");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateEnterpriseUser(EnterpriseUser user) {
        EnterpriseUser enterpriseUser = userMapper.selectById(user.getId());
        if (enterpriseUser == null) {
            return CommonResult.failed("用户不存在");
        }
        EnterpriseUserRole userRole = userRoleService.getOne(new QueryWrapper<>(new EnterpriseUserRole().setUserId(user.getId())));
        if (user.getUserType()!=null && !(user.getUserType().equals(userRole.getRoleId()))) {
            userRoleService.updateById(userRole.setRoleId(user.getUserType()));
        }
        return CommonResult.success(enterpriseUserService.updateById(user));
    }

    @Override
    public CommonResult getUserCount() {
        return CommonResult.success(userMapper.getUserCount());
    }

    @Override
    public List<EnterpriseUser> getListForDownLoad(EnterpriseUser user, Long userType) {
        String typestr = "";
        if (userType != null) {
            if (userType == 1) {
                typestr = "1,2,3";
            } else if (userType == 2) {
                typestr = "2,3";
            } else {
                typestr = "3";
            }
        }
        List<EnterpriseDto> enterpriseDtoList = enterpriseService.getListNoPage(new EnterpriseEnterprise().setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES));
        Map<Long, EnterpriseDto> enterpriseDtoMap = enterpriseDtoList.stream().collect(Collectors.toMap(EnterpriseDto::getId, a -> a,(k1, k2)->k1));
        List<EnterpriseUser> users = userMapper.getList(user, typestr);
        if (user.getEId() != null) {
            users.stream().forEach(i->i.setPayPeople(enterpriseDtoMap.get(user.getEId()).getContacts()).setPayPhone(enterpriseDtoMap.get(user.getEId()).getPhone()));
        }else {
            users.stream().forEach(i->{
                i.setPayPeople(enterpriseDtoMap.get(i.getEId()).getContacts()).setPayPhone(enterpriseDtoMap.get(i.getEId()).getPhone());
            });
        }
        return users;
    }

    @Override
    public EnterpriseUser getUserById(Long id) {
        EnterpriseUser enterpriseUser = userMapper.getUserById(id);
        return enterpriseUser;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult delByIds(List<Long> ids) {
        List<EnterpriseUser> users = new ArrayList<>();
        for (Long id : ids) {
            EnterpriseUser user = getById(id);
            if (user == null) {
                return CommonResult.failed("用户不存在");
            }
            if (lineUserService.list(new QueryWrapper<>(new FormalLineUser().setUserId(id))).size() > 0) {
                return CommonResult.failed("当前已有用户已报名线路，不可删除");
            }
            users.add(new EnterpriseUser().setId(id).setIsDel(Constants.DELETE_INVALID));
        }
        updateBatchById(users);
        return CommonResult.success("删除成功");
    }

}
