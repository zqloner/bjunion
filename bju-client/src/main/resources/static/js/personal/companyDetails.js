layui.config({
    base : "/js/"
}).use(['form','jquery','layer','projectile','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,ajax = layui.ajax; //自定义请求数据

    //点击返回
    $("#revert").click(function () {
        window.location.href="/route?name=personal/enterprises&switchType=2";
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});