package com.brightease.bju.shiro;

import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.leader.LeaderLeader;
import com.brightease.bju.bean.sys.SysAdmin;
import com.brightease.bju.service.enterprise.EnterpriseEnterpriseService;
import com.brightease.bju.service.leader.LeaderLeaderService;
import com.brightease.bju.service.sys.SysAdminService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by zhaohy on 2019/7/16.
 */
@Component
public class SysManagerRealm extends AuthorizingRealm {

    @Autowired
    private SysAdminService sysAdminService;
    @Autowired
    private LeaderLeaderService leaderService;

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SysAdmin sysManager = (SysAdmin) principalCollection.getPrimaryPrincipal();
        // 角色列表
        Set<String> roles = new HashSet<String>();
        // 功能列表
        Set<String> menus = new HashSet<String>();
        Long userId = sysManager.getId();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
//        if(sysManager.isAdmin()){
        info.addRole("admin");
        info.addStringPermission("*:*:*");
//        }else
//        {
//            roles = roleService.selectRoleKeys(sysManager.getId());
//            menus = menuService.selectPermsByUserId(sysManager.getId());
//            // 角色加入AuthorizationInfo认证对象
//            info.setRoles(roles);
//            // 权限加入AuthorizationInfo认证对象
//            info.setStringPermissions(menus);
//        }
        return info;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //admin用户的token
        if (authenticationToken instanceof AdminUserToken){
            UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
            String username = token.getUsername();
            String password = "";
            if (token.getPassword() != null)
            {
                password = new String(token.getPassword());
            }
            SysAdmin sysManager = sysAdminService.fingUserByUserLoginName(username);//
            //账号不存在
            if(sysManager == null) {
                throw new UnknownAccountException("账号不存在");
            }
            //密码是否匹配
            if(!sysManager.getPassword().equals(password)){
                throw  new RuntimeException("密码不匹配！");
            }
            SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(sysManager, password, getName());
            return info;
        } else if (authenticationToken instanceof LeaderUserToken) {
            UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
            String username = token.getUsername();
            String password = "";
            if (token.getPassword() != null)
            {
                password = new String(token.getPassword());
            }
            LeaderLeader leader = leaderService.fingUserByUserLoginName(username);//
            //账号不存在
            if(leader == null) {
                throw new UnknownAccountException("账号不存在");
            }
            //密码是否匹配
            if(!leader.getPassword().equals(password)){
                throw  new RuntimeException("密码不匹配！");
            }
            SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(leader, password, getName());
            return info;
        }
        return null;
    }


    protected void clearCachedAuthorizationInfo() {
        this.clearCachedAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
    }
}
