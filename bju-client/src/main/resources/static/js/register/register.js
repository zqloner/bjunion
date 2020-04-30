layui.config({
    base : "../../js/"
}).use(['form','layer','jquery','projectile'],function(){
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        isRegistered = false,//是否已注册
        projectile = layui.projectile;//自定义弹框

    //监听submit提交
    form.on('submit(addNews)', function(data){
        var params = {};
        if(data.field.newPassword != data.field.confirmPassword){
            layer.msg('两次输入的新密码不同',{icon: 5})
        }else{
            params.name = data.field.enterprise;
            params.account = data.field.account;
            params.password = hex_md5(data.field.newPassword);
            $.ajax({
                url: "/enterpriseEnterprise/save",
                type: "post",
                data: params,
                dataType:"json",
                success: function (res) {
                    if (res.code == "200") {
                        layer.msg('注册成功！',{icon: 6});
                        window.location.href="/"
                        // parent.location="/"
                    }else {
                        layer.msg(res.message,{icon: 5});
                    }
                }
            });
            // //表单初始值
            // form.val("modifyPassword", {
            //     "enterprise":''
            //     ,"account": ''
            //     ,"newPassword": ''
            //     ,"confirmPassword": ''
            // });
            // layer.msg('注册成功！',{icon: 6});
            // if(isRegistered){//已注册
            //     projectile.tips({content:$("#registered"),area: ['416px','170px']},function () {});
            // }else {
            //     window.sessionStorage.setItem("isLog",1);
            //     parent.tools.communal('');
            //     parent.tools.firstPersonal();
            // }
        }
        return false; //阻止表单跳转。
    });
    //点击取消
    $("#cancel").click(function () {
        layer.closeAll();
    });
    //点击确定
    $("#define").click(function () {
        layer.closeAll();
        parent.tools.callMethod("page/home/home.html");
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    parent.tools.redefinition($(".childrenBody").height());

    //表单校验
    form.verify({
        illegalChar:function (value) {
            var reg = /^[\@\#\$\%\^\&\*\(\)\{\}\:\"\<\>\?\[\]]$/;
            var split = value.split("");
            console.log(split);
            for(var i = 0;i < split.length;i++){
                if(reg.test(split[i])){
                    return "非法字符";
                }
            }
        },
        account:function(value){
            var reg = /^\w{6,20}$/;
            if(!reg.test(value)){
                return "用户名格式为6-20个字符,包括字母、数字、下划线";
            }
        },
    });
});
