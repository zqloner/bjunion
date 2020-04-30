/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'layer', 'form','hour'], function () {
    var $ = layui.jquery
        , layer = layui.layer
        , form = layui.form
        , hour = layui.hour;//自定义时间选择


    var formalId = $("[name=formalId]").val();


    // 监听提交
    form.on('submit(submitData)', function (data) {
        //添加
        addLeader(data.field);
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //添加
    function addLeader(data){
        $.ajax({
            url: '/leaderLeader/add',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //layer.closeAll(); //关闭所有层
                    //layer.msg("添加成功");
                    // window.location.href = "/changePageParam?page=order/leaderAdd&data=" + formalId;
                    window.location.href = "/changePage?page=order/leader";
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //取消
    $("#cancel").click(function () {
        // window.location.href = "/changePageParam?page=order/leaderAdd&data=" + formalId;
        window.location.href = "/changePage?page=order/leader";
    });
});