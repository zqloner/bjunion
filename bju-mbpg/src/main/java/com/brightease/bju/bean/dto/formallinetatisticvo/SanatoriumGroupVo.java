package com.brightease.bju.bean.dto.formallinetatisticvo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * （管理端业务统计的疗养群体统计详情）疗养群体统计参数封装
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SanatoriumGroupVo {
    private String line;
    private String name;
    private Long company1;
    private Long company2;
    private String start;
    private String end;
    private String idCard;
    private String tel;
}
