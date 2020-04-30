package com.brightease.bju.bean.dto.formallinedto;

import com.brightease.bju.bean.formal.FormalLine;
import com.brightease.bju.bean.formal.FormalLineEnterprise;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class FormalLineImportDto {
    private FormalLineEnterprise formalLineEnterprise;
    private FormalLine formalLine;
}
