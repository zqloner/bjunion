package com.brightease.bju.service.impl;

import com.brightease.bju.service.FileService;
import com.brightease.bju.util.FileUploadUtil;
import org.springframework.stereotype.Service;

import java.io.InputStream;

/**
 * Created by zhaohy on 2019/9/4.
 */
@Service
public class FileServiceImpl implements FileService {
    @Override
    public String upload(InputStream inputStream, String towPath, String suffix) {
        return FileUploadUtil.uploadQrCode(inputStream,towPath,suffix);
    }
}
