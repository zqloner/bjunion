layui.config({
    base : "../../js/"
}).use(['form','layer','jquery','projectile','ajax'],function(){
    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,projectile = layui.projectile //自定义弹框
        ,ajax = layui.ajax; //自定义请求数据

    //获取验证码
    $("#authentication").click(function () {
        var wait = 60;
        var number = $("input[name='phone']").val();
        if(number==''){
            layer.msg("手机号不能为空！");
        }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(number))){
            layer.msg("手机号码有误，请重填");
            return false;
        }else {
            //数据加载中loading
            // parent.tools.load();

            // ajax.request('http://192.168.1.231:9982','GET','',function(res){
                layer.msg('发送成功！');
                $("#authentication").text('60s重新获取').attr('disabled',true).addClass('layui-btn-danger');
                timerEmail = setInterval(function(){
                    if(wait==0){
                        $('#authentication').text('获取验证码').attr('disabled',false).removeClass('layui-btn-danger');
                        clearInterval(timerEmail);
                    }else{
                        wait--;
                        $("#authentication").text(wait+'s重新获取');
                    }
                },1000);
                //删除loding
                // parent.tools.stop();
            // });
        }
    });
    //点击返回登录
    $(".returnLogin").click(function () {
        parent.tools.callMethod("page/home/home.html");
    });
    //点击下一步
    form.on('submit(addNews)', function(data){
        if(data.field.phone==''){
            layer.msg('手机号不能为空',{icon: 5});
            return false;
        }else if(data.field.verification==''){
            layer.msg('验证码不能为空',{icon: 5});
            return false;
        }else{
            $("#forgetPassword").hide();
            $("#resetPassword").show();
        }
        return false; //阻止表单跳转。
    });

    //点击确认修改
    form.on('submit(confirmation)', function(data){
        if(data.field.newPassword != data.field.confirmPassword){
            layer.msg('两次输入的新密码不同',{icon: 5})
        }else{
            //表单初始值
            form.val("resetPassword", {
                "newPassword": ''
                ,"confirmPassword": ''
            });
            // layer.msg('修改成功！',{icon: 6});
            //密码修改成功
            projectile.tips({content:$("#registered"),area: ['416px','170px']},function () {});
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
});
