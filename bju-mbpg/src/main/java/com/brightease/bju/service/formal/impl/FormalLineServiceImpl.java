package com.brightease.bju.service.formal.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.FormalLineDto;
import com.brightease.bju.bean.dto.SanatoriumOrderDto;
import com.brightease.bju.bean.dto.formallinedto.FormalLineImportDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import com.brightease.bju.bean.formal.FormalLineExamine;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.dao.formal.FormalLineMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.formal.FormalLineEnterpriseService;
import com.brightease.bju.service.formal.FormalLineExamineService;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.service.line.LineLineService;
import com.github.pagehelper.PageHelper;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

/**
 * <p>
 * 正式报名线路 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalLineServiceImpl extends ServiceImpl<FormalLineMapper, FormalLine> implements FormalLineService {

    @Autowired
    private FormalLineMapper formalLineMapper;

    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;

    @Autowired
    private FormalLineUserService formalLineUserService;

    @Autowired
    private LineLineService lineService;

    @Autowired
    private FormalLineExamineService examineService;

    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    /**
     * 查询当前领队所带团列表
     */
    @Override
    public CommonResult getFormalLineList(Map<String, Object> param, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        //List<Map<String, Object>> lineList = formalLineMapper.getFormalLineList(param);
        CommonResult result = CommonResult.success(CommonPage.restPage(formalLineMapper.getFormalLineList(param)));
        return result;
    }

    /**
     * 查询疗养团详情
     */
    @Override
    public CommonResult getFormalSanatoriumInfo(Map<String, Object> param) {
        CommonResult result = CommonResult.success(formalLineMapper.getFormalSanatoriumInfo(param));
        return result;
    }

    @Override
    public CommonResult getFormalLineUserList(Map<String, Object> param, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        // List<Map<String, Object>> userList = formalLineMapper.getFormalLineUserList(param);
        CommonResult result = CommonResult.success(CommonPage.restPage(formalLineMapper.getFormalLineUserList(param)));
        return result;
    }

    /**
     * 查询疗养团涉及单位列表
     */
    @Override
    public CommonResult getFormalLineCompanyList(Map<String, Object> param) {
        // List<Map<String, Object>> companyList = formalLineMapper.getFormalLineCompanyList(param);
        CommonResult result = CommonResult.success(formalLineMapper.getFormalLineCompanyList(param));
        return result;
    }

    /**
     * 管理端查看正式报名线路
     *
     * @param userType
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public CommonResult getList(String name, Long userType, Integer pageNum, Integer pageSize, String startTime, String endTime, Long isTeam) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalLineMapper.getlist(name, userType, startTime, endTime, isTeam)));
    }


    /**
     * 管理端添加正式报名路线
     *
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addFormalLine(FormalLine formalLine) {
        if (lineService.getById(formalLine.getLineId()) == null) return CommonResult.failed("所选线路不存在");
        if (formalLine.getEnterprises() == null) return CommonResult.failed("下属单位不能为空");
        boolean save = save(formalLine.setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID).setCreateTime(LocalDateTime.now()).setUpdateTime(LocalDateTime.now()).setNowCount(Constants.FORMAL_LINE_ADD_NOW_COUNT));
        List<FormalLineEnterprise> lastList = new ArrayList<>();
        if (save) {
            List<FormalLineEnterprise> enterprisesList = formalLine.getEnterprises();
            for (FormalLineEnterprise enterpris : enterprisesList) {
                enterpris.setFormalId(formalLine.getId()).setNowCount(0);
                lastList.add(enterpris);
                //检查下面的子部门
//                List<EnterpriseEnterprise> sonList = enterpriseService.list(new QueryWrapper<>(new EnterpriseEnterprise().setPid(enterpris.getEnterpriseId()).setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID)));
//                for (EnterpriseEnterprise enterprise : sonList) {
//                    FormalLineEnterprise son = new FormalLineEnterprise();
//                    son.setFormalId(formalLine.getId()).setEnterpriseId(enterprise.getId()).setMaxCount(enterpris.getMaxCount()).setNowCount(0);
//                    lastList.add(son);
//                }
            }
            boolean b = formalLineEnterpriseService.saveBatch(lastList);
            if (b) {
                return CommonResult.success("添加成功");
            }
        }
        return CommonResult.failed("添加失败");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateFormalLine(FormalLine formalLine) {
        FormalLine old = getById(formalLine.getId());
        if (old == null) {
            return CommonResult.failed("线路不存在");
        }
        if (CollectionUtils.isEmpty(formalLine.getEnterprises())) {
            return CommonResult.failed("下属单位不能为空");
        }
        if (old.getIsTeam() != null && old.getIsTeam() == Constants.TEAM_YES) {
            return CommonResult.failed("当前线路已成团，不可编辑");
        }

        formalLine.setUpdateTime(LocalDateTime.now());
        boolean update = updateById(formalLine);
        if (update) {
            List<FormalLineEnterprise> list = formalLineEnterpriseService.list(new QueryWrapper<>(new FormalLineEnterprise().setFormalId(formalLine.getId())));
            List<FormalLineEnterprise> enterprises = formalLine.getEnterprises();
            try {
                System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                //线路信息
                FormalLine formalLine1 = getById(formalLine);
                List<FormalLineEnterprise> theSameList = new ArrayList<>();
                //求相同的用于更新
                list.stream().forEach(item -> {
                    enterprises.forEach(x -> {
                        if (item.getEnterpriseId().equals(x.getEnterpriseId())) {
                            theSameList.add(item);
                        }
                    });
                });
                theSameList.forEach(x -> {
                    for (FormalLineEnterprise formalLineEnterprise : enterprises) {
                        if (x.getEnterpriseId().equals(formalLineEnterprise.getEnterpriseId())) {
                            formalLineEnterpriseService.updateById(x.setMaxCount(formalLineEnterprise.getMaxCount()).setNowCount(formalLine1.getNowCount()));
                        }
                    }
                });
                //求不同的，进行删除
                List<FormalLineEnterprise> theDifferent = new ArrayList<>();
                List<FormalLineEnterprise> theNoIdDifferent = new ArrayList<>();
                for (FormalLineEnterprise x : list) {
                    label1:
                    for (FormalLineEnterprise formalLineEnterprise : enterprises) {
                        if (x.getEnterpriseId().equals(formalLineEnterprise.getEnterpriseId())) {
                            break label1;
                        } else {
                            theDifferent.add(x);
                        }
                    }
                }

                for (FormalLineEnterprise x : enterprises) {
                    label2:
                    for (FormalLineEnterprise formalLineEnterprise : list) {
                        if (x.getEnterpriseId().equals(formalLineEnterprise.getEnterpriseId())) {
                            break label2;
                        } else {
                            theNoIdDifferent.add(x);
                        }
                    }
                }
                // 求不同的进行删除
                theDifferent.forEach(x -> {
                            formalLineEnterpriseService.removeById(x.getId());
                        }
                );
                //求不同的进行保存
                theNoIdDifferent.forEach(x -> {
                    formalLineEnterpriseService.save(x.setFormalId(formalLine.getId()).setNowCount(formalLine1.getNowCount()));
                });
                System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            } catch (Exception e) {
                e.printStackTrace();
                return CommonResult.failed("修改失败");
            }
        }
        return CommonResult.success("修改成功");
    }

    @Override
    public FormalLine getInfoById(Long id) {
        return formalLineMapper.getInfoById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult delById(Long id) {
        FormalLine old = getById(id);
        if (old == null) {
            return CommonResult.failed("线路不存在");
        }
        //有人报名，处于审核中也不可以删除。
        List<FormalLineExamine> examines = examineService.list(new QueryWrapper<>(new FormalLineExamine().setFormalLineId(id)));
        if (examines != null && examines.size() > 0) {
            return CommonResult.failed("当前线路已有人员报名，不可删除");
        }
        updateById(new FormalLine().setId(id).setIsDel(Constants.DELETE_INVALID));
        formalLineEnterpriseService.removeById(new FormalLineEnterprise().setFormalId(id));
        return CommonResult.success("删除成功");
    }

    @Override
    public CommonResult updateIsTeam(FormalLine formalLine) {
        FormalLine old = getById(formalLine.getId());
        if (old == null) {
            return CommonResult.failed("线路不存在");
        }
        if (formalLine.getIsTeam() == Constants.TEAM_NO) {
            formalLine.setLineStatus(Constants.LINE_STATUS_TEAM_NO);
            if (Long.valueOf(old.getUserType()).equals(Long.valueOf(Constants.USER_LAOMO_TYPE))) {
                formalLineUserService.list(new QueryWrapper<>(new FormalLineUser().setFormalId(old.getId()))).stream().forEach(x -> {
                    formalLineUserService.updateById(x.setYesNo(Constants.USER_YES_N0_NO));
                });
            }
        } else {
            formalLine.setLineStatus(Constants.LINE_STATUS_TEAM_YES);
            formalLine.setMessage("");
        }
        return updateById(formalLine) ? CommonResult.success("修改成功") : CommonResult.failed("修改失败");
    }

    /**
     * 客户端查看报名列表
     *
     * @param type
     * @param userType
     * @return
     */
    @Override
    public CommonResult getRegistList(Long userId, Long type, Long userType, int pageNum, int pageSize) {
        List<FormalLine> formalLines = formalLineMapper.getRegList(userId, type, userType);
        LocalDateTime localDateTime = LocalDateTime.now();
        formalLines.forEach(x -> {
            List<FormalLineUser> formalLineUsers = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser().setFormalId(x.getId()).setEnterpriseId(userId)));
//            0为报名即将，1为开始报名，2为查看报名，3为报名已结束，4为已报名并且报名结束
            if (x.getRBeginTime().isAfter(LocalDateTime.now())) {
                //报名即将开始   0
                x.setTtl(Constants.PRE_REGISTRATION_NOTBEGIN);
            } else if (formalLineUsers != null && formalLineUsers.size() > 0 && x.getREndTime().isBefore(LocalDateTime.now())) {
                x.setTtl(Constants.PRE_REGISTRATION_CAT_END);   //  已报名并且报名结束 4
            } else if (x.getREndTime().isBefore(LocalDateTime.now())) {
                //报名已结束    3
                x.setTtl(Constants.PRE_REGISTRATION_END);
            } else {
                if (formalLineUsers != null) {
                    //报名中
                    if (formalLineUsers.size() == 0) {
                        //开始报名   1
                        x.setTtl(Constants.PRE_REGISTRATION_START);
                    } else {
                        // 查看报名  2
                        x.setTtl(Constants.PRE_REGISTRATION_CAT);
                    }
                }
            }
        });
        return CommonResult.success(formalLines);
    }

    @Override
    public List<FormalLine> getStatisticsList(FormalLineDto formalLineDto) {
        return formalLineMapper.getStatisticsList(formalLineDto);
    }

    @Override
    public List<FormalLineDto> getFLLeaderList(String name, Integer userType) {
        return formalLineMapper.getFLLeaderList(name, userType);
    }

    /**
     * 我的疗养订单list
     *
     * @param orderDto
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public CommonResult getMySanatoriumOrderLis(SanatoriumOrderDto orderDto, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<SanatoriumOrderDto> dtos = formalLineMapper.getMySanatoriumOrderLis(orderDto);
        return CommonResult.success(CommonPage.restPage(dtos));
    }

    @Override
    public List<FormalLine> getStatisticsListExamineYes(FormalLineDto formalLineDto) {
        List<FormalLine> formalLines = formalLineMapper.getFormallineExamineYes(formalLineDto);
        return formalLines;
    }

    @Override
    public CommonResult getListNopageIsTeam() {
        return CommonResult.success(formalLineMapper.getListNopageIsTeam());
    }

    @Override
    public SanatoriumOrderDto getLineDetail(Long formalId) {
        return formalLineMapper.getLineDetail(formalId);
    }

    @Override
    public CommonResult addFormalLineBatch(List<FormalLineImportDto> importlist) {
        for (FormalLineImportDto formalLineImportDto : importlist) {
            FormalLine formalLine = formalLineImportDto.getFormalLine();
            formalLine.setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID).setCreateTime(LocalDateTime.now()).setNowCount(0);
            save(formalLine);
            FormalLineEnterprise enterprise = formalLineImportDto.getFormalLineEnterprise();
            enterprise.setNowCount(0);
            enterprise.setFormalId(formalLine.getId());
            formalLineEnterpriseService.save(enterprise);
        }
        return CommonResult.success("导入成功，共" + importlist.size() + "条数据");
    }

    @Override
    public boolean checkFormalLineUserList(String formalid) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("formalid", Long.valueOf(formalid));
        List<Map<String, Object>> userlist = formalLineMapper.getFormalLineUserList(param);
        int checked = 0;
        for (int i = 0; i < userlist.size(); i++) {
            if (null != userlist.get(i).get("yes_no")) {
                checked++;
            }
        }
        if (checked == userlist.size()) {
            return true;
        }
        return false;
    }

    @Override
    public CommonResult checkIsFirstFormalRecord(Long shiroId, Long userType) {
        LocalDate now = LocalDate.now();
        String year = now.toString().substring(0, 4);
        String start = year + "-01-01";
        String end = year + "-12-31";
        List<FormalLineEnterprise> formalLineEnterprises = formalLineMapper.checkIsFirstFormalRecord(start, end, shiroId, userType);
        if (formalLineEnterprises.size() > 0) {
            return CommonResult.failed("您已经参加过报名，正确的应该是每年一次");
        }
        return CommonResult.success(null);
    }

    @Override
    public List<FormalLine> getFormalLinesForRecord(LocalDate nowTime, Integer lineStatus) {
        return formalLineMapper.getFormalLinesForRecord(nowTime, lineStatus);
    }
}
