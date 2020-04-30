package com.brightease.bju;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.brightease.bju.controller.page.PageController;
import com.brightease.bju.service.sys.SysAdminService;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static cn.hutool.core.lang.Singleton.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

/**
 * Created by zhaohy on 2019/9/2.
 */
public class BjuAdminApplicationTests {

    @Test
    public void testAdminService() throws Exception {
//        PageController pageController = new PageController();
//        MockMvc mockMvc = standaloneSetup(pageController).build();
//        mockMvc.perform(get("changePageParam")).andExpect(view().name("bjzgh/"));
        Md5Hash md5Hash = new Md5Hash("111111");
        System.out.println(md5Hash.toHex());
        System.out.println(md5Hash.toString());
        List<Long> ids = new ArrayList<>();
        ids.add(1l);
        ids.add(2l);
        ids.add(3l);
        ids.add(4l);

        List<Long> ids1 = new ArrayList<>();
        ids.add(1l);
        ids.add(4l);
        ids.add(6l);
        ids.add(7l);
        List<Long> collect = ids.stream().filter(x -> {
            for (Long aLong : ids1) {
               return x==aLong;
            }
            return false;
        }).collect(Collectors.toList());
        System.out.println(collect.toString());

    }
}
