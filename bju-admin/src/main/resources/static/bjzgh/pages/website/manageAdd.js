/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'fileUpload', 'layedit'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , layedit = layui.layedit
        , fileUpload = layui.fileUpload;//自定义文件上传


    //编辑器上传图片
    layedit.set({
        uploadImage: {
            url: '/uploadLayUI?towPath=pic'//接口url
        }
    });
    //编辑器
    // var editorIndex = layedit.build('editor');
    var active = {
        content: function () {
            alert(layedit.getContent(editorIndex));// 获取编辑器内容
        }
    };
    //获取省
    getProvinceList();

    var sanatoriumId = $("[name=id]").val();
    if(sanatoriumId != undefined && sanatoriumId != ''){
        //回显
        getSanatoriumIdInfo();
    }
    function getSanatoriumIdInfo(){
        $.ajax({
            url: '/sanatoriumSanatorium/' + sanatoriumId ,
            type: "GET",
            //data: {"id":sanatoriumId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //区县
                    var areaData = getAreaById(res.data.pid);
                    var areaOption = '<option value="">请选择区县</option>';
                    for(var i = 0; i < areaData.length; i++){
                        areaOption += '<option value='+ areaData[i].id +'>'+ areaData[i].regionName +'</option>';
                    }
                    $("[name=cId]").html(areaOption);

                    form.val("layform",{
                        "name":res.data.name,
                        "pId":res.data.pid,
                        "cId":res.data.cid,
                        "brief":res.data.brief,
                    });
                    $("[name=picUrl]").attr("src",res.data.picUrl);
                    // layedit.setContent(editorIndex, res.data.content, false);
                    editorTool.setContent(res.data.content);
                    form.render();

                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //上传图片
    fileUpload.picture({
        elem: "#upload",
        url:"/upload",//上传接口
        obj:{"towPath":"sanatorium"},//额外参数
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


    // 监听提交
    form.on('submit(submitData)', function (data) {
        $("[name=sureButton]").attr("disabled","disabled");
        if(sanatoriumId != undefined && sanatoriumId != ''){
            //编辑
            updateSanatorium(data.field,'/sanatoriumSanatorium/update');
        }else{
            //添加
            updateSanatorium(data.field,'/sanatoriumSanatorium/save');
        }
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //添加&编辑
    function updateSanatorium(data,url){

        // var content = layedit.getContent(editorIndex);
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
                    window.location.href="/changePage?page=website/manage";
                } else {
                    $("[name=sureButton]").removeAttr("disabled");
                    $("[name=sureButton]").attr("enabled","enabled");
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
                var content = editorTool.getContent();
                $("#content").html(content);
            }
        });
    });

    $("#cancel").click(function () {
        window.location.href="/changePage?page=website/manage";
    });

    //获取省
    function getProvinceList() {
        $.ajax({
            type:"GET",
            //data:data,
            url:"/sysArea/pList",
            success:function(data){
                if(data.code == 200){
                    var result = data.data;
                    var value = '<option value="">请选择省</option>';
                    for(var i = 0; i < result.length; i++){
                        value += '<option value='+ result[i].id +'>'+ result[i].regionName +'</option>';
                    }
                    $("[name=pId]").html(value);
                    form.render();
                }else{
                    layer.msg(data.message);
                }
            }, async:false
        });
    }
    //通过省id获取市
    form.on('select(pId)', function (data) {
        $("[name=cId]").html('<option value="">请选择市</option>');
        form.render();
        if(data.value != ""){
            var arr = getAreaById(data.value);
            var value = '<option value="">请选择市</option>';
            for(var i = 0; i < arr.length; i++){
                value += '<option value='+ arr[i].id +'>'+ arr[i].regionName +'</option>';
            }
            $("[name=cId]").html(value);
            form.render();
        }
        return false;
    });
    function getAreaById(id) {
        var result;
        var data = {
            "pid":id
        }
        $.ajax({
            type:"GET",
            data:data,
            url:"/sysArea/cList",
            success:function(data){
                if(data.code == 200){
                    result = data.data;
                }else{
                    layer.msg(data.message);
                }
            }, async:false

        });
        return result;
    }
    //todo 文本编辑器
    editorTool.wangEditorTool();
});