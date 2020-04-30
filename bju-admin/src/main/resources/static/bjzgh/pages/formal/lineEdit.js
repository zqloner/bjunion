/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "../../js/"
}).use(['jquery', 'table', 'layer', 'form','transfer', 'layedit','hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , transfer = layui.transfer
        , layedit = layui.layedit
        , hour = layui.hour;

    // 渲染穿梭框
    transfer.render({
        elem: '#company'  //绑定元素
        ,title: ['全部单位名称', '全部单位名称']  //自定义标题
        ,data: [
            {"value": "1", "title": "单位名称1", "disabled": "", "checked": ""}
            ,{"value": "2", "title": "单位名称2", "disabled": "", "checked": ""}
            ,{"value": "3", "title": "单位名称3", "disabled": "", "checked": ""}
        ]
        ,height: 210 //定义高度
        ,id:'company'//定义索引
    });
    //获得右侧数据
    var getData = transfer.getData('company');

    // 监听提交
    form.on('submit(submitData)', function (data) {
        // 前端测试代码，正式删掉。
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        }, function () {
            layer.closeAll(); //关闭所有层
            window.location.href = "../../../../templates/bjzgh/formal/line.html";
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    $("#cancel").click(function () {
        window.location.href="../../../../templates/bjzgh/formal/line.html";
    });
});