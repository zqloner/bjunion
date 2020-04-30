package com.brightease.bju.service.formal.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.brightease.bju.bean.formal.*;
import com.brightease.bju.bean.ticket.TicketInfo;
import com.brightease.bju.dao.formal.FormalLineUserMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseUserService;
import com.brightease.bju.service.formal.*;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.ticket.TicketInfoService;
import com.brightease.bju.utils.DateUtils;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * <p>
 * 正式报名的用户 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class FormalLineUserServiceImpl extends ServiceImpl<FormalLineUserMapper, FormalLineUser> implements FormalLineUserService {

    @Autowired
    private FormalLineExamineService examineService;
    @Autowired
    private EnterpriseEnterpriseService enterpriseService;
    @Autowired
    private FormalLineService formalLineService;
    @Autowired
    private FormalLineUserMapper formalLineUserMapper;
    @Autowired
    private FormalLineEnterpriseService formalLineEnterpriseService;
    @Autowired
    private FormalCostService formalCostService;
    @Autowired
    private TicketInfoService ticketInfoService;
    @Autowired
    private FormalLineUserService formalLineUserService;
    @Autowired
    private EnterpriseUserService enterpriseUserService;

    /**
     * 添加成功之后，插入一条审核记录
     *
     * @param users
     * @param enterpriseId
     * @param
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult add(List<FormalLineUser> users, Long enterpriseId) {
        FormalLine formalLine = formalLineService.getOne(new QueryWrapper<>(new FormalLine().setId(users.get(0).getFormalLineId())
                .setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        if (formalLine == null) return CommonResult.failed("线路不存在");
        if (formalLine.getLineStatus() != null && formalLine.getLineStatus() == Constants.LINE_STATUS_TEAM_YES) {
            return CommonResult.failed("当前线路已成团，不可报名");
        }
        if (formalLine.getUserType() == Constants.USER_LAOMO_TYPE) {
            //核对用户是否是今年第一次报名
            List<Long> recordUserIds = getRecordUserIds();
            if (users != null && users.size() > 0) {
                for (FormalLineUser user : users) {
                    if (recordUserIds.size() > 0) {
                        for (Long recordUserId : recordUserIds) {
                            if (recordUserId.equals(user.getUserId())) {
                                return CommonResult.failed(enterpriseUserService.getById(recordUserId).getName() + "已参加过报名");
                            }
                        }
                    }
                }
            }
        }
        EnterpriseEnterprise enterprise = enterpriseService.getById(enterpriseId);
        FormalLineEnterprise formalLineEnterprise = formalLineEnterpriseService.getOne(new QueryWrapper<>(new FormalLineEnterprise().setEnterpriseId(enterpriseId).setFormalId(users.get(0).getFormalLineId())));
        users.forEach(x -> x.setEnterpriseId(enterpriseId).setFormalId(users.get(0).getFormalLineId()).setLineEnterpriseId(formalLineEnterprise.getId())
                .setUserId(x.getUserId()));
        formalLineEnterpriseService.updateById(formalLineEnterprise.setNowCount(users.size()).setRegDate(LocalDate.now()).setUpdateTime(LocalDateTime.now()).setExamineStatus(Constants.EXAMINE_RESULT_WAIT));
        saveBatch(users);
//        formalLineService.updateById(formalLine.setNowCount(formalLine.getNowCount()+users.size()));
        boolean save = examineService.save(new FormalLineExamine().setFormalLineEnterpriseId(formalLineEnterprise.getId())
                .setEnterpriseId(enterpriseId).setFormalLineId(users.get(0).getFormalLineId()).setRequestName(enterprise.getName())
                .setCreateTime(LocalDateTime.now()).setMessage("初次申请").setExamineStatus(Constants.EXAMINE_WAITING).setUpdateTime(LocalDateTime.now()));
        return save ? CommonResult.success("添加成功") : CommonResult.failed("添加失败");
    }

    @Override
    public CommonResult getRegeistUsers(Long enterpriseId, Long formalLineId, int pageSize, int pageNum) {
        PageHelper.startPage(pageNum, pageSize);
        List<FormalLineUsersDto> users = formalLineUserMapper.getRegeistUsers(enterpriseId, formalLineId);
        return CommonResult.success(CommonPage.restPage(users));
    }

    @Override
    public CommonResult getFormalRecordUsers(Long enterpriseId, Long formalLineId, int pageSize, int pageNum) {
        PageHelper.startPage(pageNum, pageSize);
        List<FormalLineUsersDto> users = formalLineUserMapper.getFormalRecordUsers(enterpriseId, formalLineId);
        return CommonResult.success(CommonPage.restPage(users));
    }

    @Override
    public List<FormalLineUsersExportDto> getFormalRecordExportUsers(Long formalLineId) {
        List<FormalLineUsersExportDto> users = formalLineUserMapper.getFormalRecordExportUsers(formalLineId);
        return users;
    }


    @Override
    public CommonResult getFormalRecordUsersNoPage(Long enterpriseId, Long formalLineId) {

        List<FormalLineUsersDto> users = formalLineUserMapper.getFormalRecordUsers(enterpriseId, formalLineId);
        return CommonResult.success(users);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateRegeistUsers(List<FormalLineUser> users, Long enterpriseId, Long formalLineId) {
        FormalLine formalLine = formalLineService.getOne(new QueryWrapper<>(new FormalLine().setId(formalLineId)
                .setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID)));
        if (formalLine == null) return CommonResult.failed("线路不存在");
        if (formalLine.getLineStatus() != null && formalLine.getLineStatus() == Constants.LINE_STATUS_TEAM_YES) {
            return CommonResult.failed("当前线路已成团，不可修改");
        }
        FormalLineEnterprise formalLineEnterprise = formalLineEnterpriseService.getOne(new QueryWrapper<>(new FormalLineEnterprise().setEnterpriseId(enterpriseId).setFormalId(formalLineId)));

        //查询之前的用户
        //首先查询之前的用户
        List<FormalLineUser> oldExaminYesUsers = formalLineUserService.list(new QueryWrapper<>(new FormalLineUser()
                .setFormalId(formalLineId)
                .setEnterpriseId(enterpriseId)
                .setLineEnterpriseId(formalLineEnterprise.getId())));
        if (formalLine.getUserType() == Constants.USER_LAOMO_TYPE) {
            //核对用户是否是今年第一次报名
            List<Long> recordUserIds = getRecordUserIds();
            for (FormalLineUser user : users) {
                for (FormalLineUser oldExaminYesUser : oldExaminYesUsers) {
                    if (Long.valueOf(oldExaminYesUser.getUserId()).equals(Long.valueOf(user.getUserId()))) {
                        continue;
                    } else {
                        for (Long recordUserId : recordUserIds) {
                            if (recordUserId.equals(user.getUserId())) {
                                return CommonResult.failed(enterpriseUserService.getById(recordUserId).getName() + "已参加过报名");
                            }
                        }
                    }
                }
            }

        }

        EnterpriseEnterprise enterprise = enterpriseService.getById(enterpriseId);
        //过滤出通过的人数。同步人数使用
        int passCount = 0;
        for (FormalLineUser oldExaminYesUser : oldExaminYesUsers) {
            if (oldExaminYesUser.getExamine() != null && oldExaminYesUser.getExamine() == Constants.EXAMINE_PASS) {
                passCount++;
            }
        }
        if (oldExaminYesUsers.size() > 0) {
            int now = formalLine.getNowCount() == null ? 0 : formalLine.getNowCount();
            now = now - passCount;
            //同步人数
            formalLineService.updateById(formalLine.setNowCount(now > 0 ? now : 0));
            //删除之前用户
            removeByIds(oldExaminYesUsers.stream().map(FormalLineUser::getId).collect(Collectors.toList()));
        }
        //设置新加的用户状态为新的标识，不处理之前的用户
        users.forEach(x -> x.setEnterpriseId(enterpriseId).setFormalId(formalLineId).setLineEnterpriseId(formalLineEnterprise.getId())
                .setUserId(x.getUserId()));
        formalLineEnterpriseService.updateById(formalLineEnterprise.setNowCount(users.size()).setUpdateTime(LocalDateTime.now()).setRegDate(LocalDate.now()).setExamineStatus(Constants.EXAMINE_RESULT_WAIT));
        saveBatch(users);
        boolean save = examineService.save(new FormalLineExamine().setFormalLineEnterpriseId(formalLineEnterprise.getId())
                .setEnterpriseId(enterpriseId).setFormalLineId(formalLineId).setRequestName(enterprise.getName())
                .setCreateTime(LocalDateTime.now()).setMessage("修改报名职工").setExamineStatus(Constants.EXAMINE_WAITING).setUpdateTime(LocalDateTime.now()));
        return save ? CommonResult.success("修改成功") : CommonResult.failed("修改失败");
    }

    @Override
    public CommonResult getUsers(FormalLineUsersDto formalLineUsersDto) {
        return CommonResult.success(CommonPage.restPage(formalLineUserMapper.getUsers(formalLineUsersDto)));
    }

    @Override
    public List<FormalLineUsersExportDto> getUsersNoPage(List<Long> enterPriseIds) {
        return formalLineUserMapper.getUsersNoPage(enterPriseIds);
    }

    /**
     * 调整人员到其他线路，同步人数
     *
     * @param userId
     * @param oldLineId
     * @param otherLineId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateUserToOtherLine(Long userId, Long oldLineId, Long otherLineId) {
        List<Long> recordUserIds = getRecordUserIds();
        FormalLine oldFormalLine = formalLineService.getById(oldLineId);
        FormalLine newFormalLine = formalLineService.getById(otherLineId);
        if (!(oldFormalLine.getUserType() == Constants.USER_LAOMO_TYPE) && newFormalLine.getUserType() == (Constants.USER_LAOMO_TYPE)) {
            //不是劳模线路的人切换到劳模线路
            for (Long recordUserId : recordUserIds) {
                if (Long.valueOf(userId).equals(Long.valueOf(recordUserId))) {
                    return CommonResult.failed("该用户已参加过劳模报名,不可更改");
                }
            }
        }
        FormalLineUser formalLineUser = getOne(new QueryWrapper<>(new FormalLineUser().setUserId(userId).setFormalId(oldLineId).setExamine(Constants.EXAMINE_PASS)));
        if (formalLineUser == null) {
            return CommonResult.failed("参数错误");
        }
        if (newFormalLine.getLineStatus() != Constants.LINE_STATUS_TEAM_YES) {
            return CommonResult.failed("新线路未成团，请重新选择");
        }

        //原来的人数-1
        oldFormalLine.setNowCount(oldFormalLine.getNowCount() - 1);
        formalLineService.updateById(oldFormalLine);

        //新线路人数+1
        newFormalLine.setNowCount(newFormalLine.getNowCount() + 1);
        formalLineService.updateById(newFormalLine);

        removeById(formalLineUser);
        boolean save = save(new FormalLineUser().setEnterpriseId(formalLineUser.getEnterpriseId()).setFormalId(otherLineId).setUserId(formalLineUser.getUserId()).setLineEnterpriseId(formalLineUser.getLineEnterpriseId()).setExamine(Constants.EXAMINE_PASS));
        return save ? CommonResult.success("修改成功") : CommonResult.success("修改失败");
    }

    @Override
    public CommonResult getCostInfoList(StatisticsCostDto costDto, Integer pageNum, Integer pageSize) {
        //查找线路实际人数
        List<StatisticsCostFormalLineDto> usersAll = formalLineUserMapper.getAllUsersByFormalLine(costDto);
        Map<Long, StatisticsCostFormalLineDto> usersMap = usersAll.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //查找总共会添加费用
        List<StatisticsCostFormalLineDto> zghPrice = formalCostService.getZghPrice(costDto);
        Map<Long, StatisticsCostFormalLineDto> zghPriceMap = zghPrice.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //查找领队添加费用
        List<StatisticsCostFormalLineDto> leaderPrice = formalCostService.getLeaderPrice(costDto);
        Map<Long, StatisticsCostFormalLineDto> leaderPriceMap = leaderPrice.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //计算疗养费用，后台添加的
        List<StatisticsCostFormalLineDto> calList = new ArrayList<>();
        for (StatisticsCostFormalLineDto dto : usersAll) {
            StatisticsCostFormalLineDto cal = new StatisticsCostFormalLineDto();
            cal.setFormallineId(dto.getFormallineId());
            BigDecimal lyfy = new BigDecimal(0);
            StatisticsCostFormalLineDto zghPriceDto = zghPriceMap.get(dto.getFormallineId());
            if (zghPriceDto != null) {
                lyfy = lyfy.add(zghPriceDto.getAllPrice()).divide(new BigDecimal(dto.getUsersCount()), 2, BigDecimal.ROUND_HALF_UP);
            }
            cal.setLyfy(lyfy);
            BigDecimal ldfy = new BigDecimal(0);
            StatisticsCostFormalLineDto ldfyDto = leaderPriceMap.get(dto.getFormallineId());
            if (ldfyDto != null) {
                ldfy = ldfy.add(ldfyDto.getAllPrice().divide(new BigDecimal(dto.getUsersCount()), 2, BigDecimal.ROUND_HALF_UP));
            }
            cal.setLdfy(ldfy);
            calList.add(cal);
        }
        Map<Long, StatisticsCostFormalLineDto> calListMap = calList.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        PageHelper.startPage(pageNum, pageSize);
        //首先查找用户
        List<StatisticsCostDto> users = formalLineUserMapper.getCostUsers(costDto);
        CommonPage<StatisticsCostDto> statisticsCostDtoCommonPage = CommonPage.restPage(users);
        for (StatisticsCostDto user : statisticsCostDtoCommonPage.getList()) {
            //查找交通费用
            TicketInfo ticketInfo = ticketInfoService.getOne(new QueryWrapper<>(new TicketInfo().setFormalLineUserId(user.getId())));
            BigDecimal jtfy = new BigDecimal(0);
            if (ticketInfo != null) {
                jtfy = jtfy.add(ticketInfo.getBackPrice().add(ticketInfo.getGoPrice()));
            }
            user.setJtfy(jtfy);
            //查找领队添加的费用
            BigDecimal ldfy = new BigDecimal(0);
            StatisticsCostFormalLineDto ldfyDto = calListMap.get(user.getFormallineId());
            if (ldfyDto != null) {
                ldfy = ldfy.add(ldfyDto.getLdfy());
            }
            //查找个人费用
            FormalCostInfoDto ldfyPersonDto = formalCostService.getInfoByUserId(user.getFormallineId(), user.getId());
            if (ldfyPersonDto != null && ldfyPersonDto.getInfos().size() > 0) {
                List<FormalCostInfo> infos = ldfyPersonDto.getInfos();
                for (FormalCostInfo info : infos) {
                    ldfy = ldfy.add(info.getPrice());
                }
            }
            user.setLdfy(ldfy);
            //设置疗养费用
            BigDecimal lyfy = new BigDecimal(0);
            StatisticsCostFormalLineDto lyfyDto = calListMap.get(user.getFormallineId());
            if (ldfyDto != null) {
                lyfy = lyfy.add(lyfyDto.getLyfy());
            }
            user.setLyfy(lyfy);
            BigDecimal allfy = jtfy.add(ldfy).add(lyfy);
            user.setAllfy(allfy);
        }

        return CommonResult.success(statisticsCostDtoCommonPage);
    }

    //不分页
    @Override
    public CommonResult getCostInfoListNoPage(StatisticsCostDto costDto) {
        //查找线路实际人数
        List<StatisticsCostFormalLineDto> usersAll = formalLineUserMapper.getAllUsersByFormalLine(costDto);
        Map<Long, StatisticsCostFormalLineDto> usersMap = usersAll.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //查找总共会添加费用
        List<StatisticsCostFormalLineDto> zghPrice = formalCostService.getZghPrice(costDto);
        Map<Long, StatisticsCostFormalLineDto> zghPriceMap = zghPrice.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //查找领队添加费用
        List<StatisticsCostFormalLineDto> leaderPrice = formalCostService.getLeaderPrice(costDto);
        Map<Long, StatisticsCostFormalLineDto> leaderPriceMap = leaderPrice.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //计算疗养费用，后台添加的
        List<StatisticsCostFormalLineDto> calList = new ArrayList<>();
        for (StatisticsCostFormalLineDto dto : usersAll) {
            StatisticsCostFormalLineDto cal = new StatisticsCostFormalLineDto();
            cal.setFormallineId(dto.getFormallineId());
            BigDecimal lyfy = new BigDecimal(0);
            StatisticsCostFormalLineDto zghPriceDto = zghPriceMap.get(dto.getFormallineId());
            if (zghPriceDto != null) {
                lyfy = lyfy.add(zghPriceDto.getAllPrice()).divide(new BigDecimal(dto.getUsersCount()), 2, BigDecimal.ROUND_HALF_UP);
            }
            cal.setLyfy(lyfy);
            BigDecimal ldfy = new BigDecimal(0);
            StatisticsCostFormalLineDto ldfyDto = leaderPriceMap.get(dto.getFormallineId());
            if (ldfyDto != null) {
                ldfy = ldfy.add(ldfyDto.getAllPrice().divide(new BigDecimal(dto.getUsersCount()), 2, BigDecimal.ROUND_HALF_UP));
            }
            cal.setLdfy(ldfy);
            calList.add(cal);
        }
        Map<Long, StatisticsCostFormalLineDto> calListMap = calList.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //首先查找用户
        List<StatisticsCostDto> users = formalLineUserMapper.getCostUsers(costDto);
        CommonPage<StatisticsCostDto> statisticsCostDtoCommonPage = CommonPage.restPage(users);
        for (StatisticsCostDto user : statisticsCostDtoCommonPage.getList()) {
            //查找交通费用
            TicketInfo ticketInfo = ticketInfoService.getOne(new QueryWrapper<>(new TicketInfo().setFormalLineUserId(user.getId())));
            BigDecimal jtfy = new BigDecimal(0);
            if (ticketInfo != null) {
                jtfy = jtfy.add(ticketInfo.getBackPrice().add(ticketInfo.getGoPrice()));
            }
            user.setJtfy(jtfy);
            //查找领队添加的费用
            BigDecimal ldfy = new BigDecimal(0);
            StatisticsCostFormalLineDto ldfyDto = calListMap.get(user.getFormallineId());
            if (ldfyDto != null) {
                ldfy = ldfy.add(ldfyDto.getLdfy());
            }
            //查找个人费用
            FormalCostInfoDto ldfyPersonDto = formalCostService.getInfoByUserId(user.getFormallineId(), user.getId());
            if (ldfyPersonDto != null && ldfyPersonDto.getInfos().size() > 0) {
                List<FormalCostInfo> infos = ldfyPersonDto.getInfos();
                for (FormalCostInfo info : infos) {
                    ldfy = ldfy.add(info.getPrice());
                }
            }
            user.setLdfy(ldfy);
            //设置疗养费用
            BigDecimal lyfy = new BigDecimal(0);
            StatisticsCostFormalLineDto lyfyDto = calListMap.get(user.getFormallineId());
            if (ldfyDto != null) {
                lyfy = lyfy.add(lyfyDto.getLyfy());
            }
            user.setLyfy(lyfy);
            BigDecimal allfy = jtfy.add(ldfy).add(lyfy);
            user.setAllfy(allfy);
        }

        return CommonResult.success(statisticsCostDtoCommonPage);
    }

    @Override
    public List<StatisticsCostDto> exportCostInfoList(StatisticsCostDto costDto) {
        //查找线路实际人数
        List<StatisticsCostFormalLineDto> usersAll = formalLineUserMapper.getAllUsersByFormalLine(costDto);
        Map<Long, StatisticsCostFormalLineDto> usersMap = usersAll.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //查找总共会添加费用
        List<StatisticsCostFormalLineDto> zghPrice = formalCostService.getZghPrice(costDto);
        Map<Long, StatisticsCostFormalLineDto> zghPriceMap = zghPrice.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //查找领队添加费用
        List<StatisticsCostFormalLineDto> leaderPrice = formalCostService.getLeaderPrice(costDto);
        Map<Long, StatisticsCostFormalLineDto> leaderPriceMap = leaderPrice.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //计算疗养费用，后台添加的
        List<StatisticsCostFormalLineDto> calList = new ArrayList<>();
        for (StatisticsCostFormalLineDto dto : usersAll) {
            StatisticsCostFormalLineDto cal = new StatisticsCostFormalLineDto();
            cal.setFormallineId(dto.getFormallineId());
            BigDecimal lyfy = new BigDecimal(0);
            StatisticsCostFormalLineDto zghPriceDto = zghPriceMap.get(dto.getFormallineId());
            if (zghPriceDto != null) {
                lyfy = lyfy.add(zghPriceDto.getAllPrice()).divide(new BigDecimal(dto.getUsersCount()), 2, BigDecimal.ROUND_HALF_UP);
            }
            cal.setLyfy(lyfy);
            BigDecimal ldfy = new BigDecimal(0);
            StatisticsCostFormalLineDto ldfyDto = leaderPriceMap.get(dto.getFormallineId());
            if (ldfyDto != null) {
                ldfy = ldfy.add(ldfyDto.getAllPrice().divide(new BigDecimal(dto.getUsersCount()), 2, BigDecimal.ROUND_HALF_UP));
            }
            cal.setLdfy(ldfy);
            calList.add(cal);
        }
        Map<Long, StatisticsCostFormalLineDto> calListMap = calList.stream().collect(Collectors.toMap(StatisticsCostFormalLineDto::getFormallineId, a -> a, (k1, k2) -> k1));
        //首先查找用户
        List<StatisticsCostDto> users = formalLineUserMapper.getCostUsers(costDto);
        for (StatisticsCostDto user : users) {
            //查找交通费用
            TicketInfo ticketInfo = ticketInfoService.getOne(new QueryWrapper<>(new TicketInfo().setFormalLineUserId(user.getId())));
            BigDecimal jtfy = new BigDecimal(0);
            if (ticketInfo != null) {
                jtfy = jtfy.add(ticketInfo.getBackPrice().add(ticketInfo.getGoPrice()));
            }
            user.setJtfy(jtfy);
            //查找领队添加的费用
            BigDecimal ldfy = new BigDecimal(0);
            StatisticsCostFormalLineDto ldfyDto = calListMap.get(user.getFormallineId());
            if (ldfyDto != null) {
                ldfy = ldfy.add(ldfyDto.getLdfy());
            }
            //查找个人费用
            FormalCostInfoDto ldfyPersonDto = formalCostService.getInfoByUserId(user.getFormallineId(), user.getId());
            if (ldfyPersonDto != null && ldfyPersonDto.getInfos().size() > 0) {
                List<FormalCostInfo> infos = ldfyPersonDto.getInfos();
                for (FormalCostInfo info : infos) {
                    ldfy = ldfy.add(info.getPrice());
                }
            }
            user.setLdfy(ldfy);
            //设置疗养费用
            BigDecimal lyfy = new BigDecimal(0);
            StatisticsCostFormalLineDto lyfyDto = calListMap.get(user.getFormallineId());
            if (ldfyDto != null) {
                lyfy = lyfy.add(lyfyDto.getLyfy());
            }
            user.setLyfy(lyfy);
            BigDecimal allfy = jtfy.add(ldfy).add(lyfy);
            user.setAllfy(allfy);
        }

        return users;
    }

    @Override
    public CommonResult getNextEnterpriseRegUsers(Long formalLineUserId, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<FormalLineUsersDto> users = formalLineUserMapper.getNextEnterpriseRegUsers(formalLineUserId);
        return CommonResult.success(CommonPage.restPage(users));
    }

    @Override
    public List<Long> getRecordUserIds() {
        LocalDateTime statTime = LocalDateTime.now().minusYears(1);
        LocalDateTime nowTime = LocalDateTime.now();
        return formalLineUserMapper.getRecordUserIds(statTime, nowTime);
    }

}
