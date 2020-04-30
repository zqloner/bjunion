package com.brightease.bju.bean.dto;


import com.brightease.bju.bean.pre.PreLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * f返回地域数型和企业树形数据dto
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class AreasEnterPriseTree {
    /**
     * 地域树型数据
     */
    private List<AreasTreeDto> areas;

    /**
     * 企业树形数据
     */
    private List<EnterPriseTreeDto> enterPrises;

    /**
     * 查询所有的路线，用于统计的条件查询
     */
    private List<PreLine> preLines;

}
