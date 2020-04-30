package com.brightease.bju.service.line;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.LineLineDto;
import com.brightease.bju.bean.line.LineLine;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 路线 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface LineLineService extends IService<LineLine> {
    CommonResult getList(LineLineDto line,int pageNum,int pageSize);

    CommonResult addLine(LineLine line,List<Long> ids);

    CommonResult updateLine(LineLine line, List<Long> ids);

    LineLine getByLineId(Long id);

    List<LineLine> myIndex();

    List<LineLine> getListNoPage();

    List<LineLine> getLineIdAndName();
}
