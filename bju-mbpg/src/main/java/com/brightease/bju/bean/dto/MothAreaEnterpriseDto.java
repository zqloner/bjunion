package com.brightease.bju.bean.dto;

import com.brightease.bju.bean.enterprise.EnterpriseEnterprise;
import com.brightease.bju.bean.sys.SysArea;
import com.brightease.bju.bean.sys.SysDict;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class MothAreaEnterpriseDto {
    //企业
    List<EnterpriseEnterprise> enterpriseEnterprises;

    //月份
    List<SysDict> sysDicts;

    //地域
    List<SysArea> sysAreas;
}
