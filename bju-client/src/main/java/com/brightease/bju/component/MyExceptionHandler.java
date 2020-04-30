package com.brightease.bju.component;

import com.brightease.bju.api.CommonResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 *
 * Created by zhaohy on 2019/7/9.
 */
@RestControllerAdvice
public class MyExceptionHandler {

//    @ExceptionHandler(value = Exception.class)
    public CommonResult handlerException() {
        return CommonResult.failed("系统异常");
    }
}
