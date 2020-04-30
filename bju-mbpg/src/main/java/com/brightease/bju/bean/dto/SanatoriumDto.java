package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * Created by zhaohy on 2019/9/5.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SanatoriumDto extends SanatoriumSanatorium {
    private String area;
}
