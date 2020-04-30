package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 企业树形dto
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class EnterPriseTreeDto {
    /**
     * 地区名字
     */
    private Long id;

    /**
     * 地区名字
     */
    private  String title;

    /**
     * 孩子
     */
    private List<EnterPriseTreeDto> children;
}
