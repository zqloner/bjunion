package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.line.LineLine;
import com.brightease.bju.bean.line.LineSanatorium;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by zhaohy on 2019/9/5.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class LineLineDto extends LineLine {

    //线路关联的疗养院
    private List<LineSanatorium> sanatoriums;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
    private String name;
}
