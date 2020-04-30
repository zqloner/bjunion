/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form;

    var leaderId = $("[name=id]").val();
    getLeaderInfo();
    function getLeaderInfo(){
        $.ajax({
            url: '/leaderLeader/getLeaderInfo',
            type: "GET",
            data: {"id":leaderId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    $("#username").text(res.data.username);
                    $("#name").text(res.data.name);
                    $("#sex").text(res.data.sex == 0 ? '女':'男');
                    $("#age").text(res.data.age);
                    $("#idcard").text(res.data.idcard);
                    $("#guideNum").text(res.data.guideNum);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

});