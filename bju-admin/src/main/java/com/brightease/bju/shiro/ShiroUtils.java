package com.brightease.bju.shiro;

import com.brightease.bju.bean.leader.LeaderLeader;
import com.brightease.bju.bean.sys.SysAdmin;
import com.brightease.bju.util.BeanUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.subject.Subject;

/**
 * shiro 工具类
 * 
 * @author ruoyi
 */
public class ShiroUtils
{
    public static Subject getSubjct()
    {
        return SecurityUtils.getSubject();
    }

    public static Session getSession()
    {
        return SecurityUtils.getSubject().getSession();
    }

    public static void logout()
    {
        getSubjct().logout();
    }

    public static SysAdmin getSysUser()
    {
        SysAdmin user = null;
        Object obj = getSubjct().getPrincipal();
        if (obj != null)
        {
            user = new SysAdmin();
            BeanUtils.copyBeanProp(user, obj);
        }
        return user;
    }

    public static LeaderLeader getLeader(){
        LeaderLeader leader = null;
        Object obj = getSubjct().getPrincipal();
        if (obj != null) {
            leader = new LeaderLeader();
            BeanUtils.copyBeanProp(leader,obj);
        }
        return leader;
    }

    public static void setSysUser(SysAdmin user)
    {
        Subject subject = getSubjct();
        PrincipalCollection principalCollection = subject.getPrincipals();
        String realmName = principalCollection.getRealmNames().iterator().next();
        PrincipalCollection newPrincipalCollection = new SimplePrincipalCollection(user, realmName);
        // 重新加载Principal
        subject.runAs(newPrincipalCollection);
    }

    public static void setLeader(LeaderLeader leader) {
        Subject subject = getSubjct();
        PrincipalCollection principalCollection = subject.getPrincipals();
        String realmName = principalCollection.getRealmNames().iterator().next();
        PrincipalCollection newPrincipalCollection = new SimplePrincipalCollection(leader, realmName);
        // 重新加载Principal
        subject.runAs(newPrincipalCollection);
    }

    public static void clearCachedAuthorizationInfo()
    {
        RealmSecurityManager rsm = (RealmSecurityManager) SecurityUtils.getSecurityManager();
        SysManagerRealm realm = (SysManagerRealm) rsm.getRealms().iterator().next();
        realm.clearCachedAuthorizationInfo();
    }


    public static String getLoginName()
    {
        return getSysUser().getUsername();
    }

    public static String getIp()
    {
        return getSubjct().getSession().getHost();
    }

    public static String getSessionId()
    {
        return String.valueOf(getSubjct().getSession().getId());
    }

}
