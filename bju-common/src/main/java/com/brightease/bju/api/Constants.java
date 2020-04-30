package com.brightease.bju.api;

/**
 * 通用常量
 */
public class Constants {

    //redis db 0
    public static final int REDIS_DB_0 = 0;

    // 无效
    public static final int STATUS_INVALID = 0;
    //有效
    public static final int STATUS_VALID = 1;
    //已删除
    public static final int DELETE_INVALID=0;
    //未删除
    public static final int DELETE_VALID=1;

    //新注册未提交审核
    public static final int EXAMINE_RESULT_NO_REQUEST=0;
    // 提交申请 未审核
    public static final int EXAMINE_RESULT_WAIT = 1;
    //审核中
    public static final int EXAMINE_RESULT_ING = 2;
    //审核通过
    public static final int EXAMINE_RESULT_YES = 3;
    //审核不通过
    public static final int EXAMINE_RESULT_NO = 4;

    //审核状态1-通过，0-不通过，2-待审核
    public static final int EXAMINE_PASS = 1;
    public static final int EXAMINE_NO = 0;
    public static final int EXAMINE_WAITING = 2;

    //疗养费用详情状态 0-未审核，1-通过，2-未通过
    public static final int COST_STATUS_WAITING = 0;
    public static final int COST_STATUS_PASS = 1;
    public static final int COST_STATUS_NO = 2;

    //新闻动态
    public static final int SYS_NEWS = 1;
    //通知公告
    public static final int SYS_NOTICE = 2;
    //首页banner
    public static final int SYS_INDEXBANNER = 3;
    //公告banner
    public static final int SYS_NOTICEBANNER = 4;

    public  static  final String TRAVEL = "travel";

    //下级劳模权限开启
    public static final  int MODEL_STATUS_OPEN = 1;
    //下级劳模权限关闭
    public static final  int MODEL_STATUS_CLOSE = 0;

    public static final String INIT_PWD = "111111";

//    0为报名未开始，1为开始报名，2为查看报名，3为报名已结束，4为已报名并且报名结束
    public static final int PRE_REGISTRATION_NOTBEGIN = 0;
    public static final int PRE_REGISTRATION_START = 1;
    public static final int PRE_REGISTRATION_CAT = 2;
    public static final int PRE_REGISTRATION_END = 3;
    public static final int PRE_REGISTRATION_CAT_END = 4;
    //预报名路线是否下发  O为未下发，1为已下发
    public static final int PRE_IS_IN_NEXT = 1;
    public static final int PRE_NOT_IN_NEXT = 0;

    public static final int TEAM_YES = 1;
    public static final int TEAM_NO = 0;

    //1 报名中，2 未成团，3 已经成团（待出团），4 出团中，5 票务购票，6 待结算，7 已结束
    public static final int LINE_STATUS_REGISTING = 1;
    public static final int LINE_STATUS_TEAM_NO = 2;
    public static final int LINE_STATUS_TEAM_YES = 3;
    public static final int LINE_STATUS_OUT = 4;
    public static final int LINE_STATUS_BUY_TICKET = 5;
    public static final int LINE_STATUS_CALC = 6;
    public static final int LINE_STATUS_END = 7;

    //正式报名路线新增的nowCount状态
    public static final int FORMAL_LINE_ADD_NOW_COUNT = 0;

    //合同的状态   0未开始  1服务中   2已结束
    public static final int CONTRAT_NOT_START = 0;
    public static final int CONTRAT_IN_START = 1;
    public static final int CONTRAT_IS_END = 2;

    //新闻的sort字段初始值
    public static final long NEWS_START_VALUE= 0;

    //后台疗养费用type
    public static final String ADMIN_CSOT_TYPE="1";
    public static final String LEADER_CSOT_TYPE="2";

    //用户报名之后修改下标识
    public static final int USER_CHANGE = 2;

    public static final int FIRST_LEVER_AREA= 7459;

    //用户报名之后修改下标识
    public static final int FIRST_LEVER_ENTERPRISE = 1;

    public static final Long PARSE_LOCAL_DATE_TIME= 50400000L;

    //费用是否是领队  1领队   0不是领队
    public static final int COST_IS_LEADER = 1;
    public static final int COST_IS_NOT_LEADER = 0;

    //路线用户是否出团
    public static final int USER_YES_N0_NO= 0;

    //路线的类型
    public  static  final int USER_PUTONG_TYPE = 1;
    public  static  final int USER_YOUXIU_TYPE = 2;
    public  static  final int USER_LAOMO_TYPE = 3;










}
