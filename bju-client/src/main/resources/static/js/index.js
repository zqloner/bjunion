var tab,dataStr;
layui.config({
    base : "./js/"
}).use(['form','element','projectile','bodyTab','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,ajax = layui.ajax //自定义请求数据
        ,element = layui.element //Tab的切换功能，切换事件监听等，需要依赖element模块
        //,perfect = 0//判断资料是否完善0为未完善，1为已完善
        ,county = 0//判断是否为区县0为区县，1为街道
        ,navigation = [] //路径导航
        ,projectile = layui.projectile //自定义弹框
        ,tab = layui.bodyTab();


    //长时间未登录。清除缓存
    if(noId){
        window.sessionStorage.clear();
        window.location.href = "/";
    }

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
    //注册方法
    var tools = {
        //注册全局loading
        load:function(){layer.load(0, {shade: [0.2,'#000']});},
        //关闭loading
        stop:function () {layer.close(layer.load());},
        callMethod:function (page) {
            $(".layui-main").show();
            $(".prompt").hide();
            $(".subject").css('border-top','none');
            getData(page);
            tools.login();
        },
        communal:function(data){
            $(".top_menu .layui-nav-item").each(function (res) {
                if ($(this).text() == data) {
                    $(this).addClass('layui-this');
                }else {
                    $(this).removeClass('layui-this');
                }
            });
        },
        redefinition:function (high) {$("iframe").height(high);},
        signUp:function (page) {
            console.log(page);
            window.sessionStorage.setItem("menu",JSON.stringify({href:page,side:true}));
            navigation = ['疗休养报名'];
            for(var i=0;i<navs.enlist.length;i++){
                if(navs.enlist[i].href==page){
                    navs.enlist[i].spread = true;
                    navigation.push(navs.enlist[i].title);
                }else {
                    navs.enlist[i].spread = false;
                }
            }
            current(page);
            tools.breadcrumb(navigation);
            dataStr = window.sessionStorage.getItem("modelStatus") == 0 ? navs.enlist.slice(1) : navs.enlist;
            tab.render();
        },
        personal:function (page) {
            current(page);
            window.sessionStorage.setItem("menu",JSON.stringify({href:page,side:true}));
            if(window.sessionStorage.getItem("county")==0){
                if(window.sessionStorage.getItem("perfect")==1){
                    navs.county[0].children[0].href = "/enterpriseEnterprise/information";
                }
                dataStr = navs.county;
            }else if(window.sessionStorage.getItem("county")==1){
                dataStr = navs.personal;
            }
            tab.render();
        },
        firstPersonal:function(){
            if(window.sessionStorage.getItem("isLog") == 1){
                $("#enroll").hide();
                $("#isLog").show();
                $(".layui-main").show();
                $(".prompt").hide();
                $(".subject").css('border-top','none');
                if(window.sessionStorage.getItem("perfect")==0){
                    window.sessionStorage.getItem("county")==0?navigation = ['个人中心','企业管理','我的企业资料'] : navigation = ['个人中心','企业管理','企业资料'];
                    tools.personal("/enterpriseEnterprise/information");
                }else if(window.sessionStorage.getItem("perfect")==1){
                    if(window.sessionStorage.getItem("county")==0){
                        navigation = ['个人中心','企业管理','我的企业资料'];
                        navs.county[0].children[0].href = "/enterpriseEnterprise/information";
                    }else if(window.sessionStorage.getItem("county")==1){
                        navigation = ['个人中心','企业管理','企业资料'];
                        navs.personal[0].children[0].href = "/enterpriseEnterprise/information";
                    }
                    tools.personal("/enterpriseEnterprise/information");
                }
                tools.breadcrumb(navigation);
            }
        },
        //当未登录时，弹出登录框
        login:function() {
            if(window.sessionStorage.getItem("isLog")==1){
                $("#enroll").hide();
                $("#isLog").show();
            }else {
                logging();
                $("#enroll").show();
                $("#isLog").hide();
            }
        },
        //路径导航
        breadcrumb:function (data) {
            window.sessionStorage.setItem("navigation",JSON.stringify(data));
            var pathList = '<a href="javascript:;">当前位置</a><span lay-separator="">：</span>';
            for(var i=0;i<data.length;i++){
                if(i==data.length-1){
                    pathList+='<a href="javascript:;"><cite>'+data[i]+'</cite></a>'
                }else {
                    pathList+='<a href="javascript:;">'+data[i]+'</a><span lay-separator="">/</span>'
                }
            }
            $("#breadcrumb").html(pathList)
        }
    };
    window.tools = tools;  //向外暴露
    //当未登录时，弹出登录框
    // tools.login();
    //初始化调用
    function getData(json){
        console.log(json);
        $("#clildFrame").html('<iframe id="iframe" src="'+json+'"></iframe>');
        $(".common").hide();
        $(".subject").css('width','100%');
        $("#navBar").hide();
        $(".clildFrame").css('width','100%');
        $("iframe").width($("#clildFrame").width());
    }
    //左侧导航默认选中
    function current(json) {
        $("#clildFrame").html('<iframe id="iframe" src="'+json+'"></iframe>');
        $("#navBar").show();
        $(".clildFrame").css('width','calc(100% - 228px)');
        $(".common").show();
        $(".subject").css('width','1200px');
        $("iframe").width($("#clildFrame").width());
    }
    //通过顶部导航渲染内容区
    element.on('nav(navigation)', function(elem){
        navigation = [];
        navigation.push(elem.text());
        tools.breadcrumb(navigation);
        getData($(this).data("href"));
        window.sessionStorage.setItem("menu",JSON.stringify({href:$(this).data("href"),side:false}));
    });
    //点击企业登录
    $("#enroll").click(function () {
        $(".errorPrompt").hide();
        logging();
    });
    //点击退出
    $("#signOut").click(function () {
        window.sessionStorage.clear();
        // tools.login();
        window.location.href = "/logout"
        // getData("page/home/home.html");
    });
    //点击个人中心
    $("#personal").click(function () {
        tools.firstPersonal();
        tools.communal('');
    });
    $(".personal").hover(function(){
        $(this).find("#signOut").show();
        $(this).css({'height':'50px','margin-top':'30px'})
    },function(){
        $(this).find("#signOut").hide();
        $(this).css({'height':'20px','margin-top':'0'})
    });

    //登录框
    function logging(){
        $(".errorPrompt").hide();
        projectile.record({content:$("#signIn"),area: ['420px','380px']},function () {});
    }

    //点击登录---监听submit提交
    form.on("submit(addNews)",function(data){
        //console.log(JSON.stringify(data.field));
        var username=data.field.user;
        var password=data.field.password;
        $(".errorPrompt").hide();
        $.ajax({
            url: "/login",
            type: "post",
            data: {"username":username,"password":hex_md5(password)},
            dataType:"json",
            success: function (res) {
                console.log(res);
                if (res.code == "200") {
                    var enterprise = res.data;
                    //资料是否完善，审核通过即完善
                    if(enterprise.examineStatus == 3){
                        window.sessionStorage.setItem("perfect",1);
                        if(enterprise.pid == 1){
                            window.sessionStorage.setItem("county",0);
                        }else{
                            window.sessionStorage.setItem("county",1);
                        }
                    }else{
                        window.sessionStorage.setItem("perfect",0);
                        window.sessionStorage.setItem("county",1);
                    }
                    //劳模权限
                    if(enterprise.modelStatus == 1){
                        window.sessionStorage.setItem("modelStatus",1);
                    }else{
                        window.sessionStorage.setItem("modelStatus",0);
                    }
                    layer.closeAll(); //关闭所有层
                    window.sessionStorage.setItem("isLog",1);
                    if (window.sessionStorage.getItem("lmINdex") != undefined) {
                        $("#enroll").hide();
                        $("#isLog").show();
                        $(".layui-main").show();
                        $(".prompt").hide();
                        $(".subject").css('border-top','none');
                        tools.communal('疗休养报名');
                        tools.signUp("route?name=signUp/enroll&index="+window.sessionStorage.getItem("lmIndex"));
                        window.sessionStorage.removeItem("lmINdex");
                    }else{
                        tools.firstPersonal();
                        tools.communal('');
                    }

                } else {
                    $(".errorPrompt").show();
                }
            }
        });
        return false; //阻止表单跳转
    });

    //点击忘记密码
    $("#forget").click(function () {
        layer.closeAll(); //关闭所有层
        navigation = ['忘记密码'];
        tools.breadcrumb(navigation);
        getData("page/register/forget.html",false);
        $(".layui-main").hide();
        $(".prompt").show().text('忘记密码');
        $(".subject").css('border-top','3px solid #005ca7');
    });
    //点击注册
    $("#register").click(function () {
        layer.closeAll(); //关闭所有层
        navigation = ['注册'];
        tools.breadcrumb(navigation);
        getData("/register",false);
        $(".layui-main").hide();
        $(".prompt").show().text('注册');
        $(".subject").css('border-top','3px solid #005ca7');
    });
    //点击左侧导航
    $("body").on("click","#navBar .layui-nav-tree .layui-this",function () {
        if(window.sessionStorage.getItem("perfect") == 0){
            layer.msg("当前企业未通过审核！");
            return;
        }
        navigation = ['疗休养报名'];
        navigation.push($(this).text());
        tools.breadcrumb(navigation);
        if($(this).data("href")){
            window.sessionStorage.setItem("menu",JSON.stringify({href:$(this).data("href"),side:true}));
            current($(this).data("href"));
        }
    });
    $("body").on("click","#navBar .layui-nav-tree li .layui-nav-child dd",function () {
        navigation = ['个人中心'];
        navigation.push($(this).parent().prev().text());
        navigation.push($(this).text());
        tools.breadcrumb(navigation);
        if($(this).data("href")){
            if(window.sessionStorage.getItem("perfect") == 0){
                layer.msg("当前企业未通过审核！");
                return;
            }
            if(window.sessionStorage.getItem("isLog") == 1){
                if($(this).data("href")=="/enterpriseEnterprise/information" && window.sessionStorage.getItem("perfect")==1){
                    current("/enterpriseEnterprise/information");
                }else {
                    current($(this).data("href"));
                }
                console.log($(this).data("href"));
                window.sessionStorage.setItem("menu",JSON.stringify({href:$(this).data("href"),side:true}));
            }else{
                tools.login();
            }

        }
    });
    // 添加新窗口
    $("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
        $(this).parent("li").siblings().removeClass("layui-nav-itemed");
    });
    //刷新后还原打开的窗口
    if(window.sessionStorage.getItem("menu") != null){
        tools.firstPersonal();
        var menu = window.sessionStorage.getItem("menu");
        var side = window.sessionStorage.getItem("navigation");
        if(JSON.parse(menu).side){
            if(JSON.parse(side)[0]=="个人中心"){
                tools.personal(JSON.parse(menu).href);
                tools.communal('');
                tools.breadcrumb(JSON.parse(side));
            }else {
                tools.signUp(JSON.parse(menu).href);
                tools.communal(JSON.parse(side)[0]);
            }
            var navigationData = dataStr;
            for(var i=0;i<navigationData.length;i++){
                navigationData[i].spread = false;
                if(navigationData[i].children){
                    for(var j=0;j<navigationData[i].children.length;j++){
                        if(navigationData[i].children[j].title==JSON.parse(side)[JSON.parse(side).length-1]){
                            navigationData[i].children[j].spread = true;
                            navigationData[i].spread = true;
                        }else {
                            navigationData[i].children[j].spread = false;
                        }

                    }
                }else {
                    if(navigationData[i].title==JSON.parse(side)[JSON.parse(side).length-1]){
                        navigationData[i].spread = true;
                    }
                }
            }
            dataStr = navigationData;
            tab.render();
        }else {
            tools.communal(JSON.parse(side)[0]);
            getData(JSON.parse(menu).href)
        }
    }
});