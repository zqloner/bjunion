package com.brightease.bju.bean.formal;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 正式报名线路
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLine implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 线路id
     */
    private Long lineId;

    /**
     * 疗养开始日期
     */
    @JsonFormat(pattern="yyyy-MM-dd")
    @ExcelColumn(value = "疗养开始时间",col = 2)
    private LocalDate sBenginTime;

    /**
     * 疗养结束日期
     */
    @JsonFormat(pattern="yyyy-MM-dd")
    @ExcelColumn(value = "疗养结束时间",col = 3)
    private LocalDate sEndTime;

    /**
     * 报名开始日期
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ExcelColumn(value = "报名开始时间",col = 6)
    private LocalDateTime rBeginTime;

    /**
     * 报名截止日期
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ExcelColumn(value = "报名结束时间",col = 7)
    private LocalDateTime rEndTime;

    /**
     * 已报人数
     */
    private Integer nowCount;

    /**
     * 限报人数
     */
    @ExcelColumn(value = "限报人数",col = 5)
    private Integer maxCount;

    /**
     * 是否成团 0  1
     */
    private Integer isTeam;

    /**
     * 审核状态 1 未审核 2 审核中  3 审核通过 4审核不同过
     */
    private Integer examineStatus;

    /**
     *  1 报名中，2 未成团，3 已经成团（待出团），4 出团中，5 票务购票，6 待结算，7 已结束
     */
    private Integer lineStatus;

    /**
     * 用户类型（劳模，优秀，职工）
     */
    private Long userType;

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
     * 不成团理由
     */
    private String message;
    //线路名称
    @TableField(exist = false)
    @ExcelColumn(value = "线路名称",col = 1)
    private String name;

    //下属企业报名人数
    @TableField(exist = false)
    private List<FormalLineEnterprise> enterprises;

    //报名状态
    @TableField(exist = false)
    private Integer regStatus;

    //审核通过的用户人数
    @TableField(exist = false)
    private Long newCount;

    //正式报名统计，企业名称
    @TableField(exist = false)
    @ExcelColumn(value = "报名单位",col = 4)
    private String eName;

    @TableField(exist = false)
    private Long eCount;

    //路线状态
    @TableField(exist = false)
    private Integer ttl;

    @TableField(exist = false)
    @ExcelColumn(value = "职工类型",col = 8)
    private String userTypeStr;

    @TableField(exist = false)
    private Long fleId;

    @TableField(exist = false)
    private Long formalLineEnterpriseId;

    @TableField(exist = false)
    private Long enterpriseId;

    private LocalDateTime updateTime;

}
