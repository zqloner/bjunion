layui.config({
    base : "../../js/"
}).use(['form','jquery','ajax'],function(){
    var form = layui.form
        ,ajax = layui.ajax, //自定义请求数据
        $ = layui.jquery;


    getById();
    function getById() {
        var id = $("#baseId").val();
        var url = "/sanatoriumSanatorium/"+id;
        ajax.request(url,'GET',"",function(res){
            $("#content").html(res.content);
            $("#name").html(res.name);
            //页面渲染完成后获取bady的高度赋值给iframe
            setTimeout(function () {
                parent.tools.redefinition($(".childrenBody").height());
            },100);
        });
    }
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    }, 200);
});