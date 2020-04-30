package com.brightease.bju.controller.sys;


import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.bean.sys.SysNews;
import com.brightease.bju.service.sys.SysNewsService;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
public class SysNewsController {

    @Autowired
    private SysNewsService newsService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation("获取新闻公告列表")
    public CommonResult getList(
            @RequestParam(value = "type",required = false) Integer type,
            @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        PageHelper.startPage(pageNum,pageSize);
        return CommonResult.success(CommonPage.restPage(newsService.getNewsList(type,null,null,null)),"查询成功");
    }

    @GetMapping("/getById")
    @ResponseBody
    @ApiOperation("通过id获取新闻详情")
    public CommonResult getById(
            @RequestParam(value = "newsId",required = false) Long newsId
    ) {
        return CommonResult.success(newsService.getById(new SysNews().setId(newsId)));
    }
}


