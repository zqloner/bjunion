package com.brightease.bju.service.sys.impl;

import com.brightease.bju.bean.dto.AreasTreeDto;
import com.brightease.bju.bean.dto.EnterPriseTreeDto;
import com.brightease.bju.bean.sys.SysArea;
import com.brightease.bju.dao.sys.SysAreaMapper;
import com.brightease.bju.service.sys.SysAreaService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * <p>
 * 地区信息表 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class SysAreaServiceImpl extends ServiceImpl<SysAreaMapper, SysArea> implements SysAreaService {

    @Resource
    private SysAreaMapper sysAreaMapper;
    /**
     * 地区查询树型
     * @return
     */
    @Override
    public List<AreasTreeDto> findAreasTree() {
        return sysAreaMapper.findAreasTree();
    }


}
