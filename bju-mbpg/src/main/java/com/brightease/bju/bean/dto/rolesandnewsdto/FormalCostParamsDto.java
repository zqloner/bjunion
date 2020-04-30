package com.brightease.bju.bean.dto.rolesandnewsdto;

import com.brightease.bju.bean.formal.FormalCostAppend;
import com.brightease.bju.bean.formal.FormalCostInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * Created by zhaohy on 2019/9/5.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalCostParamsDto {
    private Long id;
    private List<FormalCostInfo> costs;
    private List<FormalCostAppend> appends;
}
