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

    //layer.msg('账号重复',{icon:2});
    //layer.msg('请输入正确的身份证号',{icon:2});
    var leaderId = $("[name=id]").val();

    var myObj = new Object();
    getCurrentTime();
    function getCurrentTime() {
        $.ajax({
            url: "/getCurrentTime",
            type: "GET",
            success: function (res) {
                if (res.code == 200) {
                    window.sessionStorage.setItem("currentTime",res.data);
                    myObj.currentTime = res.data;
                    myObj.year = myObj.currentTime.split(" ")[0].split("-")[0]+"年"+myObj.currentTime.split(" ")[0].split("-")[1]+"月"+
                        myObj.currentTime.split(" ")[0].split("-")[2]+"日";
                    var a = new Array("日", "一", "二", "三", "四", "五", "六");
                    var week = new Date(myObj.currentTime).getDay();
                    var str = "星期" + a[week];
                    myObj.nowWeek = str;
                    $("#myYear").html(myObj.year);
                    $("#myWeek").html(myObj.nowWeek);
                } else {
                    layer.alert("未知错误");
                }
            },
            dataType: "json"
        });
    }

    // if(new Date(currentTime).getTime()-new Date(res.list[i].createTime).getTime()>680400*1000){
    //     res.list[i].isNew = false;
    // }
    form.verify({
        checkDate:function () {
            console.log(myObj.currentTime);
            var nowTime = myObj.currentTime.split(" ")[0].split("-")[0]+myObj.currentTime.split(" ")[0].split("-")[1]+
                myObj.currentTime.split(" ")[0].split("-")[2];
            var birthday = $("[name=birthday]").val().split("-")[0]+$("[name=birthday]").val().split("-")[1]+$("[name=birthday]").val().split("-")[2];
            if(birthday>nowTime){
                return "出生日期不能大于当前日期";
            }
        }
    });
    if(leaderId != undefined && leaderId != ''){
        //回显
        getLeaderInfo();
    }

    function getLeaderInfo(){
        $.ajax({
            url: '/leaderLeader/getLeaderInfo',
            type: "GET",
            data: {"id":leaderId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    form.val("layform",{
                        "username":res.data.username,
                        "name":res.data.name,
                        "sex":res.data.sex,
                        "birthday":res.data.birthday,
                        "IDCard":res.data.idcard,
                        "guideNum":res.data.guideNum,
                    });
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 监听提交
    form.on('submit(submitData)', function (data) {
        if(leaderId != undefined && leaderId != ''){
            //编辑
            updateLeader(data.field);
        }else{
            //添加
            addLeader(data.field);
        }
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
                    window.location.href="/changePage?page=user/leader";
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //编辑
    function updateLeader(data){
        $.ajax({
            url: '/leaderLeader/update',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //layer.closeAll(); //关闭所有层
                    //layer.msg("编辑成功");
                    window.location.href="/changePage?page=user/leader";
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //取消
    $("#cancel").click(function () {
        window.location.href="/changePage?page=user/leader";
    });
});