package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 *
 * Created by zhaohy on 2019/9/24.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineDto extends FormalLine {

    //疗养开始日期
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate start;
    //疗养结束日期
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate end;

    //领队名字
    private String leaderName;
    //企业名称
    private Long eId;
    //上级名称
    private Long pId;
}
