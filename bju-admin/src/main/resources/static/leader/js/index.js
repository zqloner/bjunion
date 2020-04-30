var $, tab, dataStr, layer;
layui.config({
    base: "/leader/js/"
}).extend({
    "bodyTab": "bodyTab"
});
layui.use(['bodyTab', 'form', 'element', 'layer', 'jquery', 'projectile'], function () {
    var form = layui.form
        , projectile = layui.projectile//自定义弹框
        , element = layui.element
        , $ = layui.$
        , layer = parent.layer === undefined ? layui.layer : top.layer;
    tab = layui.bodyTab({
        url: '/leader/json/nav.json'
    });
    var tools = {
        load: function () {
            layer.load(0, {shade: [0.2, '#000']});
        },
        stop: function () {
            layer.close(layer.load());
        }
    };
    window.tools = tools;  //向外暴露
    //获取左侧导航  注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
    tools.load();
    $.ajax({
        url: tab.tabConfig.url,
        success: function (res) {
            var data = res;
            if (data.length != 0) {
                dataStr = data;
                //重新渲染左侧菜单
                tab.render();
                tools.stop();
            }
        }
    });
    var name = $("#name").val();
    $("#showname").html(name);
    // 添加新窗口
    element.on('nav(filter)', function(elem){
        var url =$(this).data('url');
        sessionStorage.setItem("curmenu",url);
        $("#clildFrame").html('<iframe id="iframe" src="' + url + '"></iframe>');
    });

    $("#signOut").click(function () {
        layer.confirm('退出该平台？', {btn: ['确认', '取消']}, function () {
            window.location.href = "/logout"
        });
    });
});

//打开新窗口
function addTab(_this) {
    tab.tabAdd(_this);
}
/*
 {
 "title": "消息管理",
 "icon": "&#xe606",
 "spread": false,
 "href": "message.html"
 },*/