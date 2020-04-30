package com.brightease.bju.dao.sys;

import com.brightease.bju.bean.dto.SysAdminDto;
import com.brightease.bju.bean.sys.SysAdmin;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 系统管理员 Mapper 接口
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-02
 */
@Mapper
@Repository
public interface SysAdminMapper extends BaseMapper<SysAdmin> {

    List<SysAdminDto> getAountList();
    SysAdminDto getAcountById(Long id);
}
