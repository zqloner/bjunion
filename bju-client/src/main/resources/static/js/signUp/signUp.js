layui.config({
    base : "/js/"
}).use(['form','jquery','laytpl'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,laytpl = layui.laytpl;
    var currentTime = sessionStorage.getItem("currentTime");

    var station = [
        {"name": "北京市总工会召开2019年疗休养劳模职工座谈会模职工座谈会", "date": "2019年09月25日", "id": '1', "isNew": true},
        {"name": "北京市总工会召开2019年疗休养劳模职工座谈会模职工座谈会", "date": "2019年09月25日", "id": '2', "isNew": true},
        {"name": "北京市总工会召开2019年疗休养劳模职工座谈会模职工座谈会", "date": "2019年09月25日", "id": '3', "isNew": false}
    ];

    getCaderList();
    function getCaderList(){
        $.ajax({
            url: "/sysHome/list",
            type: "GET",
            success: function (res) {
                if (res.code == 200) {
                    if (res.data.news != 0) {
                        var news = [];   //新闻和公告
                        for (var i = 0; i < res.data.news.length; i++) {
                            if (res.data.news[i].type == 1 || res.data.news[i].type == 2) {
                                if (news.length < 3) {
                                    news.push(res.data.news[i]);
                                }
                            }
                        }
                        for(var i=0;i<news.length;i++){
                            new Date(currentTime).getTime();
                            new Date(news[i].createTime).getTime();
                            if(new Date(currentTime).getTime()-new Date(news[i].createTime).getTime()>680400*1000){
                                news[i].isNew = false;
                            }else {
                                news[i].isNew = true;
                            }
                        }
                        // 新闻公告
                        var getTpl = newsBulletin.innerHTML
                            , view = document.getElementById('newsList');
                        laytpl(getTpl).render(news, function (html) {
                            view.innerHTML = html;
                        });
                    }
                }
            },
            dataType: "json"
        });
    }
    //更多
    $(".more").click(function () {
        parent.tools.communal('新闻公告');
        window.location.href="route?name=newsBulletin/newsBulletin";
    });
    //到本站公告详情页
    $("#newsList").on('click','.notice_li',function () {
        console.log($(this).data("id"));
        parent.tools.communal('新闻公告');
        window.location.href="route?name=newsBulletin/newsDetails&newsId="+$(this).data("id");
    });
    //点击报名入口
    $(".backdrop").click(function () {
        if (window.sessionStorage.getItem("isLog") == 0 || window.sessionStorage.getItem("isLog")== null) {
            window.sessionStorage.setItem("lmINdex", $(this).data("index"));
            parent.tools.login();
        } else if (window.sessionStorage.getItem("isLog")==1) {
            var index =$(this).data("index");
            if(index == 0 && window.sessionStorage.getItem("modelStatus") == 0){
                layer.msg("权限不符合要求，请联系有报名权限的区级工会人员！");
                return false;
            }
            parent.tools.communal('疗休养报名');
            parent.tools.signUp("route?name=signUp/enroll&index="+index);
        }
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },500);
});