package com.brightease.bju.bean.dto.predto;

import com.brightease.bju.bean.dto.AreasTreeDto;
import com.brightease.bju.bean.dto.EnterPriseTreeDto;
import com.brightease.bju.bean.pre.PreLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 张奇   线路下发详情和修改封装的dto
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class LowerToDetail {
    //线路名字
    private PreLine preLine;
    //地区
    private List<AreasTreeDto> areasTreeDtos;
    //企业
    private List<EnterPriseTreeDto> enterPriseTreeDtos;
    //月份
    private List<PreMonthAndName> preMonthAndNames;
}
