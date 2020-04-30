/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "/bjzgh/js/"
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
            url: '/uploadLayUI?towPath=notic'//接口url
        }
    });

    //图片地址
    var  nocUrl = $("[name=preview]").attr("src");

    //编辑器
    // var index = layedit.build('editor');
    var active = {
        content: function () {
            console.log(layedit.getContent(index));
            alert(layedit.getContent(index));// 获取编辑器内容
        }
    };

    var myObj = {};
    myObj.id = $("#newsId").val();
    function addOrUpdate(){
        if( myObj.id != undefined){
            $.ajax({
                url:"/sysNews/toUpdate" ,
                type:"GET" ,
                data:{"id":myObj.id},
                success:function (res) {
                    if(res.code==200){
                        $("[name=title]").val(res.data.title);
                        $("[name=kind]").val(res.data.type);
                        $("[name=name]").val(res.data.author);
                        $("[name=where]").val(res.data.source);
                        $("[name=preview]").attr("src",res.data.image);
                        // layedit.setContent(index, res.data.content, false);
                        editorTool.setContent(res.data.content);
                        form.render();
                    }else {
                        layer.alert(res.message);
                    }
                } ,
                dataType:"json"
            });
        }
    }
    addOrUpdate();
    // 监听所属分类下拉框。选择首页banner和新闻公告banner时，出现列表配图。
    form.on('select(kind)', function (data) {
        console.log(data.value); //得到被选中的值
        if (data.value == 3 || data.value == 4) {
            $("#picture").css('display', 'block');
        } else {
            $("#picture").css('display', 'none');
        }
    });
    //上传图片
    //上传图片
    fileUpload.picture({
        elem: "#upload",
        url:"/upload",//上传接口
        obj:{"towPath":"notic"},//额外参数
        accept:"image",
        size:1024
    }, function(res, index, upload){  //执行上传请求后的回调
        if(res.code == "200"){
            layer.closeAll('loading'); //关闭loading
            $("[name=preview]").attr("src",res.data);
            layer.msg("上传成功！");
        }else{
            layer.msg(res.message);
            layer.closeAll('loading'); //关闭loading
        }
    });
    // 监听提交
    form.on('submit(submitData)', function (data) {
        $("#mySubmit").attr("disabled","disabled");
        var params = new Object();
        params.source = data.field.where;
        params.title = data.field.title ;
        params.type = data.field.kind;
        //params.file = ;
         params.content = editorTool.getContent();
        params.author = data.field.name;
        params.image = $("[name=preview]").attr("src");
        var myUrl = "";
        if(myObj.id != undefined){
            params.id = myObj.id;
            myUrl = "/sysNews/update"
        }else {
            myUrl = "/sysNews/add"
        }
        $.ajax({
            url:myUrl ,
            type:"POST" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    window.location.href="route?name=website/news"
                }else {
                    $("#mySubmit").removeAttr("disabled");
                    $("#mySubmit").attr("enabled","enabled");
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
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
                $("#preContent").html(editorTool.getContent());
                layer.setTop(layero); //层置顶
            }
        });
    });
    form.verify({
        neirong: function (value) {
            var split = value.split("");
            var content = editorTool.getContent();
            if(content.trim()=='' || content==undefined){
                return "正文内容不能为空";
            }
        }
    });
    //todo 文本编辑器
    editorTool.wangEditorTool();
});