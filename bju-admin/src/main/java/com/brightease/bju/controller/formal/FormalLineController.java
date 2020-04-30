package com.brightease.bju.controller.formal;


import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineUser;
import com.brightease.bju.service.formal.FormalLineService;
import com.brightease.bju.service.formal.FormalLineUserService;
import com.brightease.bju.service.leader.LeaderLeaderService;
import com.brightease.bju.shiro.ShiroUtils;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 正式报名线路 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/formalLine")
@Api(value = "正式线路", tags = "正式线路")
public class FormalLineController {

    @Autowired
    private LeaderLeaderService leaderLeaderServiceImpl;

    @Autowired
    private FormalLineService formalLineServiceImpl;
    @Autowired
    private FormalLineUserService formalLineUserServiceImpl;
    @Autowired
    private FormalLineUserService formalLineUserService;

    @GetMapping("/tovestHome")
    public String toDepEmotion(String pagedata, ModelMap mdap) {
        if (null == pagedata || !"".equals(pagedata)) {
            pagedata = "1";
        }
        mdap.put("pagedata", pagedata);
        return "/leader/vestHome";
    }

    @GetMapping("/toDetailPage")
    public String toDetailPage(String pagedata, String tuanstatus, String formalid, ModelMap mdap) {
        if (null == pagedata || !"".equals(pagedata)) {
            pagedata = "1";
        }
        mdap.put("formalid", formalid);
        mdap.put("pagedata", pagedata);
        if ("1".equals(tuanstatus) || "2".equals(tuanstatus) || "3".equals(tuanstatus) || "5".equals(tuanstatus)) {
            return "/leader/waitDetail";
        } else {
            return "/leader/pastDetail";
        }
    }

    /**
     * 查询当前领队所带团列表
     */
    @GetMapping("/getFormalLineList")
    @ResponseBody
    @ApiOperation(value = "领队我的疗养团列表", notes = "领队我的疗养团列表")
    public CommonResult getFormalLineList(String usertype, String linename, String linestatus, String starttime, String endtime, Integer pageNumber, Integer pageSize) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            Long leaderid = ShiroUtils.getLeader().getId();

            Long utype = 1l;
            if (null != usertype && !"".equals(usertype)) {
                utype = Long.valueOf(usertype);
            }

            Map<String, Object> param = new HashMap<String, Object>();
            param.put("usertype", utype);
            param.put("leaderid", leaderid);
            if (pageNumber == null || pageNumber <= 0) {
                pageNumber = 1;
            }
            if (pageSize == null || pageSize <= 0) {
                pageSize = 10;
            }

            param.put("startNumber", pageNumber);
            param.put("pageSize", pageSize);

