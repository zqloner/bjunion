package com.brightease.bju.config;

import com.github.pagehelper.PageHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * Created by zhaohy on 2018/12/5.
 */
@Configuration
public class MybatisPlusConfig {

    @Bean
    public PageHelper pageHelper(){return new PageHelper();}

    /**
     * 打印 sql
     */
   /* @Bean
    public PerformanceInterceptor performanceInterceptor() {
        PerformanceInterceptor performanceInterceptor = new PerformanceInterceptor();
        //格式化sql语句
        Properties properties = new Properties();
        properties.setProperty("format", "true");
        performanceInterceptor.setProperties(properties);
        return performanceInterceptor;
    }*/
}
