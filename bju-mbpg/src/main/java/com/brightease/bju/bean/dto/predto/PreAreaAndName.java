package com.brightease.bju.bean.dto.predto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 张奇
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreAreaAndName {
    private Long id;
    private String name;
}
