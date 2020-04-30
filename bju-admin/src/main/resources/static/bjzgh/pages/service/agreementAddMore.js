/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'layer', 'form', 'fileUpload'], function () {
    var $ = layui.jquery
        , layer = layui.layer
        , form = layui.form
        , fileUpload = layui.fileUpload;//自定义文件上传

    //上传文件
    fileUpload.picture({
        elem:"#upload",
        url:"/contractContract/import",//上传接口
        // ,data:'',//额外参数
        accept:"file"
    }, function(res, index, upload){  //执行上传请求后的回调
        if(res.code == "200"){
            layer.closeAll('loading'); //关闭loading
            layer.msg(res.data);
        }else{
            layer.msg(res.message);
            layer.closeAll('loading'); //关闭loading
        }
    });
});