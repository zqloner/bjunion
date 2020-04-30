package com.brightease.bju.controller.sys;


import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.sys.SysNews;
import com.brightease.bju.service.sys.SysNewsService;
import com.brightease.bju.shiro.ShiroUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * <p>
 * 新闻 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/sysNews")
@Api(value = "新闻管理",tags = "新闻")
public class SysNewsController {

    @Autowired
    private SysNewsService newsService;

    @GetMapping("/getNews")
    @ResponseBody
    @ApiOperation(value = "查询新闻动态",notes = "查询新闻动态")
    public CommonResult getNewsList(@RequestParam(value = "type",required = false) Integer type,
                                  @RequestParam(value = "title",required = false) String title,
                                  @RequestParam(value = "startTime",required = false) String startTime,
                                  @RequestParam(value = "endTime",required = false) String endTime,
                                  @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        return CommonResult.success(CommonPage.restPage(newsService.getNewsList(type,title,startTime,endTime)));
    }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加新闻", notes = "添加新闻")
    public CommonResult add(SysNews sysNews){
        return newsService.addNews(sysNews,ShiroUtils.getSysUser().getId());
    }

    @GetMapping("/toUpdate")
    @ResponseBody
    @ApiOperation(value = "编辑新闻", notes = "编辑新闻")
    public CommonResult toUpdate(@RequestParam("id")Long id){
        return newsService.toUpdateNews(id);
    }


    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "编辑新闻", notes = "编辑新闻")
    public CommonResult update(SysNews sysNews){
        return newsService.updateNews(sysNews);
    }

    @GetMapping("/delete")
    @ResponseBody
    @ApiOperation(value = "编辑新闻", notes = "编辑新闻")
    public CommonResult delete(@RequestParam("id")Long id){
        return newsService.delete(id);
    }

    @GetMapping("/toTop")
    @ResponseBody
    @ApiOperation(value = "置顶", notes = "置顶")
    public CommonResult toTop(@RequestParam("id")Long id){
        return newsService.toTop(id);
    }

    @GetMapping("/cancelTop")
    @ResponseBody
    @ApiOperation(value = "取消置顶", notes = "取消置顶")
    public CommonResult cancelTop(@RequestParam("id")Long id){
        return newsService.cancelTop(id);
    }

}
