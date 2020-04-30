package com.brightease.bju.controller.enterprise;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.EnterpriseDto;
import com.brightease.bju.bean.dto.EnterpriseUserDto;
import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.enterprise.EnterpriseUser;
import com.brightease.bju.bean.enterprise.EnterpriseUserRole;
import com.brightease.bju.bean.sys.SysMz;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.enterprise.EnterpriseUserRoleService;
import com.brightease.bju.service.enterprise.EnterpriseUserService;
import com.brightease.bju.service.sys.SysMzService;
import com.brightease.bju.shiro.ShiroUtils;
import com.brightease.bju.util.ExcelUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * <p>
 * 企业职工表 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-04
 */
@Controller
@RequestMapping("/enterpriseUser")
@Api(value = "企业职工管理",tags = "企业职工管理")
public class EnterpriseUserController {

    @Autowired
    private EnterpriseUserService userService;
    @Autowired
    private SysMzService sysMzService;
    @Autowired
    private EnterpriseUserRoleService userRoleService;
    @Autowired
    private SysMzService mzService;
    @Resource
    private ResourceLoader resourceLoader;
    @Autowired
    private EnterpriseEnterpriseService enterpriseService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "获取职工列表", notes = "获取职工列表")
    public CommonResult getUserList(EnterpriseUser user, Long userType, @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                    @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return userService.getCurrentAndLowerUserList(user.setEId(ShiroUtils.getUserId()), userType, pageNum, pageSize);
    }

    @GetMapping("/getEnterPriseUserList")
    @ResponseBody
    @ApiOperation(value = "获取职工列表(改1219)", notes = "获取职工列表")
    public CommonResult getEnterPriseUserList(EnterpriseUser user, Long userType) {
        return userService.getEnterpriseUserList(user.setEId(ShiroUtils.getUserId()), userType);
    }


    @GetMapping("/user/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id获取用户信息", notes = "根据id获取用户信息")
    public CommonResult getUserById(@PathVariable(value = "id") Long id) {
        return CommonResult.success(userService.getUserById(id));
    }

    @DeleteMapping("/del/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id删除用户", notes = "根据id删除用户")
    public CommonResult delById(Long id) {
        return userService.delById(id);
    }

    @PostMapping("/delIds")
    @ResponseBody
    @ApiOperation(value = "根据id批量删除用户", notes = "根据id批量删除用户")
    public CommonResult delByIds(@RequestParam(value = "ids[]") List<Long> ids) {
        return userService.delByIds(ids);
    }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加企业职工", notes = "添加企业职工")
    public CommonResult add(EnterpriseUser user,@RequestParam(value = "eId",required = false)Long eId) {
        if(eId == null){
            eId = ShiroUtils.getUserId();
        }
        return  userService.addEnterpriseUser(user.setEId(eId));
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "编辑企业职工信息", notes = "编辑企业职工信息")
    public CommonResult update(EnterpriseUser user){
        return userService.updateEnterpriseUser(user);
    }

    @PostMapping("/upload")
    @ResponseBody
    @ApiOperation("批量导入企业职工信息")
    public CommonResult upload(MultipartFile file) {
        Long eId = ShiroUtils.getUserId();
        String phoneRegex = "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[013678])|(18[0,5-9]))\\d{8}$";
        String IDRegex = "^[1-9]\\d{5}[1-9]\\d{3}((0[1-9])|(1[0-2]))(([0|1|2][1-9])|3[0-1])((\\d{4})|\\d{3}X)$";
        Pattern phonePattern = Pattern.compile(phoneRegex);
        Pattern IDPattern = Pattern.compile(IDRegex);
        LocalDate now = LocalDate.now();
        List<SysMz> mzList = mzService.getList();
        Map<String, SysMz> mzMap = mzList.stream().collect(Collectors.toMap(SysMz::getName,a -> a,(k1,k2)->k1));
        if (file == null) {
            return CommonResult.failed("Excel不能为空！");
        }else{
            List<EnterpriseUserDto> enterpriseUserList = ExcelUtils.readExcel("", EnterpriseUserDto.class, file);
            List<EnterpriseUser> users = new ArrayList<>();
            if(enterpriseUserList.size()==0){
                return CommonResult.failed("批量导入用户数据为空！");
            }
            List<String> disList = enterpriseUserList.stream().map(EnterpriseUserDto::getIDCard).distinct().collect(Collectors.toList());
            if (disList.size() < enterpriseUserList.size()) {
                return CommonResult.failed("身份证号重复！");
            }
            for (int i = 0; i < enterpriseUserList.size(); i++) {
                EnterpriseUserDto temp = enterpriseUserList.get(i);
                EnterpriseUser user = new EnterpriseUser();
                String hobby = temp.getHobby();
                user.setHobby(hobby);
                String cardId = temp.getCardId();
                if (cardId == null || cardId == "") {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，卡号不能为空");
                }
                user.setCardId(cardId);
                String name = temp.getName();
                if (name == null || name == "") {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，姓名不能为空");
                }
                user.setName(name);
                String sex = temp.getSex();
                if (sex == null || sex == "") {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，性别不能为空");
                }
                if (sex.equals("女")) {
                    user.setSex(0);
                } else if (sex.equals("男")) {
                    user.setSex(1);
                }else {
                    user.setSex(2);
                }
                String nationId = temp.getNation();
                if (nationId == null || nationId == "") {
                    return CommonResult.failed("第" + (i + 1) + "行错误，民族不能位空");
                }
                user.setNationId(mzMap.get(nationId).getId());
                LocalDate birthday = temp.getBirthday();
                if (birthday == null) {
                    return CommonResult.failed("第" + (i + 1) + "行错误，出生日期不能位空");
                } else if (birthday.isAfter(now)) {
                    return CommonResult.failed("第" + (i + 1) + "行错误，出生日期不能小于当前时间");
                }
                user.setBirthday(birthday);
                String health = temp.getHealth();
                if (health == null || health == "") {
                    return CommonResult.failed("第" + (i + 1) + "行错误，健康状况不能位空");
                }
                if (health.equals("健康")){
                    user.setHealth(0);
                } else if (health.equals("一般")) {
                    user.setHealth(1);
                }else {
                    user.setHealth(2);
                }
                String disease = temp.getDisease();
                if (health == "有疾病" && (disease == ""|| disease == null)) {
                    return CommonResult.failed("第" + (i + 1) + "行错误，健康状况位有疾病，必须填写疾病");
                }
                user.setDisease(disease);
                String IDCard = temp.getIDCard();
                if (IDCard == null || IDCard == "") {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，身份证号不能位空");
                } else if (!IDPattern.matcher(IDCard).matches()) {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，身份证号格式错误");
                }
                user.setIDCard(IDCard);
                String phone = temp.getPhone();
                if (phone == null || phone == "") {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，手机号不能位空");
                } else if (!phonePattern.matcher(phone).matches()) {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，手机号格式错误");
                }
                user.setPhone(phone);
                String userType = temp.getUserType();
                if (userType == null || userType == "") {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，职工类型不能位空");
                }
                if (userType.equals("普通员工")){
                    user.setUserType(1l);
                }else if (userType.equals("优秀员工")){
                    user.setUserType(2l);
                }else {
                    user.setUserType(3l);
                }
                String enterpriseName = temp.getEnterpriseName();
                if (StringUtils.isBlank(enterpriseName)) {
                    return  CommonResult.failed("第" + (i + 1) + "行错误，所属企业不能为空");
                }
                EnterpriseEnterprise enterprise = enterpriseService.getOne(new QueryWrapper<>(new EnterpriseEnterprise().setName(enterpriseName).setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES)));
                if (enterprise == null) {
                    return CommonResult.failed("第" + (i + 1) + "行错误，所属企业不可用，请更新模板");
                }
                user.setEId(enterprise.getId());

                if(userType.equals("劳模员工")){
                    String job = temp.getJob();
                    if (job == null || job == "") {
                        return  CommonResult.failed("第" + (i + 1) + "行错误，劳模员工必须填写职务");
                    }
                    user.setJob(job);
                    String houner = temp.getHonour();
                    if (houner == null || houner == "") {
                        return  CommonResult.failed("第" + (i + 1) + "行错误，劳模员工必须填写所获得荣誉");
                    }
                    user.setHonour(houner);
                    LocalDate honourTime = temp.getHonourTime();
                    if (honourTime == null ) {
                        return  CommonResult.failed("第" + (i + 1) + "行错误，劳模员工必须填写所获得荣誉时间");
                    }
                    user.setHonourTime(honourTime);
                }

                EnterpriseUser id = userService.getOne(new QueryWrapper<>(new EnterpriseUser().setIDCard(IDCard).setIsDel(Constants.DELETE_VALID).setIsDel(Constants.DELETE_VALID)));
                if (id != null) {
                    return CommonResult.failed("第" + (i + 1) + "行错误，身份证号已经存在");
                }
                users.add(user);
            }
            users.stream().forEach(i->i.setCreateTime(LocalDateTime.now()).setStatus(Constants.STATUS_VALID).setIsDel(Constants.DELETE_VALID));
            userService.saveBatch(users);
            List<EnterpriseUserRole> userRoles = new ArrayList<>();
            users.stream().forEach(i->{
                userRoles.add(new EnterpriseUserRole().setRoleId(i.getUserType()).setUserId(i.getId()));
            });
            userRoleService.saveBatch(userRoles);
            return CommonResult.success("添加成功！共导入" + enterpriseUserList.size() + "条数据");
        }
    }

    @GetMapping("/downLoadUsersExcel")
    @ApiOperation("导出企业职工列表")
    public void downLoadUsersExcel(EnterpriseUser user, Long userType, HttpServletResponse response) {
        List<EnterpriseUser> users = userService.getListForDownLoad(user.setEId(ShiroUtils.getUserId()),userType);
        ExcelUtils.createExcel(response,users,EnterpriseUser.class,"企业职工.xls");
    }

    @GetMapping("/downloadTemplate")
    @ApiOperation("下载导入模板")
    public void downloadTemplate(HttpServletResponse response, HttpServletRequest request) {
        //部门
        List<String> enterprises = enterpriseService.getListNoPage(new EnterpriseEnterprise().setStatus(Constants.STATUS_VALID)
                .setIsDel(Constants.DELETE_VALID).setExamineStatus(Constants.EXAMINE_RESULT_YES).setPid(ShiroUtils.getUserId()))
                .stream().map(EnterpriseDto::getName).collect(Collectors.toList());
        enterprises.add(0,ShiroUtils.getSysUser().getName());
        List<String> mzList = mzService.getList().stream().map(SysMz::getName).collect(Collectors.toList());
        List<String> sexList = Arrays.asList(new String[]{"男", "女"});
        List<String> typeList = Arrays.asList(new String[]{"普通员工", "优秀员工", "劳模员工"});
        List<String> healthList = Arrays.asList(new String[]{"健康", "一般", "有疾病"});

        ExcelUtils.createImportUser(response, enterprises, mzList,sexList,typeList,healthList, "职工信息导入模板.xlsx");
    }




    @GetMapping(value = {"/singleAdd"})
    public String singleAdd(Model model,Long id) {
        model.addAttribute("nation",sysMzService.getList());
        model.addAttribute("id",id);
        return "personal/singleAdd";
    }

    public static void main(String[] args) {
        String[] sexs = {"男","女"};
        List<String> sex = Arrays.asList(sexs);
       sex.stream().forEach(i-> System.out.println(i));
    }
}


