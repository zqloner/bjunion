package com.brightease.bju.bean.formal;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 正式报名的用户
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 线路企业id
     */
    private Long lineEnterpriseId;

    private Long formalId;

    private Long userId;

    private Long enterpriseId;

    /**
     * 是否出团 0 否 1是
     */
    private Integer yesNo;

    /**
     * 审核是否通过 0 否 1是 2待审核
     */
    private Integer examine;

    @TableField(exist = false)
    private Long formalLineId;


}
