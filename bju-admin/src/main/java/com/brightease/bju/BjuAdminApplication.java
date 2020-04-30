package com.brightease.bju;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Created by zhaohy on 2019/9/2.
 */
@SpringBootApplication
@EnableScheduling
public class BjuAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(BjuAdminApplication.class);
    }
}
