package com.brightease.bju.service.sys;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.sys.SysAdmin;
import com.brightease.bju.bean.sys.SysNews;
import com.baomidou.mybatisplus.extension.service.IService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 新闻 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface SysNewsService extends IService<SysNews> {

    List<SysNews> getNewsList(Integer type, String title, String startTime,String endTime);


    CommonResult addNews(SysNews sysNews,Long userId);

    public CommonResult toUpdateNews(Long id);

    CommonResult updateNews(SysNews sysNews);

    CommonResult delete(Long id);

    public CommonResult toTop(Long id);

    public CommonResult cancelTop(Long id);
}

