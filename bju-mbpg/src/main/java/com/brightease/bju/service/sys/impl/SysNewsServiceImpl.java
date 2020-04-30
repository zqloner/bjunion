package com.brightease.bju.service.sys.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.sys.SysAdmin;
import com.brightease.bju.bean.sys.SysNews;
import com.brightease.bju.dao.sys.SysNewsMapper;
import com.brightease.bju.service.sys.SysNewsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.brightease.bju.api.Constants.*;

/**
 * <p>
 * 新闻 服务实现类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Service
public class SysNewsServiceImpl extends ServiceImpl<SysNewsMapper, SysNews> implements SysNewsService {

    @Autowired
    private SysNewsMapper sysNewsMapper;

    @Override
    public  List<SysNews> getNewsList(Integer type, String title, String startTime, String endTime) {
        return sysNewsMapper.getNewsList(type,title,startTime,endTime);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult addNews(SysNews sysNews,Long userId) {
        save(sysNews.setIsDel(Constants.DELETE_VALID).setSort(Constants.NEWS_START_VALUE).setStatus(Constants.STATUS_VALID).setCreateTime(LocalDateTime.now()).setCreatorId(userId));
        return CommonResult.success(sysNews);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult toUpdateNews(Long id) {
        return CommonResult.success(getById(id));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult updateNews(SysNews sysNews) {

        boolean b = updateById(sysNews.setCreateTime(LocalDateTime.now()));
        if(b){
            return CommonResult.success(null,"修改成功");
        }
        return CommonResult.failed("修改失败");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult delete(Long id) {
        updateNews(getById(id).setIsDel(0));
        return CommonResult.success(null,"删除成功");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult toTop(Long id) {
        saveOrUpdate(getById(id).setSort(sysNewsMapper.getMaxSort()+1));
        return CommonResult.success(null,"置顶成功");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CommonResult cancelTop(Long id) {
        updateById(getById(id).setSort(Constants.NEWS_START_VALUE));
        return CommonResult.success(null,"取消置顶成功");
    }

}
