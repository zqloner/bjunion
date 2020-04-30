/**
 * Created by zhuxq on 2019/9/12.
 */
layui.config({
    base: "../../js/"
}).use(['jquery', 'layer', 'form'], function () {
    var $ = layui.jquery
        , layer = layui.layer
        , $ = layui.jquery
        , form = layui.form;
    // 表单提交
    form.on('submit(submitData)', function (data) {
        var oldPwd = data.field.oldPwd;
        if(oldPwd == ""){
            layer.alert("原始密码不能位空", {icon: 5});
            return false;
        }
        var newPwd = data.field.newPwd;
        var surePwd = data.field.surePwd;
        if (newPwd !== surePwd) {
            layer.msg('两次新密码输入不一致', {icon: 5});
        } else {
            changePwd(oldPwd,newPwd);
        }
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    function changePwd(oldPwd,newPwd) {
        $.ajax({
            url:"/sysAdmin/updatePwd" ,
            type:"post" ,
            data:{"oldPwd":hex_md5(oldPwd),"newPwd":hex_md5(newPwd)},
            success:function (res) {
                if(res.code==200){
                    layer.msg("修改成功！");
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
});