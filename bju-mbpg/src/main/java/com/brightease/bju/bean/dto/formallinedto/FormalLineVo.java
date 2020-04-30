package com.brightease.bju.bean.dto.formallinedto;

import com.brightease.bju.bean.formal.FormalLineUser;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 正式报名修改参数的封装
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineVo {
    private List<FormalLineUser> users;
    private Long forId;
}
