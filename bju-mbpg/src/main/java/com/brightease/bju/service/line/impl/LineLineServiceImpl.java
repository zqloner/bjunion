package com.brightease.bju.service.line.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.LineLineDto;
import com.brightease.bju.bean.line.LineLine;
import com.brightease.bju.bean.line.LineSanatorium;
import com.brightease.bju.dao.line.LineLineMapper;
import com.brightease.bju.service.line.LineLineService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.brightease.bju.service.line.LineSanatoriumService;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 路线 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class LineLineServiceImpl extends ServiceImpl<LineLineMapper, LineLine> implements LineLineService {
    @Autowired
    private LineSanatoriumService lineSanatoriumService;
    @Autowired
    private LineLineMapper lineMapper;

    @Override
    public CommonResult getList(LineLineDto line, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(lineMapper.getList(line)));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addLine(LineLine line,List<Long> ids) {
        save(line.setCreateTime(LocalDateTime.now()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.STATUS_VALID));

        List<LineSanatorium> sanatoriums = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) {
            sanatoriums.add(new LineSanatorium().setLineId(line.getId()).setSanatoriumId(ids.get(i)));
        }
        lineSanatoriumService.saveBatch(sanatoriums);
        return CommonResult.success(line);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateLine(LineLine line, List<Long> ids) {
        updateById(line);
        if(ids!= null &&  ids.size()>0){
            lineSanatoriumService.remove(new QueryWrapper<LineSanatorium>().eq("line_id", line.getId()));
            List<LineSanatorium> sanatoriums = new ArrayList<>();
            for (int i = 0; i < ids.size(); i++) {
                sanatoriums.add(new LineSanatorium().setLineId(line.getId()).setSanatoriumId(ids.get(i)));
            }
            lineSanatoriumService.saveBatch(sanatoriums);
        }
        return CommonResult.success(line);
    }

    @Override
    public LineLine getByLineId(Long id) {
        LineLine dtos = lineMapper.getByLineId(id);
        return dtos;
    }

    @Override
    public List<LineLine> myIndex() {
        return lineMapper.myIndex();
    }

    @Override
    public List<LineLine> getListNoPage() {
        return lineMapper.getListNoPage();
    }

    @Override
    public List<LineLine> getLineIdAndName() {
        return lineMapper.getLineIdAndName();
    }
}
