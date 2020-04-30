layui.config({
    base : "../../js/"
}).use(['form','jquery','layer','projectile','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,projectile = layui.projectile//自定义弹框
        ,ajax = layui.ajax //自定义请求数据
        ,examineType = examineStatus; //审核状态1为未审核、2为审核中、3为审核通过、4为审核未通过


    $(".examineType").attr("src","/img/examine_"+ examineType +".png");
    if(examineType==4){
        ajax.request("/enterpriseExamine/getExamineList?id="+id,"GET","",function(res){
            $("#examineMsg").html(res[0].message);
            $("#examineTime").html(res[0].createTime);
            $("#notPass").show();
        });
    }


    //点击提交审核---监听submit提交
    form.on("submit(addNews)",function(data){
        if(examineType==3){
            projectile.tips({content:$("#registered"),area: ['416px','170px']},function () {
                //弹框---点击确认修改
                $("#define").click(function () {
                    layer.closeAll();
                    window.location.href="/enterpriseEnterprise/information?pageFlag=true";
                });
            });
        }else{
            window.location.href="/enterpriseEnterprise/information?pageFlag=true";
        }
        return false; //阻止表单跳转
    });
    //弹框---点击再想想
    $("#cancel").click(function () {
        layer.closeAll();
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});