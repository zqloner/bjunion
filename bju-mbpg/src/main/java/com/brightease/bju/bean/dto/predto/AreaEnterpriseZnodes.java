package com.brightease.bju.bean.dto.predto;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/* 地区和企业单选树全查的封装*/
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class AreaEnterpriseZnodes {
    private List<AreaZnodesDto> areaZnodesDtos;
    private List<EnterPriseZnodeDto> enterPriseZnodeDtos;
}
