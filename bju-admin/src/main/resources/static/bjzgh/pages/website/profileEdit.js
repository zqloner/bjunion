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
        , fileUpload = layui.fileUpload;//自定义文件上传

    //编辑器
    layedit.set({
        uploadImage: {
            url: '/uploadLayUI?towPath=pic', //接口url
        }
    });

    //编辑器
    // var editorIndex = layedit.build('editor');
    var active = {
        content: function () {
            console.log(layedit.getContent(editorIndex));// 获取编辑器内容
        }
    };
    //回显
    var id = $("[name=id]").val();
    getById();
    function getById(){
        $.ajax({
            url: '/sanatoriumBrief/getById',
            type: "GET",
            data: {"id":id},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    // layedit.setContent(editorIndex, res.data.content, false);
                    editorTool.setContent(res.data.content);
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
                // var content = layedit.getContent(editorIndex);
                var content = editorTool.getContent();
                $("#content").html(content);
            }
        });
    });

    // 监听提交
    form.on('submit(submitData)', function (data) {
        var content = editorTool.getContent();
        data.field.content = content;
        $.ajax({
            url: '/sanatoriumBrief/update',
            type: "POST",
            data: data.field,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //layer.closeAll(); //关闭所有层
                    layer.msg("编辑成功！");
                    window.location.href = "/changePage?page=website/profile";
                } else {
                    layer.msg(res.message);
                }
            }
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //todo 文本编辑器
    editorTool.wangEditorTool();
});