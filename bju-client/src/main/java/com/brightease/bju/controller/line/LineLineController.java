package com.brightease.bju.controller.line;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.api.CommonPage;
import com.brightease.bju.api.CommonResult;
import com.brightease.bju.api.Constants;
import com.brightease.bju.bean.dto.LineLineDto;
import com.brightease.bju.bean.line.LineLine;
import com.brightease.bju.service.line.LineLineService;
import com.github.pagehelper.PageHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 路线 前端控制器
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Controller
@RequestMapping("/lineLine")
@Api(value = "精品路线管理",tags = "线路")
public class LineLineController {

    @Autowired
    private LineLineService lineService;

    @GetMapping("/list")
    @ResponseBody
    @ApiOperation(value = "查询线路list",notes = "查询线路list")
    public CommonResult getList(LineLineDto line,@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "6") Integer pageSize){
        return lineService.getList(line,pageNum,pageSize);
    }

    @GetMapping("/listNoPage")
    @ResponseBody
    @ApiOperation(value = "查询线路listNopage",notes = "查询线路listNopage")
    public CommonResult getList(){
        return CommonResult.success(lineService.getListNoPage());
    }

    @PostMapping("/add")
    @ResponseBody
    @ApiOperation(value = "添加线路", notes = "添加线路")
    public CommonResult add(LineLine line, @RequestParam(value = "ids[]",required = false)List<Long> ids) {
        return lineService.addLine(line,ids);
    }

    @GetMapping("/{id}")
    @ResponseBody
    @ApiOperation(value = "根据id获取线路信息",notes = "根据id查找")
    public CommonResult getById(@PathVariable("id") Long id) {
        return CommonResult.success(lineService.getByLineId(id));
//        return CommonResult.success(lineService.getById(id));
    }

    @PostMapping("/update")
    @ResponseBody
    @ApiOperation(value = "修改线路相关信息", notes = "修改线路")
    public CommonResult update(LineLine line,@RequestParam(value = "ids[]",required = false)List<Long> ids){
        return lineService.updateLine(line,ids);
    }

    @DeleteMapping("/del/{id}")
    @ResponseBody
    @ApiOperation(value = "删除线路",notes = "删除线路")
    public CommonResult del(@PathVariable("id")Long id) {
        return CommonResult.success(lineService.updateById(new LineLine().setId(id).setIsDel(Constants.DELETE_INVALID)));
    }
}
