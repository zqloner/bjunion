package com.brightease.bju.service.pre;

import com.brightease.bju.api.CommonResult;

public interface PreFindAllService {
    /*  预报名路线企业  地区树   月份的查*/
    CommonResult preFindAll();

    /* 预报名统计单选树的查询 */
    CommonResult preFindAllZonede();
}
