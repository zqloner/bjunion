package com.brightease.bju.page;

import com.brightease.bju.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import java.net.URLDecoder;

/**
 * 页面跳转基础controller
 * Created by zhaohy on 2019/9/23.
 */
@Controller
public class PageController extends BaseController {

    @GetMapping(value = {"/index","/"})
    public String index() {
        return "index";
    }

    /**
     * 页面跳转
     * @return
     */
    @GetMapping("/route")
    public String pageChange(HttpServletRequest request, ModelMap map) throws Exception {
        String path = request.getQueryString();
        String[] paths = path.split("&");
        String name = "";
        if(paths !=null && paths.length>0){
            if(paths[0].split("=")!=null && paths[0].split("=").length>=2){
                name = paths[0].split("=")[1];for(int i=1;i<paths.length;i++){
                    if(paths[i].split("=").length == 2) {
                        map.put(paths[i].split("=")[0], URLDecoder.decode(paths[i].split("=")[1]));
                    }
                }
            }
        }
        return name;
    }
}


