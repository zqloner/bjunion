/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'fileUpload', 'layedit'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , layedit = layui.layedit
        , sanatoriums = []
        , fileUpload = layui.fileUpload;//自定义文件上传

    //疗养院列表
    getSanatorium();
    function getSanatorium(){
        $.ajax({
            url: '/sanatoriumSanatorium/lsitNoPage' ,
            type: "GET",
            //data: {"id":routeId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    var value = "";
                    var data = res.data;
                    if(data.length != 0){
                        for(var i = 0; i < data.length; i++){
                            value += '<input type="checkbox" name="ids" value='+ data[i].id +' title='+ data[i].name +' lay-skin="primary">';
                        }
                    }
                    $("#sanatoriumDiv").html(value);
                    form.render();
                    //回显
                    for(var i = 0; i < sanatoriums.length; i++){
                        var id = sanatoriums[i].id;
                        $("[name=ids][value="+id+"]").attr("checked",true);
                    }
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //编辑器上传图片
    layedit.set({
        uploadImage: {
            url: '/uploadLayUI?towPath=pic'//接口url
        }
    });

    //编辑器
    // var index = layedit.build('editor');
    var active = {
        content: function () {
            alert(layedit.getContent(index));// 获取编辑器内容
        }
    };

    //上传图片
    fileUpload.picture({
        elem: "#upload",
        url:"/upload",//上传接口
        obj:{"towPath":"route"},//额外参数
        accept:"image",
        size:1024
    }, function(res, index, upload){  //执行上传请求后的回调
        if(res.code == "200"){
            layer.closeAll('loading'); //关闭loading
            $("[name=picUrl]").attr("src",res.data);
            layer.msg("上传成功！");
        }else{
            layer.msg(res.message);
            layer.closeAll('loading'); //关闭loading
        }
    });

    var routeId = $("[name=id]").val();
    if(routeId != undefined && routeId != ''){
        //回显
        getRoute();
    }
    function getRoute(){
        $.ajax({
            url: '/lineLine/' + routeId ,
            type: "GET",
            //data: {"id":routeId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    form.val("layform",{
                        "name":res.data.name,
                        "brief":res.data.brief,
                    });
                    $("[name=picUrl]").attr("src",res.data.picUrl);
                    editorTool.setContent(res.data.content);
                    // layedit.setContent(index, res.data.content, false);
                    sanatoriums = res.data.sanatoriums;
                    for(var i = 0; i < sanatoriums.length; i++){
                        var id = sanatoriums[i].id;
                        $("[name=ids][value="+id+"]").attr("checked",true);
                    }
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 监听提交
    form.on('submit(submitData)', function (data) {
        if(routeId != undefined && routeId != ''){
            //编辑
            updateRoute(data.field,'/lineLine/update');
        }else{
            //添加
            updateRoute(data.field,'/lineLine/add');
        }
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //添加&编辑
    function updateRoute(data,url){
        var arr = new Array();
        $("input:checkbox[name='ids']:checked").each(function(i){
            arr[i] = Number($(this).val());
        });
        if(arr.length == 0){
            layer.msg("请选择关联疗养院！");
            return false;
        }
        // var content = layedit.getContent(index);
        var content = editorTool.getContent();
        var  picUrl = $("[name=picUrl]").attr("src");
        if(content.trim().length == 0){
            layer.msg("请填写详细介绍！");
            return false;
        }
        if(picUrl == ''){
            layer.msg("请上传列表配图！");
            return false;
        }
        data.ids = arr;
        data.picUrl = picUrl;
        data.content = content;
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //layer.closeAll(); //关闭所有层
                    layer.msg("操作成功！");
                    window.location.href="/changePage?page=website/route";
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 预览
    $("#preData").click(function () {
        layer.open({
            type: 1 //此处以iframe举例
            , title: '预览'
            , area: ['590px', '460px']
            , shade: 0
            , maxmin: true
            , content: $('#preContent')
            , zIndex: layer.zIndex
            , success: function (layero) {
                layer.setTop(layero); //层置顶
                // var content = layedit.getContent(index);
                var content = editorTool.getContent();
                $("#content").html(content);
            }
        });
    });
    $("#cancel").click(function () {
        window.location.href="/changePage?page=website/route";
    });
    //todo 文本编辑器
    editorTool.wangEditorTool();
});