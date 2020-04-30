package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * Created by zhaohy on 2019/10/12.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SanatoriumOrderDto extends FormalLine{

    private Long enterpriseId;
    private String lineName;
    private String leaderName;
    private Long myUserCount;
    private Long userType;

    private Long allUsers;
    private Long myUsers;

    private String sanatorName;

}
