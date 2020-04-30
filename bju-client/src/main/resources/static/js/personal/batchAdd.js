layui.config({
    base : "../../js/"
}).use(['form','jquery','layer','fileUpload','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,fileUpload = layui.fileUpload//自定义上传文件
        ,ajax = layui.ajax; //自定义请求数据

    //上传图片
    fileUpload.picture({
        elem:"#preview",
        url:"/enterpriseUser/upload",//上传接口
        // ,data:'',//额外参数
        accept:"file",
    }, function(res, index, upload){  //执行上传请求后的回调
        layer.closeAll('loading'); //关闭loading
        if(res.code == 200){
            layer.msg(res.data,{icon:6});
        }else{
            layer.msg(res.message,{icon:5});
        }
    });


    //点击点击下载
    $("#download").click(function () {
        //提示
        window.location.href="/enterpriseUser/downloadTemplate"
    });
    //点击确定
    $("#addNews").click(function () {
        window.location.href="route?name=personal/staffManagement";
    });
    function callback(res) {
        console.log(res);
    }

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});