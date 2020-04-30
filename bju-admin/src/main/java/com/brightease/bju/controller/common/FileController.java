package com.brightease.bju.controller.common;

import com.brightease.bju.api.CommonResult;
import com.brightease.bju.service.FileService;
import com.brightease.bju.util.FileUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhaohy on 2019/9/4.
 */
@Controller
@Slf4j
@Api(value = "文件上传下载",tags = "文件上传下载")
public class FileController {

    @Autowired
    private FileService fileService;

    @Value("${brightease.filePath}")
    private String reportPath;

    @Value("${brightease.tempUpLoadPath}")
    private String tempUpLoadPath;

    @Bean
    MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setLocation(tempUpLoadPath);
        return factory.createMultipartConfig();
    }


    @GetMapping("download")
    public void fileDownload(String fileName, Boolean delete, HttpServletResponse response, HttpServletRequest request){
        try{
            String filePath = reportPath + fileName;
            response.setCharacterEncoding("utf-8");
            response.setContentType("multipart/form-data");
            response.setHeader("Content-Disposition", "attachment;fileName=" + setFileDownloadHeader(request, fileName));
            FileUtils.writeBytes(filePath, response.getOutputStream());
            if (delete){
                FileUtils.deleteFile(filePath);
            }
        }
        catch (Exception e){
            log.error("下载文件失败", e);
        }
    }

    public String setFileDownloadHeader(HttpServletRequest request, String fileName) throws UnsupportedEncodingException{
        final String agent = request.getHeader("USER-AGENT");
        String filename = fileName;
        if (agent.contains("MSIE")){
            // IE浏览器
            filename = URLEncoder.encode(filename, "utf-8");
            filename = filename.replace("+", " ");
        }else if (agent.contains("Firefox")){
            // 火狐浏览器
            filename = new String(fileName.getBytes(), "ISO8859-1");
        }else if (agent.contains("Chrome")){
            // google浏览器
            filename = URLEncoder.encode(filename, "utf-8");
        }else{
            // 其它浏览器
            filename = URLEncoder.encode(filename, "utf-8");
        }
        return filename;
    }

    @PostMapping("/upload")
    @ResponseBody
    @ApiOperation(value = "文件上传")
    public CommonResult upload(@RequestParam("file") MultipartFile file, @RequestParam("towPath") String towPath){
        try {
            if (towPath == "" || towPath ==null) {
                return CommonResult.failed("路径不能为空");
            }
            String fileName=file.getOriginalFilename();
            String[] suffix=fileName.split("\\.");
            String fileUrl= fileService.upload(file.getInputStream(),towPath,suffix[suffix.length-1]);
            return CommonResult.success(fileUrl);
        } catch (Exception e) {
            log.error("上传文件失败："+e.getMessage());
            e.printStackTrace();
            return CommonResult.failed("上传文件失败");
        }
    }
    @GetMapping("filedownload")
    public void fileDownload(String fileurl,String filename,HttpServletResponse response, HttpServletRequest request){
        try{
            String filePath = fileurl;
            FileUtils.writeUrlBytes(filePath, response.getOutputStream());
        }
        catch (Exception e){
            log.error("下载文件失败", e);
        }
    }
    @PostMapping("/uploadLayUI")
    @ResponseBody
    @ApiOperation(value = "文件上传")
    public Map<String,Object> uploadLayUI(MultipartFile file, @RequestParam("towPath") String towPath){
        Map<String, Object> result = new HashMap<>();
        try {
            if (towPath == "" || towPath ==null) {
                result.put("errno", 1);
                result.put("msg", "路径不能为空");
                return result;
            }
            String fileName=file.getOriginalFilename();
            String[] suffix=fileName.split("\\.");
            String fileUrl= fileService.upload(file.getInputStream(),towPath,suffix[suffix.length-1]);
            List<String> imgList = new ArrayList<>();
            imgList.add(fileUrl);
            result.put("errno", 0);
            result.put("msg", "上传成功");
            result.put("data", imgList);
            return result;
        } catch (Exception e) {
            log.error("上传文件失败："+e.getMessage());
            e.printStackTrace();
            result.put("errno", 1);
            result.put("msg", "上传文件失败");
            return result;
        }
    }

}
