package com.brightease.bju.bean.pre;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 预报名  企业  职工类型 关联
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class PreLineStatistics implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 总工会预报名线路id
     */
    private Long pid;

    /**
     * 预报名下发id
     */
    private Long preId;

    /**
     * 企业id
     */
    private Long enterpriseId;

    /**
     * 报名地点
     */
    private Long cityId;

    /**
     * 月份
     */
    private Long month;

    /**
     * 人数
     */
    private Integer personCount;

    /**
     * 员工角色（劳模，优秀，普通）
     */
    private Long userType;

    private LocalDateTime createTime;

    //该报名对应的路线名字
    @TableField(exist = false)
    private String preLineName;


}
