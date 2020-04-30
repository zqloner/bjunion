package com.brightease.bju.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Created by zhaohy on 2019/8/19.
 */
@Configuration
@EnableAsync//开启对异步任务的支持
public class ThreadAsyncConfigurer implements AsyncConfigurer {

    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor threadPool = new ThreadPoolTaskExecutor();
        //设置核心线程数 即线程池中的线程数目大于这个参数时，提交的任务会被放进任务缓存队列
        threadPool.setCorePoolSize(10);
        //设置最大线程数 线程池最大能容忍的线程数
        threadPool.setMaxPoolSize(25);
        //线程池所使用的缓冲队列 用来存放等待执行的任务
        threadPool.setQueueCapacity(2000);
        //等待任务在关机时完成--表明等待所有线程执行完
//        threadPool.setWaitForTasksToCompleteOnShutdown(true);
        // 等待时间 （默认为0，此时立即停止），并没等待xx秒后强制停止
        threadPool.setAwaitTerminationSeconds(60 *30);
        //  线程名称前缀
        threadPool.setThreadNamePrefix("BRIGHTEASE-ASYNC-");
        threadPool.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
       /* Reject策略预定义有四种：
        (1)ThreadPoolExecutor.AbortPolicy策略，是默认的策略,处理程序遭到拒绝将抛出运行时 RejectedExecutionException。
        (2)ThreadPoolExecutor.CallerRunsPolicy策略 ,调用者的线程会执行该任务,如果执行器已关闭,则丢弃.
        (3)ThreadPoolExecutor.DiscardPolicy策略，不能执行的任务将被丢弃.
        (4)ThreadPoolExecutor.DiscardOldestPolicy策略，如果执行程序尚未关闭，则位于工作队列头部的任务将被删除，然后重试执行程序（如果再次失败，则重复此过程）.
           */
        // 初始化线程
        threadPool.initialize();
        return threadPool;
    }
}
