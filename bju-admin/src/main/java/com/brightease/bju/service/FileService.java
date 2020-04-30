package com.brightease.bju.service;

import java.io.InputStream;

/**
 * Created by zhaohy on 2019/9/4.
 */
public interface FileService {
    String upload(InputStream inputStream, String towPath, String suffix);
}
