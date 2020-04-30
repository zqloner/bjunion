package com.brightease.bju.bean.dto.homedto;

import com.brightease.bju.bean.line.LineLine;
import com.brightease.bju.bean.sanatorium.SanatoriumSanatorium;
import com.brightease.bju.bean.sys.SysNews;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 张奇
 * 用于首页展示内容的封装
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class HomeDto {
    //新闻
    private List<SysNews> news;

    //路线
    private List<LineLine> lines;

    //疗养院
    private List<SanatoriumSanatorium> sanatoriums;
}
