layui.config({
    base : "/js/"
}).use(['form','jquery'],function(){
    var form = layui.form,
        $ = layui.jquery;

    function seeDetail(){
        $.ajax({
            url:"/sysNews/getById" ,
            type:"GET" ,
            data:{"newsId":$("[name='newsId']").val()},
            success:function (res) {
                if(res.code==200){
                    $("[name='title']").html(res.data.title);
                    var myHtml = '';
                    var option1 = '<span>文章来源：'+res.data.source+'</span>';
                    var option2 = '<span>编辑：'+res.data.author+'</span>';
                    var option3 = '<span>时间：'+res.data.createTime+'</span>';
                    myHtml = option1+option2+option3;
                    $("[name='newsInfo']").html(myHtml);
                    $("[name='content']").html(res.data.content);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    seeDetail();
    //页面渲染完成后获取bady的高度赋值给iframe
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);


});