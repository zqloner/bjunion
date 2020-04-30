layui.config({
    base : "../../js/"
}).use(['form','jquery','ajax'],function(){
    var form = layui.form,
        ajax = layui.ajax //自定义请求数据
        $ = layui.jquery;


    getById();
    function getById() {
        var id = $("#myRoute").val();
        $.ajax({
            url:"/lineLine/"+id,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    $("[name=myContent]").html(res.data.content);
                    $("[name=myRouteName]").html(res.data.name);
                    form.render();
                    //页面渲染完成后获取bady的高度赋值给iframe
                    setTimeout(function () {
                        parent.tools.redefinition($(".childrenBody").height());
                    },100);
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });

    }
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    }, 100);
});