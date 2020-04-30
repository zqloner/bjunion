layui.config({
    base: "/js/"
}).use(['form', 'jquery', 'laytpl', 'carousel', 'ajax'], function () {
    var form = layui.form,
        $ = layui.jquery
        , laytpl = layui.laytpl
        , carousel = layui.carousel
        , ajax = layui.ajax //自定义请求数据
        , isLog = window.sessionStorage.getItem("isLog") //判断是否登录0为未登录，1为已登录
        , url = "";

    var currentTime = sessionStorage.getItem("currentTime");

    //点击快速通道报名入口
    $(".signUp").click(function () {
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
            parent.tools.signUp("route?name=signUp/enroll",index );
        }

    });


    //点击banner
    $("body").on('click','.bannerSwitch',function () {
        window.location.href = "route?name=newsBulletin/newsDetails&newsId=" + $(this).data("id");

    });
    //到新闻公告详情页
    $(".switch").click(function () {
        console.log($(this).data("id"));
        parent.tools.communal('新闻公告');
        window.location.href = "route?name=newsBulletin/newsDetails&newsId=" + $(this).data("id");
    });

    //渲染页面
    function journalism(data) {
        // 新闻公告
        // var getTpl = newsBulletin.innerHTML
        //     ,view = document.getElementById('newsList');
        // laytpl(getTpl).render(data.news, function(html){
        //     view.innerHTML = html;
        // });
        // // 精品路线
        // var getRoute = route.innerHTML
        //     ,routeView = document.getElementById('routeView');
        // laytpl(getRoute).render(data.route, function(html){
        //     routeView.innerHTML = html;
        // });
        //
        // // 疗休养点
        // var getBase = base.innerHTML
        //     ,baseView = document.getElementById('baseView');
        // laytpl(getBase).render(data.base, function(html){
        //     baseView.innerHTML = html;
        // });
        //
        // // 页面渲染完成后获取bady的高度赋值给iframe
        // parent.tools.redefinition($(".childrenBody").height());
    }

    //加载数据
    getCadreList();

    function getCadreList(pageNumber, pageSize) {
        //数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: "/sysHome/list",
            type: "GET",
            success: function (res) {
                if (res.code == 200) {
                    if (res.data.news != 0) {
                        var news = [];   //新闻和公告
                        var sban = [];   //首页banner
                        var gban = [];    //公告banner
                        for (var i = 0; i < res.data.news.length; i++) {
                            if (res.data.news[i].type == 1 || res.data.news[i].type == 2) {
                                if (news.length < 7) {
                                    news.push(res.data.news[i]);
                                }
                            }
                            if (res.data.news[i].type == 3) {
                                sban.push(res.data.news[i]);
                            }
                            if (res.data.news[i].type == 4) {
                                gban.push(res.data.news[i]);
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
                        //首页
                        var sbanHtml = '';
                        if (sban.length > 0) {
                            if(sban.length > 3) {
                                for (var i = 0; i < 3; i++) {
                                    sbanHtml += '<div class="bannerSwitch" data-id="' + sban[i].id + '"><img src="' + sban[i].image + '" alt=""></div>'
                                }
                            }else {
                                for (var i = 0; i < sban.length; i++) {
                                    sbanHtml += '<div class="bannerSwitch" data-id="' + sban[i].id + '"><img src="' + sban[i].image + '" alt=""></div>'
                                }
                            }
                        }
                        //公告
                        var gbanHtml = '';
                        if (gban.length > 0) {
                            if(gban.length > 3) {
                                for (var i = 0; i < 3; i++) {
                                    gbanHtml += '<div class="bannerSwitch" data-id="' + gban[i].id + '" style="background-image: url(' + gban[i].image + ')"></div>'
                                }
                            }else {
                                for (var i = 0; i < gban.length; i++) {
                                    gbanHtml += '<div class="bannerSwitch" data-id="' + gban[i].id + '" style="background-image: url(' + gban[i].image + ')"></div>'
                                }
                            }
                        }
                        $("[name='souyeBanner']").html(sbanHtml);
                        $("[name='gonggaoBanner']").html(gbanHtml);
                        // 新闻公告
                        var getTpl = newsBulletin.innerHTML
                            , view = document.getElementById('newsList');
                        laytpl(getTpl).render(news, function (html) {
                            view.innerHTML = html;
                        });
                        // 精品路线
                        var getRoute = route.innerHTML
                            , routeView = document.getElementById('routeView');
                        laytpl(getRoute).render(res.data.lines, function (html) {
                            routeView.innerHTML = html;
                        });

                        // 疗休养点
                        var getBase = base.innerHTML
                            , baseView = document.getElementById('baseView');
                        laytpl(getBase).render(res.data.sanatoriums, function (html) {
                            baseView.innerHTML = html;
                        });
                        //banner轮播图
                        carousel.render({
                            elem: '#test1'
                            , height: '360px'
                            , width: '100%'
                        });
                        //新闻公告轮播图
                        carousel.render({
                            elem: '#test2'
                            , height: '358px'
                            , width: '538px'
                        });
                    }
                }
            },
            dataType: "json"
        });

    }

    //更多
    $(".more").click(function () {
        if ($(this).data("type") == "news") {
            parent.tools.communal('新闻公告');
        } else if ($(this).data("type") == "route") {
            parent.tools.communal('疗养路线');
        } else if ($(this).data("type") == "base") {
            parent.tools.communal('休养基地');
        }
        window.location.href = $(this).data("href");
    });

    //到新闻公告详情页
    $("#newsList").on('click', '.notice_li', function () {
        console.log($(this).data("id"));
        parent.tools.communal('新闻公告');
        window.location.href = "route?name=newsBulletin/newsDetails&newsId=" + $(this).data("id");
    });
    //到精品路线详情页
    $("#routeView").on('click', '.route_li', function () {
        console.log($(this).data("id"));
        parent.tools.communal('疗养路线');
        window.location.href = "route?name=route/routeDetails&id=" + $(this).data("id");
    });
    //到疗休养点详情页
    $("#baseView").on('click', '.base_li', function () {
        console.log($(this).data("id"));
        parent.tools.communal('休养基地');
        window.location.href = "route?name=base/baseDetails&id=" + $(this).data("id");
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    }, 200);
});
