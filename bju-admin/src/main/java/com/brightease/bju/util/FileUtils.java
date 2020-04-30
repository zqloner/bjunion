package com.brightease.bju.util;

import org.apache.poi.util.IOUtils;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhaohy on 2019/7/23.
 */
public class FileUtils {

    /**
     * 输出指定文件的byte数组
     * @return
     */
    public static void writeBytes(String filePath, OutputStream os) throws IOException
    {
        FileInputStream fis = null;
        try
        {
            File file = new File(filePath);
            if (!file.exists())
            {
                throw new FileNotFoundException(filePath);
            }
            fis = new FileInputStream(file);
            byte[] b = new byte[1024];
            int length;
            while ((length = fis.read(b)) > 0)
            {
                os.write(b, 0, length);
            }
        }
        catch (IOException e)
        {
            throw e;
        }
        finally
        {
            if (os != null)
            {
                try
                {
                    os.close();
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
            if (fis != null)
            {
                try
                {
                    fis.close();
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
        }
    }

    /**
     * 删除文件
     *
     * @param filePath 文件
     * @return
     */
    public static boolean deleteFile(String filePath)
    {
        boolean flag = false;
        File file = new File(filePath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists())
        {
            file.delete();
            flag = true;
        }
        return flag;
    }

    public static List<String> func(String path){
        File file = new File(path);
        if (!file.exists()) {
            System.out.println("文件不存在");
            return null;
        }
        ArrayList arrayList = new ArrayList();
        File[] fs = file.listFiles();
        for(File f:fs){
            if(f.isDirectory())
                arrayList.addAll(func(f.getAbsolutePath()));
            if(f.isFile())		//若是文件，直接打印
                arrayList.add(f.getName());
//                arrayList.add(f.getAbsolutePath());
        }
        return arrayList;
    }

    public static void fileChannelCopy(String sFile, String tFile) {
        File tF = new File(sFile);
        if (!tF.exists()) {//判断存在
            tF.mkdirs();//不存在则重新创建多存目录
        }
        FileInputStream fi = null;
        FileOutputStream fo = null;
        FileChannel in = null;
        FileChannel out = null;
        File s = new File(sFile);
        File t = new File(tFile);
        if (s.exists() && s.isFile()) {
            try {
                fi = new FileInputStream(s);
                fo = new FileOutputStream(t);
                in = fi.getChannel();// 得到对应的文件通道
                out = fo.getChannel();// 得到对应的文件通道
                in.transferTo(0, in.size(), out);// 连接两个通道，并且从in通道读取，然后写入out通道
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    fi.close();
                    in.close();
                    fo.close();
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }
    /**
     * 输出指定文件的byte数组
     *
     * @return
     */
    public static void writeUrlBytes(String filePath, OutputStream os) throws IOException{
        try{
            URL url = new URL(filePath);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            //设置超时间为3秒
            conn.setConnectTimeout(3*1000);
            //防止屏蔽程序抓取而返回403错误
            conn.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)");

            //得到输入流
            InputStream inputStream = conn.getInputStream();
            //获取自己数组
            byte[] getData = readInputStream(inputStream);
            int length;
                os.write(getData);
        }
        catch (IOException e)
        {
            throw e;
        }
        finally
        {
            if (os != null)
            {
                try
                {
                    os.close();
                }
                catch (IOException e1)
                {
                    e1.printStackTrace();
                }
            }
        }
    }
    /**
     * 从输入流中获取字节数组
     * @param inputStream
     * @return
     * @throws IOException
     */
    public static  byte[] readInputStream(InputStream inputStream) throws IOException {
        byte[] buffer = new byte[1024];
        int len = 0;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        while((len = inputStream.read(buffer)) != -1) {
            bos.write(buffer, 0, len);
        }
        bos.close();
        return bos.toByteArray();
    }
}
