package com.brightease.bju.bean.pre;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * <p>
 * 预报名线路
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreLine implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 标题
     */
    private String title;

    /**
     * 说明
     */
    private String describetion;

    /**
     * 报名开放时间
     */
    private LocalDateTime beginTime;

    /**
     * 报名结束时间
     */
    private LocalDateTime endTime;


    /**
     * 用户类型（劳模，优秀，普通）
     */
    private Long userType;

    /**
     * 下发日期
     */
    private LocalDateTime nextTime;


    /**
     * 父id（从哪里下发的）
     */
    private Long parentId;

    private LocalDateTime createTime;

    /**
     * 是否删除 0 删除 1 可用
     */
    private Integer isDel;

    /**
     * 0 不可用 1 可用
     */
    private Integer stat;


    /**
     * 0 未下发 1 已下发
     */
    private Integer isNext;

    @TableField(exist = false)
    private Long createTimeSort;

    public PreLine setCreateTime(LocalDateTime createTime) {
        if (createTime != null) {
            this.createTime = createTime;
            this.createTimeSort = createTime.toInstant(ZoneOffset.of("+8")).toEpochMilli();
        } else {
            this.createTime = createTime;
        }
        return this;
    }
}
