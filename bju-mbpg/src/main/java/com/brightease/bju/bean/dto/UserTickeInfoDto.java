package com.brightease.bju.bean.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.brightease.bju.annotation.ExcelColumn;
import com.brightease.bju.bean.ticket.TicketInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by zhaohy on 2019/9/26.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class UserTickeInfoDto implements Serializable {


    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long formalLineUserId;

    private Long formalId;

    /**
     * 出行工具
     */
    private String goType;

    /**
     * 车票/航班/车牌号
     */
    @ExcelColumn(value = "车票/航班",col = 7)
    private String goTicketInfo;

    /**
     * 价格
     */
    @ExcelColumn(value = "票价",col = 8)
    private BigDecimal goPrice;

    /**
     * 票务备注
     */
    @ExcelColumn(value = "票务备注",col = 9)
    private String goNote;


    /**
     * 返程工具
     */
    private String backType;

    /**
     * 车票航班火车
     */
    @ExcelColumn(value = "车票/航班",col = 11)
    private String backTicketInfo;

    /**
     * 价格
     */
    @ExcelColumn(value = "票价",col = 12)
    private BigDecimal backPrice;

    /**
     * 票务备注
     */
    @ExcelColumn(value = "票务备注",col = 13)
    private String backNote;


    //京卡卡号
    @ExcelColumn(value = "京卡卡号",col = 3)
    private String cardId;

    //疗养人姓名
    @ExcelColumn(value = "疗养人姓名",col = 1)
    private String name;

    //身份证号
    @ExcelColumn(value = "身份证号",col = 4)
    private String IDCard;

    //联系电话
    @ExcelColumn(value = "联系电话",col = 5)
    private String phone;

    //企业名称
    @ExcelColumn(value = "所属单位",col = 2)
    private String enterpriseName;

    //企业id
    private Long eId;

    //出行工具
    @ExcelColumn(value = "出行工具",col = 6)
    private String goTool;
    //返程工具
    @ExcelColumn(value = "返航工具",col = 10)
    private String backTool;

}
