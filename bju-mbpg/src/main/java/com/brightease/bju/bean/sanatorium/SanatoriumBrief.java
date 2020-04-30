package com.brightease.bju.bean.sanatorium;

import java.time.LocalDateTime;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 疗养简介
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SanatoriumBrief implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private String modelName;

    private LocalDateTime updateTime;

    /**
     * 内容
     */
    private String content;

    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer status;


}
