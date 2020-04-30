package com.brightease.bju.config;

import com.brightease.bju.shiro.LogoutFilter;
import com.brightease.bju.shiro.RedisShiroSessionDAO;
import com.brightease.bju.shiro.SysManagerRealm;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 *
 * Created by zhaohy on 2018/12/11.
 */
@Configuration
public class ShiroConfig {
    // 登录地址
    @Value("${shiro.user.loginUrl}")
    private String loginUrl;
    // session 有效期
    @Value("${shiro.user.timeout}")
    private long timeout;


    @Bean("sessionManager")
    public SessionManager sessionManager(RedisShiroSessionDAO redisShiroSessionDAO){
        DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
        //设置session过期时间为1小时(单位：毫秒)，默认为30分钟
        sessionManager.setGlobalSessionTimeout(timeout * 60 * 1000);
        sessionManager.setSessionValidationSchedulerEnabled(true);
        sessionManager.setSessionIdUrlRewritingEnabled(false);
        redisShiroSessionDAO.setTimeOut(timeout);
        sessionManager.setSessionIdCookie(sessionIdCookie());
        //如果开启redis缓存且renren.shiro.redis=true，则shiro session存到redis里
//        if(redisOpen && shiroRedis){
            sessionManager.setSessionDAO(redisShiroSessionDAO);
//        }
        return sessionManager;
    }

    @Bean
    public SecurityManager securityManager(SysManagerRealm userRealm, SessionManager sessionManager) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(userRealm);
        securityManager.setSessionManager(sessionManager);
        return securityManager;
    }


    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilter = new ShiroFilterFactoryBean();
        // Shiro的核心安全接口,这个属性是必须的
        shiroFilter.setSecurityManager(securityManager);
        // 身份认证失败，则跳转到登录页面的配置
        shiroFilter.setLoginUrl(loginUrl);
//        shiroFilter.setUnauthorizedUrl("/");

        /***
         * anon所有请求都可以访问
         * authc需要认证
         */
        Map<String, String> filterMap = new LinkedHashMap<>();
        filterMap.put("/bjzgh/**/**", "anon");
        filterMap.put("/leader/**/**", "anon");
        filterMap.put("/images/**/**", "anon");
        filterMap.put("/plugins/**/**/**/*", "anon");

        filterMap.put("/logout", "logout");
        filterMap.put("/leaderlogin", "anon");
        filterMap.put("/adminlogin", "anon");
        filterMap.put("/", "anon");
        filterMap.put("/index", "anon");

//        filterMap.put("/**/*", "anon");

        //swagger
//        filterMap.put("/swagger-ui.html", "anon");
//        filterMap.put("/swagger-resources", "anon");
//        filterMap.put("/swagger-resources/configuration/security", "anon");
//        filterMap.put("/swagger-resources/configuration/ui", "anon");
//        filterMap.put("/v2/api-docs", "anon");
//        filterMap.put("/webjars/springfox-swagger-ui/**", "anon");

        // Shiro连接约束配置，即过滤链的定义
        Map<String, Filter> filters = new LinkedHashMap<>();
        filters.put("logout", logoutFilter());//退出filter

        //设置其他filter
        shiroFilter.setFilters(filters);
        // 所有请求需要认证
        filterMap.put("/**", "authc");
        shiroFilter.setFilterChainDefinitionMap(filterMap);

        return shiroFilter;
    }


    /**
     * 开启Shiro注解通知器
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(
            @Qualifier("securityManager") SecurityManager securityManager){
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
    /**
     * 退出过滤器
     */
    public LogoutFilter logoutFilter()
    {
        LogoutFilter logoutFilter = new LogoutFilter();
        logoutFilter.setLoginUrl(loginUrl);
        return logoutFilter;
    }

    /**
     * 设置cookie
     * @return
     */
    private SimpleCookie sessionIdCookie() {
        SimpleCookie cookie = new SimpleCookie();
        cookie.setName("ADMINSESSIONID");
        cookie.setHttpOnly(true);
        return cookie;
    }
}
