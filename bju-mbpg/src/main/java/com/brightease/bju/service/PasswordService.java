package com.brightease.bju.service;

import com.brightease.bju.bean.sys.SysAdmin;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.stereotype.Service;

/**
 * Created by zhaohy on 2018/12/11.
 */
@Service
public class PasswordService {

    public boolean matches(SysAdmin user, String newPassword)
    {
        return user.getPassword().equals(newPassword);
//        return user.getPassword().equals(encryptPassword(user.getLoginName(), newPassword, ""));
    }

    public String encryptPassword(String username, String password, String salt)
    {
        return new Md5Hash(username + password + salt).toHex().toString();
    }

   /* public static void main(String[] args)
    {
        System.out.println(new PasswordService().encryptPassword("admin", "111111", ""));
        System.out.println(new Md5Hash("111111").toHex());
    }*/
}
