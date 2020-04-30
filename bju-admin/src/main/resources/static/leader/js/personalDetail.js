/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "/leader/js/"
}).use(['jquery', 'table', 'layer', 'form'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form;//自定义时间选择

    getLeaderDetail();//领队基本信息

    function getLeaderDetail() {
        $.ajax({
            type: "get",
            url: "/leaderLeader/getLeaderInfo",
            dataType: "json",
            data: null,
            success:function(response){
                var infos = response.data;

                var username = infos.username;
                $("#username").html(username);

                var name = infos.name;
                $("#name").html(name);

                var sex = infos.sex;
                if(sex==0){
                    $("#sex").html("女");
                }else {
                    $("#sex").html("男");
                }


                var IDCard = infos.idcard;
                $("#IDCard").html(IDCard);

                var guideNum = infos.guideNum;
                $("#guideNum").html(guideNum);

                var age = infos.age;
                $("#age").html(age);


            }
        });
    }
});