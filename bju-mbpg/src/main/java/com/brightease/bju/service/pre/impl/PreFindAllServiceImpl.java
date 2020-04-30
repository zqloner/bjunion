package com.brightease.bju.service.pre.impl;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.AreasEnterPriseTree;
import com.brightease.bju.bean.dto.AreasTreeDto;
import com.brightease.bju.bean.dto.MothAreaEnterpriseDto;
import com.brightease.bju.bean.dto.predto.AreaEnterpriseZnodes;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.pre.PreLine;
import com.brightease.bju.bean.sys.SysArea;
import com.brightease.bju.bean.sys.SysDict;
import com.brightease.bju.dao.enterprise.EnterpriseEnterpriseMapper;
import com.brightease.bju.dao.enterprise.EnterpriseExamineMapper;
import com.brightease.bju.dao.sys.SysAreaMapper;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.pre.PreFindAllService;
import com.brightease.bju.service.pre.PreLineService;
import com.brightease.bju.service.sys.SysAreaService;
import com.brightease.bju.service.sys.SysDictService;
import com.brightease.bju.utils.ResultUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class PreFindAllServiceImpl implements PreFindAllService {

    @Resource
    private EnterpriseEnterpriseService enterpriseEnterpriseService;
    @Resource
    private PreLineService preLineService;
    @Resource
    private SysAreaService sysAreaService;
    @Resource
    private SysAreaMapper sysAreaMapper;
    @Resource
    private EnterpriseEnterpriseMapper enterpriseEnterpriseMapper;

    /**
     * 查询出所有的月份，地域，和企业，方便页面用id渲染名字
     * 更新:   查询出所有的路线，方便预报名统计的查询
     * @return
     */
    @Override
    public CommonResult preFindAll() {
        AreasEnterPriseTree areasEnterPriseTree = new AreasEnterPriseTree();
        //所有的地方
        List<AreasTreeDto>  areasTreeDtoList = new ArrayList<>();
        List<AreasTreeDto> areas = sysAreaService.findAreasTree();
        AreasTreeDto  areasTreeDto = new AreasTreeDto();
        areasTreeDto.setTitle("全部省市");
        areasTreeDto.setId(-1l);
        areasTreeDto.setChildren(areas);
        areasTreeDtoList.add(areasTreeDto);
        areasEnterPriseTree.setAreas(sysAreaService.findAreasTree());
        //所有的路线
        areasEnterPriseTree.setPreLines(preLineService.list(null));
        //所有的企业
        areasEnterPriseTree.setEnterPrises(enterpriseEnterpriseService.findEnterPriseTree());
        return CommonResult.success(areasEnterPriseTree,"查询成功");
    }

    @Override
    public CommonResult preFindAllZonede() {
        AreaEnterpriseZnodes areaEnterpriseZnodes = new AreaEnterpriseZnodes();
        areaEnterpriseZnodes.setAreaZnodesDtos(sysAreaMapper.findAreaZnodes());
        areaEnterpriseZnodes.setEnterPriseZnodeDtos(enterpriseEnterpriseMapper.findEnterPriseZnode());
        return CommonResult.success(areaEnterpriseZnodes);
    }
}
