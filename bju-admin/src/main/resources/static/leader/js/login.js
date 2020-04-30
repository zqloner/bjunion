layui.config({
    base: "/leader/js/"
}).use(['form', 'layer', 'jquery','element'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        element = layui.element;
    // 管理员登录
    form.on('submit(adminLogin)', function (data) {
        // 前端测试代码，正式删掉。
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        }, function () {
            window.location.href="main.html";
            layer.closeAll(); //关闭所有层
        });
        //layer.msg('用户名或密码错误');
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    // 领队登录
    form.on('submit(leaderLogin)', function (data) {

        var username = data.field.leaderID;
        var password = data.field.leaderPWD;
        if(username == "" ){
            layer.msg("用户名不能位空");
            return false;
        }
        if(password == "" ){
            layer.msg("密码不能位空");
            return false;
        }
        adminLogin(username, password);
        //layer.msg('用户名或密码错误');
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    $(".forgetPwd").click(function(){
        $(".reset-pwd").css('display','block');
    });
    $(".sure-btn").click(function(){
        $(".reset-pwd").css('display','none');
    });
    function adminLogin(username,password) {
        $.ajax({
            url:"/leaderlogin" ,
            type:"post" ,
            data:{"username":username,"password":hex_md5(password)},
            success:function (res) {
                if(res.code==200){
                    window.location.href="/leaderLeader/tomain";
                    layer.closeAll(); //关闭所有层
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
});
