package com.brightease.bju.controller.leader;


import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.api.ResultCode;
import com.brightease.bju.bean.leader.LeaderLeader;
import com.brightease.bju.service.leader.LeaderLeaderService;
import com.brightease.bju.shiro.ShiroUtils;
import com.brightease.bju.util.ExcelUtils;
import com.brightease.bju.util.ValidateIDNumber;
import com.brightease.bju.utils.ResultUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.util.IOUtils;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 领队 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Controller
@RequestMapping("/leaderLeader")
@Api(value = "领队管理", tags = "领队管理")
public class LeaderLeaderController {

    @Autowired
    LeaderLeaderService leaderLeaderServiceImpl;

    @Resource
    private ResourceLoader resourceLoader;

    @GetMapping("/tomain")
    public String tomain(ModelMap mdap){
        System.out.println("主页面........");
        LeaderLeader leaderLeader = ShiroUtils.getLeader();
        String name = leaderLeader.getName();
        mdap.put("name",name);
        return "/leader/main";
    }
    @GetMapping("/topersonalData")
    public String topersonalData(){
        System.out.println("个人页面........");
        return "/leader/personalData";
    }

    @GetMapping("/tochangePwd")
    public String tochangePwd(){
        System.out.println("个人密码修改页面........");
        return "/leader/changePwd";
    }
    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "查询领队列表", notes = "查询领队列表")
    public CommonResult getList(LeaderLeader leaderLeader, @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return leaderLeaderServiceImpl.getlist(leaderLeader, pageNum, pageSize);

    }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加一个领队", notes = "添加领队")
    public CommonResult add(LeaderLeader leaderLeader) {
        LeaderLeader leader = leaderLeaderServiceImpl.fingUserByUserLoginName(leaderLeader.getUsername());
        if (leader != null) {
            return CommonResult.failed("账号已经存在");
        }
        if (leaderLeader.getIDCard() != null && !ValidateIDNumber.isIDNumber(leaderLeader.getIDCard())) {
            return CommonResult.failed("身份证号错误");
        }
        boolean b = leaderLeaderServiceImpl.save(leaderLeader.setCreateTime(LocalDateTime.now()).setIsDel(Constants.DELETE_VALID).setStatus(Constants.DELETE_VALID).setPassword(new Md5Hash("111111").toHex().toString()));
        return b ? CommonResult.success(leaderLeader) : CommonResult.failed("添加失败");
    }

    @GetMapping("/getByUsername")
    @ResponseBody
    @ApiOperation(value = "查找账号是否已经被占用", notes = "查找账号是否已经被占用")
    public CommonResult getByAccount(String username) {
        if (username == null) {
            return CommonResult.failed("账号不能为空");
        }
        LeaderLeader leader = leaderLeaderServiceImpl.fingUserByUserLoginName(username);
        if (leader != null) {
            return CommonResult.failed("账号已经存在");
        }
        return CommonResult.success("当前账号可以使用");
    }

    /* *
     查询领队信息
    */
    @GetMapping("/getLeaderInfo")
    @ResponseBody
    @ApiOperation(value = "根据id获取领队信息", notes = "根据id获取领队信息")
    public CommonResult getLeaderInfo(Long id) {
        id = id == null ? ShiroUtils.getLeader().getId() : id;
        //id = 1l;
        LeaderLeader leaderLeader = leaderLeaderServiceImpl.getById(id);
        return CommonResult.success(leaderLeader);
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "编辑领队信息", notes = "编辑领队信息")
    public CommonResult update(LeaderLeader leaderLeader) {
        LeaderLeader leader = leaderLeaderServiceImpl.fingUserByUserLoginName(leaderLeader.getUsername());
        if (leader != null && leader.getId() != leaderLeader.getId()) {
            return CommonResult.failed("用户名已经存在");
        }
        if (leaderLeader.getIDCard() != null && !ValidateIDNumber.isIDNumber(leaderLeader.getIDCard())) {
            return CommonResult.failed("身份证号错误");
        }
        boolean b = leaderLeaderServiceImpl.updateById(leaderLeader);
        return b ? CommonResult.success("操作成功") : CommonResult.failed("操作失败");
    }

    @DeleteMapping("/del/{id}")
    @ResponseBody
    @ApiOperation(value = "删除领队", notes = "删除领队")
    public CommonResult delById(@PathVariable("id") Long id) {
        return leaderLeaderServiceImpl.updateById(new LeaderLeader().setId(id).setIsDel(Constants.DELETE_INVALID)) ? CommonResult.success("删除成功") : CommonResult.failed("删除失败");
    }

    @GetMapping("/downloadTemplate")
    @ApiOperation("下载导入模板")
    public void downloadTemplate(HttpServletResponse response, HttpServletRequest request) {
        InputStream inputStream = null;
        ServletOutputStream servletOutputStream = null;
        try {
            String filename = "领队信息导入模板.xls";
            String path = "xls/leaderupload.xls";
            org.springframework.core.io.Resource resource = resourceLoader.getResource("classpath:" + path);

            response.setContentType("application/vnd.ms-excel");
            response.addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.addHeader("charset", "utf-8");
            response.addHeader("Pragma", "no-cache");
            String encodeName = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString());
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodeName + "\"; filename*=utf-8''" + encodeName);

            inputStream = resource.getInputStream();
            servletOutputStream = response.getOutputStream();
            IOUtils.copy(inputStream, servletOutputStream);
            response.flushBuffer();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (servletOutputStream != null) {
                    servletOutputStream.close();
                    servletOutputStream = null;
                }
                if (inputStream != null) {
                    inputStream.close();
                    inputStream = null;
                }
                // 召唤jvm的垃圾回收器
                System.gc();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    @PostMapping("/upload")
    @ResponseBody
    @ApiOperation("导入领队信息")
    public CommonResult upload(MultipartFile file) {
        if (file == null) return CommonResult.failed("Excel不能为空！");
        List<LeaderLeader> leaders = ExcelUtils.readExcel("", LeaderLeader.class, file,0);
        leaders.stream().forEach(i->{
            if (i.getSexstr().equals("男")) {
                i.setSex(1);
            } else {
                if (i.getSexstr().equals("女")) {
                    i.setSex(0);
                } else {
                    i.setSex(2);
                }
            }
        });
        List<String> disList = leaders.stream().map(LeaderLeader::getUsername).distinct().collect(Collectors.toList());
        if (disList.size() < leaders.size()) {
            return CommonResult.failed("手机号重复！");
        }
//        List<String> disIDList = leaders.stream().map(LeaderLeader::getIDCard).distinct().collect(Collectors.toList());
//        if (disIDList.size() < leaders.size()) {
//            return CommonResult.failed("身份证号重复！");
//        }
        for (int i = 0; i < leaders.size(); i++) {
            String username = leaders.get(i).getUsername();
            LeaderLeader leader = leaderLeaderServiceImpl.fingUserByUserLoginName(username);
            if (leader != null) {
                return CommonResult.failed("第" + (i + 1) + "行错误，账号手机号已经存在");
            }
            if (!ValidateIDNumber.isIDNumber(leaders.get(i).getIDCard())) {
                return CommonResult.failed("第" + (i + 1) + "行错误，身份号长度错误");
            }
        }
        leaders.forEach(i->i.setPassword(new Md5Hash("111111").toHex().toString()).setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID).setCreateTime(LocalDateTime.now()));
        return leaderLeaderServiceImpl.saveBatch(leaders) ? CommonResult.success("添加成功！共导入" + leaders.size() + "条数据") : CommonResult.failed("导入失败");
    }


    @PostMapping("/ckoldpwd")
    @ResponseBody
    @ApiOperation(value = "确认并修改密码", notes = "确认并修改密码")
    public CommonResult ckoldpwd(String oldPwd,String newPwd) {
        Long id = ShiroUtils.getLeader().getId();
        boolean b = leaderLeaderServiceImpl.ckoldpwd(id,oldPwd,newPwd);
        return b ? CommonResult.success("原始密码正确") : CommonResult.failed("原始密码错误！");
    }
}
