package com.brightease.bju.shiro;

import org.apache.shiro.authc.UsernamePasswordToken;

/**
 * Created by zhaohy on 2019/9/2.
 */
public class LeaderUserToken extends UsernamePasswordToken {

    public LeaderUserToken(String username, String password) {
        super(username, password);
    }
}
