package com.brightease.bju.service.pre.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.*;
import com.brightease.bju.bean.dto.predto.AreaEnterpriseMonth;
import com.brightease.bju.bean.dto.predto.EnterPriseZnodeDto;
import com.brightease.bju.bean.dto.predto.LowerToDetail;
import com.brightease.bju.bean.dto.predto.PreMonthAndName;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.pre.*;
import com.brightease.bju.dao.pre.PreLineAreaMapper;
import com.brightease.bju.dao.pre.PreLineEnterpriseMapper;
import com.brightease.bju.dao.pre.PreLineMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.pre.*;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.sys.SysAreaService;
import com.brightease.bju.service.sys.SysDictService;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * <p>
 * 预报名线路 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class PreLineServiceImpl extends ServiceImpl<PreLineMapper, PreLine> implements PreLineService {

    @Resource
    private PreLineMapper preLineMapper;
    @Resource
    private PreLineAreaMapper preLineAreaMapper;
    @Resource
    private PreLineMonthService preLineMonthService;

    @Resource
    private PreLineEnterpriseMapper preLineEnterpriseMapper;
    @Resource
    private PreLineStatisticsService preLineStatisticsService;
    @Resource
    private PreLineAreaService preLineAreaService;
    @Resource
    private PreLineEnterpriseService preLineEnterpriseService;
    @Resource
    private EnterpriseEnterpriseService enterpriseService;
    @Resource
    private SysAreaService sysAreaService;
    @Resource
    private SysDictService sysDictService;


    /**
     * 条件查询
     * @param userType
     * @param title
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public CommonResult getPreLines(Long userType, String title,Integer type, Integer pageNum, Integer pageSize,Long shiroId) {
        PageHelper.startPage(pageNum,pageSize);
        List<PreLineDto> lines = preLineMapper.findPreByConditions(userType,title,type,shiroId);
        if(lines != null && lines.size()>0){
            for(PreLineDto preLineDto : lines){
                List<PreLine> lowerLeverPreLine = list(new QueryWrapper<>(new PreLine().setParentId(preLineDto.getId()).
                        setIsDel(Constants.DELETE_VALID).setStat(Constants.STATUS_VALID)));
                Long nowCount = 0L;
                for(PreLine x:lowerLeverPreLine) {
                    if(shiroId == null) {
                        List<PreLineStatistics> preLineStatistics = preLineStatisticsService.findByPreId(x.getId(), userType, shiroId);
//                        preLineStatistics.stream().filter(y -> y.getPersonCount() != null).mapToLong(PreLineStatistics::getPersonCount).sum();
                        nowCount += preLineStatistics.stream().filter(y -> y.getPersonCount() != null).mapToLong(PreLineStatistics::getPersonCount).sum();
                    }else {
                        //查出二级企业下级企业id和自己id
                        List<Long> ids = new ArrayList<>();
                        ids.add(shiroId);
                        List<EnterPriseZnodeDto> enterPriseZnodeDtos = enterpriseService.findTwoEnterPrise(shiroId);
                        enterPriseZnodeDtos.forEach(k->ids.add(k.getId()));
                        List<PreLineStatistics> byEnterprisIds = preLineStatisticsService.findByEnterprisIds(x.getId(), userType, ids);
                        nowCount += byEnterprisIds.stream().filter(z -> z.getPersonCount() != null).mapToLong(PreLineStatistics::getPersonCount).sum();
                    }
                    List<PreLineEnterprise> enterprises = preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(x.getId()).setEnterpriseId(shiroId)));
                    if (enterprises != null && enterprises.size() > 0 && shiroId != null) {
                        preLineDto.setNextTime(getById(x.getId()).getCreateTime());
                    }
                }
                preLineDto.setNowCount(nowCount);
                List<Long> ids = preLineMapper.findPreIsNext(preLineDto.getId(),shiroId);
                if(ids !=null && ids.size()>0) {
                        preLineDto.setLower(1L);  //已下发
                    } else {
                        preLineDto.setLower(0L);  //未下发
                    }
            }
        }
        return CommonResult.success(CommonPage.restPage(lines),"查询成功");
    }

    /**
     * 新增路线
     * @param preLineVO
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addPreLines(PreLineVO preLineVO) {
        if (preLineVO.getPreLine().getTitle() == null || "".equals(preLineVO.getPreLine().getTitle())) {
            return CommonResult.failed("路线名字不能为空");
        }
        save(preLineVO.getPreLine().setIsNext(Constants.PRE_NOT_IN_NEXT).setIsDel(Constants.DELETE_VALID).setStat(Constants.STATUS_VALID).setCreateTime(LocalDateTime.now()));//insertPreLine(preLine);
        //月份中间表
        if(preLineVO.getMonths()!=null && preLineVO.getMonths().size()>0){
            preLineVO.getMonths().forEach(item-> preLineMonthService.save(new PreLineMonth().setPreId(preLineVO.getPreLine().getId()).setDictId(item)));
        }
        //地域中间表
        if(preLineVO.getAreas()!=null && preLineVO.getAreas().size()>0) {
            preLineVO.getAreas().forEach(item -> preLineAreaService.save(new PreLineArea().setPreId(preLineVO.getPreLine().getId()).setAreaId(item)));
        }
        //企业中间表
        if(preLineVO.getEnterPrises()!=null && preLineVO.getEnterPrises().size()>0) {
            preLineVO.getEnterPrises().forEach(item -> preLineEnterpriseService.save(new PreLineEnterprise().setPreId(preLineVO.getPreLine().getId()).setEnterpriseId(item)));
        }
        return CommonResult.success(null,"新增成功");
    }

    /**
     *  到达修改预定路线
     * @param preId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult toUpdatePreLines(Long preId) {
        PreLineVO preLineVO = new PreLineVO();
        preLineVO.setPreLine(getById(preId));
        //地域
        List<Long> ares = preLineAreaMapper.getCountAreas(preId);
//        preLineAreaService.list(new QueryWrapper<>(new PreLineArea().setPreId(preId))).forEach(x -> {
//            if(sysAreaService.getById(x.getAreaId()).getParentId()!=null && sysAreaService.getById(x.getAreaId()).getParentId()!= Constants.FIRST_LEVER_AREA){
//                ares.add(x.getAreaId());
//            }
//        });
        preLineVO.setAreas(ares);
        //月份
        List<Long> months = new ArrayList<>();
        preLineMonthService.list(new QueryWrapper<>(new PreLineMonth().setPreId(preId))).forEach(x -> {
            months.add(x.getDictId());
        });
        preLineVO.setMonths(months);
        //企业
        List<Long> enterpriseEnterprises = preLineEnterpriseMapper.getCountEnterPrise(preId);
//        preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(preId))).forEach(x -> {
//            if(enterpriseService.getById(x.getEnterpriseId()).getPid()!=null && enterpriseService.getById(x.getEnterpriseId()).getPid()!=Constants.FIRST_LEVER_ENTERPRISE
//            ){
//                enterpriseEnterprises.add(x.getEnterpriseId());
//            }
//        });
        preLineVO.setEnterPrises(enterpriseEnterprises);
        return CommonResult.success(preLineVO);
    }

    /**
     *  到达修改预定路线
     * @param preId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult areaOnChange(Long preId,String title) {
//       List<>
        return null;
    }

    /**
     *  修改预定路线
     * @param preLineVO
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult doUpdatePreLines(PreLineVO preLineVO) {
        //更新路线
        saveOrUpdate(preLineVO.getPreLine().setStat(Constants.DELETE_VALID).setIsDel(Constants.DELETE_VALID));
        //更新地域,先删除,再新增
        preLineAreaService.list(new QueryWrapper<>(new PreLineArea().setPreId(preLineVO.getPreLine().getId()))).forEach(x -> {
            preLineAreaService.removeById(x.getId());
        });
        if(preLineVO.getAreas()!=null && preLineVO.getAreas().size()>0) {
            preLineVO.getAreas().forEach(x -> {
                preLineAreaService.save(new PreLineArea().setPreId(preLineVO.getPreLine().getId()).setAreaId(x));
            });
        }

        //月份
        preLineMonthService.list(new QueryWrapper<>(new PreLineMonth().setPreId(preLineVO.getPreLine().getId()))).forEach(x -> {
            preLineMonthService.removeById(x.getId());
        });
        if(preLineVO.getMonths()!=null && preLineVO.getMonths().size()>0) {
            preLineVO.getMonths().forEach(x -> {
                preLineMonthService.save(new PreLineMonth().setPreId(preLineVO.getPreLine().getId()).setDictId(x));
            });
        }
        //企业
        preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(preLineVO.getPreLine().getId()))).forEach(x -> {
            preLineEnterpriseService.removeById(x.getId());
        });
        if(preLineVO.getEnterPrises()!=null && preLineVO.getEnterPrises().size()>0) {
            preLineVO.getEnterPrises().forEach(x -> {
                preLineEnterpriseService.save(new PreLineEnterprise().setPreId(preLineVO.getPreLine().getId()).setEnterpriseId(x));
            });
        }
        return CommonResult.success("修改成功");
    }

    /**
     * 删除预定路线，已有下发路线不能删除，已有报名不能删除(可以不用考虑,有报名肯定有下发路线)
     * @param preId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult deletePreLine(Long preId) {
        List<PreLine> preLines = list(new QueryWrapper<>(new PreLine().setParentId(preId)));
        if(preLines != null && preLines.size()>0){
            return CommonResult.failed("已有下发路线,删除失败");
        }
        updateById(new PreLine().setId(preId).setIsDel(Constants.DELETE_INVALID).setParentId(-1L));

        return CommonResult.success(null,"删除成功");
    }

    /**
     * 客户端新增路线(下发新增)
     * @param preLineVO
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addClientPreLines(PreLineVO preLineVO) {
        PreLine preLine = getById(preLineVO.getPreLine().getId());
        PreLine preLine1 = preLine.setIsDel(Constants.DELETE_VALID).setStat(Constants.STATUS_VALID).setParentId(preLineVO.getPreLine().getId()).setCreateTime(LocalDateTime.now()).setId(null).setNextTime(LocalDateTime.now()).setIsNext(Constants.PRE_IS_IN_NEXT);
        save(preLine);//insertPreLine(preLine);

        //月份中间表
        if(preLineVO.getMonths()!=null && preLineVO.getMonths().size()>0) {
            preLineVO.getMonths().forEach(item -> preLineMonthService.save(new PreLineMonth().setPreId(preLine1.getId()).setDictId(item)));
        }
        //地域中间表
        if(preLineVO.getAreas()!=null && preLineVO.getAreas().size()>0) {
            preLineVO.getAreas().forEach(item -> preLineAreaService.save(new PreLineArea().setPreId(preLine1.getId()).setAreaId(item)));
        }
        //企业中间表
        if(preLineVO.getEnterPrises()!=null && preLineVO.getEnterPrises().size()>0) {
            preLineVO.getEnterPrises().forEach(item -> preLineEnterpriseService.save(new PreLineEnterprise().setPreId(preLine1.getId()).setEnterpriseId(item)));
        }
        return CommonResult.success(null,"下发成功");
    }

    /**
     * 预报名路线查询(这个是报名的时候查询内容)
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult getCourrentPreLines(Long id, Long userType, LocalDateTime nowTime) {
        List<PreLineVTO> preLines = new ArrayList<>();
        List<PreLineEnterprise> list = preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setEnterpriseId(id)));
        if (list != null && list.size()>0) {
            list.stream().forEach(x -> {
                PreLineVTO vtoById = findVtoById(x.getPreId(), userType,nowTime);
                if(vtoById != null) {
                    if (vtoById.getParentId() != null) {
                        preLines.add(vtoById);
                    }
                }
            });
        }
        List<PreLineVTO> collect = preLines.stream().sorted(Comparator.comparingLong(PreLineVTO::getCreateTimeSort).reversed()).collect(Collectors.toList());
        collect.forEach(x->{
//            0为报名即将，1为开始报名，2为查看报名，3为报名已结束，4为已报名并且报名结束
            if (x.getBeginTime().isAfter(LocalDateTime.now())){
                //报名即将开始   0
                x.setTtl(Constants.PRE_REGISTRATION_NOTBEGIN);
            }else if(preLineStatisticsService.findByPreId(x.getId(),null,id).size()>0 && x.getEndTime().isBefore(LocalDateTime.now())){
                x.setTtl(Constants.PRE_REGISTRATION_CAT_END);   //  已报名并且报名结束 4
            } else if(x.getEndTime().isBefore(LocalDateTime.now())){
                //报名已结束    3
                x.setTtl(Constants.PRE_REGISTRATION_END);
            }else {
                //报名中
                if(preLineStatisticsService.findByPreId(x.getId(),null,id).size()==0){
                    //开始报名   1
                    x.setTtl(Constants.PRE_REGISTRATION_START);
                }else {
                    // 查看报名  2
                    x.setTtl(Constants.PRE_REGISTRATION_CAT);
                }
            }
        });
        return CommonResult.success(collect,"查询成功");
    }

    /**
     * 通过id查找VTO对象
     * @param id
     * @return
     */
    @Override
    public PreLineVTO findVtoById(Long id,Long userType, LocalDateTime nowTime) {
        return preLineMapper.findVtoById(id,userType,nowTime);
    }

    /**
     * 报名记录修改，先删除再新增
     * @param preLineStatistics
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateRegistration(List<PreLineStatistics> preLineStatistics,Long enterpriseId) {
        Long pid = getById(preLineStatistics.get(0).getPreId()).getParentId();
        if(preLineStatistics != null && preLineStatistics.size()>0) {
            preLineStatisticsService.list(new QueryWrapper<>(new PreLineStatistics().setEnterpriseId(enterpriseId)
                    .setUserType(preLineStatistics.get(0).getUserType()).setPreId(preLineStatistics.get(0).getPreId())))
                    .forEach(x -> {
                                preLineStatisticsService.removeById(x.getId());
                            }
                    );
        }
        preLineStatistics.forEach(x->x.setEnterpriseId(enterpriseId).setPid(pid).setCreateTime(LocalDateTime.now()));
        preLineStatisticsService.saveBatch(preLineStatistics);
        return CommonResult.success(null,"修改成功");
    }

    /**
     * 这个业务是报名统计的条件查询
     * @param preRegistrationStatisticsVO
     * @param
     * @param
     * @return
     */
    @Override
    public List<PreRegistrationStatisticsDto> findPreRegistrationCountByConditions(PreRegistrationStatisticsVO preRegistrationStatisticsVO) {
        List<Long> ids = new ArrayList<>();
        if(preRegistrationStatisticsVO.getEnterpriseId()!=null){
            ids.add(preRegistrationStatisticsVO.getEnterpriseId());
            List<EnterPriseZnodeDto> enterPriseZnodeDtos = enterpriseService.findTwoEnterPrise(preRegistrationStatisticsVO.getEnterpriseId());
            enterPriseZnodeDtos.forEach(x->ids.add(x.getId()));
        }
        preRegistrationStatisticsVO.setIds(ids);
        List<PreRegistrationStatisticsDto> preRegistrationStatisticsDtos = preLineMapper.findPreRegistrationStatisticsCountInfo(preRegistrationStatisticsVO);
        preRegistrationStatisticsDtos.forEach(x->{
            //查出来的复制给了一级单位,当有一级单位的时候要把一级单位的值给二级单位，在查一级单位的值
                if(enterpriseService.getById(x.getEnterpriseId()) !=null &&
                        enterpriseService.getById(enterpriseService.getById(x.getEnterpriseId()).getPid()) !=null &&
                        enterpriseService.getById(enterpriseService.getById(x.getEnterpriseId()).getPid()).getId() !=1){
                    x.setBunit(x.getAunit());
                    x.setAunit(enterpriseService.getById(enterpriseService.getById(x.getEnterpriseId()).getPid()).getName());
                }
        });
        return preRegistrationStatisticsDtos;
    }

    /**
     * 预报名记录的查询
     * @param preRegistrationRecordVO
     * @return
     */
    @Override
    public List<PreRegistrationRecordDto> findPreRegistrationRecordDto(PreRegistrationRecordVO preRegistrationRecordVO,Long enterPriseId) {
        List<PreRegistrationRecordDto> preRegistrationRecordDtos = preLineMapper.findPreRecordByCondition(preRegistrationRecordVO);
        preRegistrationRecordDtos.forEach(x->
                {
                    if(preLineMapper.lookPreRecordByCondition(x.getPreId(),preRegistrationRecordVO.getUserType(),enterPriseId)!=null) {
                        x.setCreateTime(preLineMapper.lookPreRecordByCondition(x.getPreId(), preRegistrationRecordVO.getUserType(), enterPriseId).getCreateTime());
                        x.setPersonCount(preLineMapper.lookPreRecordByCondition(x.getPreId(), preRegistrationRecordVO.getUserType(), enterPriseId).getPersonCount());
                    }
                }
        );

        return preRegistrationRecordDtos;
    }

    /**
     *    根据路线id查找该路线对相应的报名详情  名字和id集合
     * @param preId
     * @return
     */
    @Override
    public CommonResult findPreDetail(Integer pageNum,Integer pageSize,Long preId,Long userType,Long enterPriseId) {
        PageHelper.startPage(pageNum,pageSize);
        return CommonResult.success(CommonPage.restPage(preLineMapper.findpreRegistrationStatisticsDtos(preId,userType,enterPriseId)));
    }

    /**
     *    根据路线id查找该路线对应的月份,地区，企业和相应的id   名字和id集合
     * @param preId
     * @return
     */
    @Override
    public AreaEnterpriseMonth findAreaEnterpriseMonth(Long preId,Long userType,Long enterPriseId) {
        return preLineMapper.findAreaEnterpriseMonth(preId).setPreRegistrationStatisticsDtos( preLineMapper.findpreRegistrationStatisticsDtos(preId,userType,enterPriseId));
    }

    /**
     *  到达线路下发详情
     * @param preId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult toLowerDetail(Long preId,Long shiroId) {
        //通过父Id查询出下发孩子路线的id
        Long id = preLineMapper.getLowerChildId(preId,shiroId);
        LowerToDetail lowerToDetail = new LowerToDetail();
        //查出孩子的信息
        PreLine preLine = getOne(new QueryWrapper<>(new PreLine().setId(id)));
        lowerToDetail.setPreLine(preLine);
        //地域
        List<AreasTreeDto> areasTreeDtos = new ArrayList<>();
        List<Long> ares = new ArrayList<>();
        preLineAreaService.list(new QueryWrapper<>(new PreLineArea().setPreId(preLine.getId()))).forEach(x -> {
            ares.add(x.getAreaId());
        });
        ares.forEach(x->{
            sysAreaService.getById(x);
            AreasTreeDto areasTreeDto = new AreasTreeDto();
            areasTreeDto.setId(x);
            areasTreeDto.setTitle(sysAreaService.getById(x).getRegionName());
            areasTreeDtos.add(areasTreeDto);
        });
        lowerToDetail.setAreasTreeDtos(areasTreeDtos);
        //月份
        List<PreMonthAndName> preMonthAndNames = new ArrayList<>();
        List<Long> months = new ArrayList<>();
        preLineMonthService.list(new QueryWrapper<>(new PreLineMonth().setPreId(preLine.getId()))).forEach(x -> {
            months.add(x.getDictId());
        });
        months.forEach(x->{
            PreMonthAndName preMonthAndName =new PreMonthAndName();
            preMonthAndName.setId(sysDictService.getById(x).getId());
            preMonthAndName.setName(sysDictService.getById(x).getValue());
            preMonthAndNames.add(preMonthAndName);
        });
        lowerToDetail.setPreMonthAndNames(preMonthAndNames);
        //企业
        List<EnterPriseTreeDto> enterPriseTreeDtos = new ArrayList<>();
        List<Long> enterpriseEnterprises = new ArrayList<>();
        preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(preLine.getId()))).forEach(x -> {
            enterpriseEnterprises.add(x.getEnterpriseId());
        });
        enterpriseEnterprises.forEach(x->{
            enterpriseService.getById(x);   //查出企业自己
            EnterPriseTreeDto enterPriseTreeDto = new EnterPriseTreeDto();
            enterPriseTreeDto.setId(x);
            enterPriseTreeDto.setTitle(enterpriseService.getById(x).getName());
            enterPriseTreeDtos.add(enterPriseTreeDto);
        });
        lowerToDetail.setEnterPriseTreeDtos(enterPriseTreeDtos);
        return CommonResult.success(lowerToDetail);
    }

    /**
     *  到达下发设置,查自己
     * @param preId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult toLowerInstall(Long preId,Long shiroId) {
        LowerToDetail lowerToDetail = new LowerToDetail();
        //查出孩子的信息
        PreLine preLine = getOne(new QueryWrapper<>(new PreLine().setId(preId)));
        lowerToDetail.setPreLine(preLine);
        //地域
        List<AreasTreeDto> areasTreeDtos = new ArrayList<>();
        List<Long> ares = new ArrayList<>();
        preLineAreaService.list(new QueryWrapper<>(new PreLineArea().setPreId(preId))).forEach(x -> {
            ares.add(x.getAreaId());
        });
        ares.forEach(x->{
            sysAreaService.getById(x);
            AreasTreeDto areasTreeDto = new AreasTreeDto();
            areasTreeDto.setId(x);
            areasTreeDto.setTitle(sysAreaService.getById(x).getRegionName());
            areasTreeDtos.add(areasTreeDto);
        });
        lowerToDetail.setAreasTreeDtos(areasTreeDtos);
        //月份
        List<PreMonthAndName> preMonthAndNames = new ArrayList<>();
        List<Long> months = new ArrayList<>();
        preLineMonthService.list(new QueryWrapper<>(new PreLineMonth().setPreId(preId))).forEach(x -> {
            months.add(x.getDictId());
        });
        months.forEach(x->{
            PreMonthAndName preMonthAndName =new PreMonthAndName();
            preMonthAndName.setId(sysDictService.getById(x).getId());
            preMonthAndName.setName(sysDictService.getById(x).getValue());
            preMonthAndNames.add(preMonthAndName);
        });
        lowerToDetail.setPreMonthAndNames(preMonthAndNames);
        //企业
        List<EnterPriseTreeDto> enterPriseTreeDtos = new ArrayList<>();
        List<Long> enterpriseEnterprises = new ArrayList<>();
        //查出路线关联的企业id
        List<PreLineEnterprise> preLineEnterprises = preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(preId)));
        preLineEnterprises.forEach(x -> {
            enterpriseEnterprises.add(x.getEnterpriseId());
        });
        //查出这些企业
        List<EnterpriseEnterprise> enterprises = new ArrayList<>();
        enterpriseEnterprises.forEach(x->enterprises.add(enterpriseService.getById(x)));

        //遍历这些企业，如果这些企业的pid等于shiroid就行
        List<EnterpriseEnterprise> newEnterprise = new ArrayList<>();
        newEnterprise.add(enterpriseService.getById(shiroId));
        enterprises.forEach(x->{
            if(x.getPid()==shiroId){
                newEnterprise.add(x);
            }
        });

        //封装
        newEnterprise.forEach(x->{
            EnterPriseTreeDto enterPriseTreeDto = new EnterPriseTreeDto();
            enterPriseTreeDto.setId(x.getId());
            enterPriseTreeDto.setTitle(x.getName());
            enterPriseTreeDtos.add(enterPriseTreeDto);
        });
        lowerToDetail.setEnterPriseTreeDtos(enterPriseTreeDtos);
        return CommonResult.success(lowerToDetail);
    }

    /**
     *  下发详情的修改(路线查自己,其他查父亲的)
     * @param preId
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult toUpdateLower(Long preId) {
        LowerToDetail lowerToDetail = new LowerToDetail();
        //查出孩子的信息
        PreLine preLine = getOne(new QueryWrapper<>(new PreLine().setParentId(preId)));
        lowerToDetail.setPreLine(preLine);
        //地域
        List<AreasTreeDto> areasTreeDtos = new ArrayList<>();
        List<Long> ares = new ArrayList<>();
        preLineAreaService.list(new QueryWrapper<>(new PreLineArea().setPreId(preId))).forEach(x -> {
            ares.add(x.getAreaId());
        });
        ares.forEach(x->{
            sysAreaService.getById(x);
            AreasTreeDto areasTreeDto = new AreasTreeDto();
            areasTreeDto.setId(x);
            areasTreeDto.setTitle(sysAreaService.getById(x).getRegionName());
            areasTreeDtos.add(areasTreeDto);
        });
        lowerToDetail.setAreasTreeDtos(areasTreeDtos);
        //月份
        List<PreMonthAndName> preMonthAndNames = new ArrayList<>();
        List<Long> months = new ArrayList<>();
        preLineMonthService.list(new QueryWrapper<>(new PreLineMonth().setPreId(preId))).forEach(x -> {
            months.add(x.getDictId());
        });
        months.forEach(x->{
            PreMonthAndName preMonthAndName =new PreMonthAndName();
            preMonthAndName.setId(sysDictService.getById(x).getId());
            preMonthAndName.setName(sysDictService.getById(x).getValue());
            preMonthAndNames.add(preMonthAndName);
        });
        lowerToDetail.setPreMonthAndNames(preMonthAndNames);
        //企业
        List<EnterPriseTreeDto> enterPriseTreeDtos = new ArrayList<>();
        List<Long> enterpriseEnterprises = new ArrayList<>();
        preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(preId))).forEach(x -> {
            enterpriseEnterprises.add(x.getEnterpriseId());
        });
        enterpriseEnterprises.forEach(x->{
            enterpriseService.getById(x);   //查出企业自己
            EnterPriseTreeDto enterPriseTreeDto = new EnterPriseTreeDto();
            enterPriseTreeDto.setId(x);
            enterPriseTreeDto.setTitle(enterpriseService.getById(x).getName());
            enterPriseTreeDtos.add(enterPriseTreeDto);
        });
        lowerToDetail.setEnterPriseTreeDtos(enterPriseTreeDtos);
        return CommonResult.success(lowerToDetail);
    }

    /**
     *  修改下发路线,先查出孩子,然后进行地区，企业等的修改
     * @param preLineVO
     * @return
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult doUpdateLower(PreLineVO preLineVO) {
        //先通过父亲查出孩子的id
        PreLine children = getOne(new QueryWrapper<>(new PreLine().setParentId(preLineVO.getPreLine().getId())));
        preLineVO.setPreLine(children);
        //更新路线
        saveOrUpdate(preLineVO.getPreLine().setStat(Constants.DELETE_VALID).setIsDel(Constants.DELETE_VALID));
        //更新地域,先删除,再新增
        preLineAreaService.list(new QueryWrapper<>(new PreLineArea().setPreId(preLineVO.getPreLine().getId()))).forEach(x -> {
            preLineAreaService.removeById(x.getId());
        });
        if(preLineVO.getAreas()!=null && preLineVO.getAreas().size()>0) {
            preLineVO.getAreas().forEach(x -> {
                preLineAreaService.save(new PreLineArea().setPreId(preLineVO.getPreLine().getId()).setAreaId(x));
            });
        }

        //月份
        preLineMonthService.list(new QueryWrapper<>(new PreLineMonth().setPreId(preLineVO.getPreLine().getId()))).forEach(x -> {
            preLineMonthService.removeById(x.getId());
        });
        if(preLineVO.getMonths()!=null && preLineVO.getMonths().size()>0) {
            preLineVO.getMonths().forEach(x -> {
                preLineMonthService.save(new PreLineMonth().setPreId(preLineVO.getPreLine().getId()).setDictId(x));
            });
        }
        //企业
        preLineEnterpriseService.list(new QueryWrapper<>(new PreLineEnterprise().setPreId(preLineVO.getPreLine().getId()))).forEach(x -> {
            preLineEnterpriseService.removeById(x.getId());
        });
        if(preLineVO.getEnterPrises()!=null && preLineVO.getEnterPrises().size()>0) {
            preLineVO.getEnterPrises().forEach(x -> {
                preLineEnterpriseService.save(new PreLineEnterprise().setPreId(preLineVO.getPreLine().getId()).setEnterpriseId(x));
            });
        }
        return CommonResult.success(preLineVO,"修改成功");
    }
}
