package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.formal.FormalLine;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * Created by zhaohy on 2019/9/26.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class TicketInfoDto extends FormalLine {

    private String leaderName;
    private int personCount;
}
