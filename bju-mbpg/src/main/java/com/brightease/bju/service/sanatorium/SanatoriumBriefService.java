package com.brightease.bju.service.sanatorium;

import com.brightease.bju.bean.sanatorium.SanatoriumBrief;
import com.baomidou.mybatisplus.extension.service.IService;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 * 疗养简介 服务类
 * </p>
 *
 * @author zhaohy
 * @since 2019-09-03
 */
public interface SanatoriumBriefService extends IService<SanatoriumBrief> {


    List<SanatoriumBrief> getList();

}
