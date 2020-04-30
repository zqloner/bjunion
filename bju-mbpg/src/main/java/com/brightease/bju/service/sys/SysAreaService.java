package com.brightease.bju.service.sys;

import com.brightease.bju.bean.dto.AreasTreeDto;
import com.brightease.bju.bean.dto.EnterPriseTreeDto;
import com.brightease.bju.bean.sys.SysArea;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 地区信息表 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface SysAreaService extends IService<SysArea> {

    /**
     * 查找地区树形数据
     * @return
     */
    List<AreasTreeDto> findAreasTree();


}
