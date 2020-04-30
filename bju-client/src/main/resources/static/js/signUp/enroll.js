layui.config({
    base : "../../js/"
}).use(['form','jquery'],function(){
    var form = layui.form,
        $ = layui.jquery;
    function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    if(getQuery("index")==0){
        $("#title").text('劳模报名');
        $("#alarm").text('劳模预报名');
        $("#formal").text('劳模正式报名');
    }else if(getQuery("index")==1){
        $("#title").text('优秀员工报名');
        $("#alarm").text('优秀员工预报名');
        $("#formal").text('优秀员工正式报名');
    }
    else if(getQuery("index")==2){
        $("#title").text('普通职工报名');
        $("#alarm").text('普通职工预报名');
        $("#formal").text('普通职工正式报名');
    }

    //预报名
    $("#forecastName").click(function () {
        if(window.sessionStorage.getItem("perfect") == 0){
            layer.msg("当前企业未通过审核！");
            return;
        }
        window.location.href="route?name=signUp/registrationList&isPre=0&typeId="+getQuery("index");
    });
    //正式报名
    $("#formalRegistration").click(function () {
        if(window.sessionStorage.getItem("perfect") == 0){
            layer.msg("当前企业未通过审核！");
            return;
        }
        window.location.href="route?name=signUp/registrationList&isPre=1&typeId="+getQuery("index");
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});