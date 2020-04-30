var navs = {
    enlist:[
        {
            "title" : "劳模报名",
            "spread" : false,
            "href" : "route?name=signUp/enroll&index=0"
        },
        {
            "title" : "优秀员工报名",
            "spread" : false,
            "href" : "route?name=signUp/enroll&index=1"
        },
        {
            "title" : "普通职工报名",
            "spread" : false,
            "href" : "route?name=signUp/enroll&index=2"
        }
    ],
    county:[
        {
        "title" : "企业管理",
        "spread" : true,
        "children" : [
            {
                "title" : "我的企业资料",
                "href" : "/enterpriseEnterprise/information",
                "spread" : true
            },
            {
                "title" : "下属企业管理",
                "href" : "route?name=personal/enterprises",
                "spread" : false
            },
            {
                "title" : "员工管理",
                "href" : "route?name=personal/staffManagement",
                "spread" : false
            }
        ]
    },
        {
            "title" : "预报名管理",
            "spread" : false,
            "children" : [
                {
                    "title" : "线路下发",
                    "href" : "route?name=personal/lineLower",
                    "spread" : false
                },
                {
                    "title" : "预报名统计",
                    "href" : "route?name=personal/preStatistics",
                    "spread" : false
                }
            ]
        },
        {
            "title" : "正式报名管理",
            "spread" : false,
            "children" : [
                {
                    "title" : "正式报名审计",
                    "href" : "route?name=personal/audit",
                    "spread" : false
                },
                {
                    "title" : "正式报名统计",
                    "href" : "route?name=personal/statistics",
                    "spread" : false
                }
            ]
        },
        {
            "title" : "报名记录",
            "spread" : false,
            "children" : [
                {
                    "title" : "预报名记录",
                    "href" : "route?name=personal/preEntryRecord",
                    "spread" : false
                },
                {
                    "title" : "正式报名记录",
                    "href" : "route?name=personal/entryRecord",
                    "spread" : false
                }
            ]
        },
        {
            "title" : "疗休养订单",
            "spread" : false,
            "children" : [
                {
                    "title" : "我的订单",
                    "href" : "route?name=personal/myOrder",
                    "spread" : false
                }
            ]
        }],
    personal:[
        {
            "title" : "企业管理",
            "spread" : true,
            "children" : [
                {
                    "title" : "企业资料",
                    "href" : "/enterpriseEnterprise/information",
                    "spread" : true
                },
                {
                    "title" : "员工管理",
                    "href" : "route?name=personal/staffManagement",
                    "spread" : false
                }
            ]
        },
        {
            "title" : "报名记录",
            "spread" : false,
            "children" : [
                {
                    "title" : "预报名记录",
                    "href" : "route?name=personal/preEntryRecord",
                    "spread" : false
                },
                {
                    "title" : "正式报名记录",
                    "href" : "route?name=personal/entryRecord",
                    "spread" : false
                }
            ]
        },
        {
            "title" : "疗休养订单",
            "spread" : false,
            "children" : [
                {
                    "title" : "我的订单",
                    "href" : "route?name=personal/myOrder",
                    "spread" : false
                }
            ]
        }
    ]
};