            if (null != linename && !"".equals(linename)) {
                param.put("linename", linename);
            }
            if (null != linestatus && !"".equals(linestatus)) {
                param.put("linestatus", Integer.valueOf(linestatus));
            }
            if (null != starttime && !"".equals(starttime)) {
                param.put("starttime", format.parse(starttime));
            }
            if (null != endtime && !"".equals(endtime)) {
                param.put("endtime", format.parse(endtime));
            }
            CommonResult result = formalLineServiceImpl.getFormalLineList(param, pageNumber, pageSize);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }

    /**
     * 查询疗养团详情
     */
    @GetMapping("/getFormalSanatoriumInfo")
    @ResponseBody
    @ApiOperation(value = "领队查询疗养团详情", notes = "领队查询疗养团详情")
    public CommonResult getFormalSanatoriumInfo(String formalid) {
        try {

            Map<String, Object> param = new HashMap<String, Object>();
            param.put("formalid", Long.valueOf(formalid));
            CommonResult result = formalLineServiceImpl.getFormalSanatoriumInfo(param);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }

    /**
     * 查询疗养团人员列表
     */
    @GetMapping("/getFormalLineUserList")
    @ResponseBody
    @ApiOperation(value = "查询疗养团人员列表", notes = "待出团，已出团")
    public CommonResult getFormalLineUserList(String formalid, String eid, String uname, String cardid, String phone, String IDCard, String ifout, Integer pageNumber, Integer pageSize) {
        try {

            Map<String, Object> param = new HashMap<String, Object>();

            if (pageNumber == null || pageNumber <= 0) {
                pageNumber = 1;
            }
            if (pageSize == null || pageSize <= 0) {
                pageSize = 10;
            }

            if (null != formalid && !"".equals(formalid)) {
                param.put("formalid", Long.valueOf(formalid));
            }
            if (null != uname && !"".equals(uname)) {
                param.put("uname", uname);
            }
            if (null != eid && !"".equals(eid)) {
                param.put("eid", Long.valueOf(eid));
            }
            if (null != cardid && !"".equals(cardid)) {
                param.put("cardid", cardid);
            }
            if (null != phone && !"".equals(phone)) {
                param.put("phone", phone);
            }
            if (null != IDCard && !"".equals(IDCard)) {
                param.put("IDCard", IDCard);
            }
            if (null != ifout && !"".equals(ifout)) {
                param.put("ifout", Integer.valueOf(ifout));
            }
            CommonResult result = formalLineServiceImpl.getFormalLineUserList(param, pageNumber, pageSize);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }

    /**
     * 查询疗养团涉及单位列表
     */
    @GetMapping("/getFormalLineCompanyList")
    @ResponseBody
    @ApiOperation(value = "领队疗养团涉及单位列表", notes = "下拉框")
    public CommonResult getFormalLineCompanyList(String formalid, String eid) {
        try {

            Map<String, Object> param = new HashMap<String, Object>();
            if (null != formalid && !"".equals(formalid)) {
                param.put("formalid", Long.valueOf(formalid));
            }
            if (null != eid && !"".equals(eid)) {
                param.put("eid", Long.valueOf(eid));
            }
            CommonResult result = formalLineServiceImpl.getFormalLineCompanyList(param);
            return result;
        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("查询失败！");
        }
    }

    /**
     * 修改疗养人是否出团
     */
    @PostMapping("/changeUserOut")
    @ResponseBody
    public CommonResult changeUserOut(String id, String ifout) {
        try {
            if (Long.valueOf(ifout) == 1) {
                //核对用户是否是今年第一次报名
                List<Long> recordUserIds = formalLineUserService.getRecordUserIds();
                FormalLineUser formalLineUser = formalLineUserService.getById(Long.parseLong(id));
                if (recordUserIds.size() > 0 && formalLineUser!=null) {
                    for (Long recordUserId : recordUserIds) {
                        if (recordUserId.equals(formalLineUser.getUserId())) {
                            return CommonResult.failed("该用户已参加过其他路线报名,不可出团");
                        }
                    }
                }
            }
            FormalLineUser formalLineUser = new FormalLineUser();
            if (null != id && !"".equals(id)) {
                formalLineUser.setId(Long.valueOf(id));
            }
            if (null != ifout && !"".equals(ifout)) {
                formalLineUser.setYesNo(Integer.valueOf(ifout));
            }
            boolean result = formalLineUserServiceImpl.updateById(formalLineUser);
            return CommonResult.success(result);
        } catch (
                Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("修改失败！");
        }

    }

    @GetMapping("/flLeaderList")
    @ResponseBody
    @ApiOperation("疗养订单--领队分配--线路领队list查询，已经成团的线路")
    public CommonResult getFLLeaderList(String name, Integer userType,
                                        @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                        @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(formalLineServiceImpl.getFLLeaderList(name, userType)));
    }

    /**
     * 修改疗养人是否出团
     */
    @PostMapping("/changeFormalStatus")
    @ResponseBody
    public CommonResult changeFormalStatus(String formalid) {
        try {

            FormalLine formalLine = new FormalLine();
            if (null != formalid && !"".equals(formalid)) {
                formalLine.setId(Long.valueOf(formalid));
            }
            formalLine.setLineStatus(Constants.LINE_STATUS_BUY_TICKET);
            boolean check = formalLineServiceImpl.checkFormalLineUserList(formalid);
            if (check) {
                boolean result = formalLineServiceImpl.updateById(formalLine);
                return CommonResult.success(result);
            } else {
                return CommonResult.failed("请全部确认是否出团以后，再进行提交！");
            }

        } catch (Exception e1) {
            e1.printStackTrace();
            return CommonResult.failed("修改失败！");
        }
    }

}
