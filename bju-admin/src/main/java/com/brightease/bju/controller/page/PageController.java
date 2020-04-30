package com.brightease.bju.controller.page;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * 测试企业登录跳转页面
 * auther: zhangqi
 */
@Controller
@RequestMapping
public class PageController {

    @GetMapping(value = {"/index","/"})
    public String index(){
        return "bjzgh/login";
    }

    /**
     * 页面跳转
     * @return
     */
    @GetMapping("/route")
    public String pageChange(HttpServletRequest request, ModelMap map){
        String path = request.getQueryString();
        String[] paths = path.split("&");
        String name = "";
      if(paths !=null && paths.length>0){
          if(paths[0].split("=")!=null && paths[0].split("=").length>=2){
              name = paths[0].split("=")[1];for(int i=1;i<paths.length;i++){
                  if(paths[i].split("=").length == 2) {
                      map.put(paths[i].split("=")[0], paths[i].split("=")[1]);
                  }
              }
          }
      }
        return "bjzgh/"+name;
    }

    @GetMapping("/changePage")
    public String changePage(String page) {
        return "bjzgh/" + page;
    }

    @GetMapping("/changePageParam")
    public String changePageParam(String page, String data, Model model){
        model.addAttribute("data", data);
        return "bjzgh/" + page;
    }
}
