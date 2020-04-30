package com.brightease.bju.bean.sys;

import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 新闻
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysNews implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 来源
     */
    private String source;

    /**
     * 编辑，作者
     */
    private String author;

    /**
     * 标题
     */
    private String title;

    /**
     * 1新闻动态，2通知公告 ,3首页banner, 4公告banner
     */
    private Integer type;

    /**
     * 创建者
     */
    private Long creatorId;

    /**
     * 内容
     */
    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer status;

    /**
     * 图片地址
     */
    private String image;

    //排序字段
    private Long sort;

}
