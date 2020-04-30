package com.brightease.bju.bean.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 地区树形dto
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class AreasTreeDto {
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
    private List<AreasTreeDto> children;
}
