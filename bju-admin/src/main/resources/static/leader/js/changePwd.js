/**
 * Created by zhuxq on 2019/9/12.
 */
layui.config({
    base: "/leader/js/"
}).use(['jquery', 'layer', 'form'], function () {
    var $ = layui.jquery
        , layer = layui.layer
        , form = layui.form;
    // 表单提交
    form.on('submit(submitData)', function (data) {
        var oldPwd = $("#oldPwd").val();
        var newPwd = $("#newPwd").val();
        var surePwd = $("#surePwd").val();
        if(oldPwd==""||oldPwd==undefined){
            layer.msg('请输入原始密码！', {icon: 5});
        }else if (newPwd==""||newPwd==undefined){
            layer.msg('请输入新密码！', {icon: 5});
        }else if (surePwd==""||surePwd==undefined){
            layer.msg('请输入确认新密码！', {icon: 5});
        }else {
            if(newPwd!=surePwd){
                layer.msg('确认密码与新密码不一致！', {icon: 5});
            }else{
                var params={};
                params.oldPwd = hex_md5(oldPwd);
                params.newPwd = hex_md5(newPwd);
                $.ajax({
                    type: "post",
                    url: "/leaderLeader/ckoldpwd",
                    dataType: "json",
                    data: params,
                    success:function(response){
                        if(response.code==200){
                            layer.msg("修改成功", {icon: 1});
                            $("#oldPwd").val("");
                            $("#newPwd").val("");
                            $("#surePwd").val("");
                        }else {
                            layer.msg(response.message, {icon: 5});
                        }

                    }
                });
            }
        }

        // if (data.field.newPwd !== data.field.surePwd) {
        //     layer.msg('两次新密码输入不一致', {icon: 5});
        // } else {
        //     // 前端测试代码，正式删掉。
        //     layer.alert(JSON.stringify(data.field), {
        //         title: '最终的提交信息'
        //     }, function () {
        //         layer.closeAll(); //关闭所有层
        //     });
        // }
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});