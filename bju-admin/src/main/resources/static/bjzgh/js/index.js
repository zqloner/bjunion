var $, tab, dataStr, layer;
layui.config({
    base: "/bjzgh/js/"
}).extend({
    "bodyTab": "bodyTab"
});
layui.use(['bodyTab', 'form', 'element', 'layer', 'jquery', 'projectile'], function () {
    var form = layui.form
        , projectile = layui.projectile//自定义弹框
        , element = layui.element
        , $ = layui.$
        , navigation = []
        , layer = parent.layer === undefined ? layui.layer : top.layer;
    tab = layui.bodyTab({
        // url: '/bjzgh/json/nav.json'
        url: '/sysMenu/list'
    });
    var tools = {
        load: function () {
            layer.load(0, {shade: [0.2, '#000']});
        },
        stop: function () {
            layer.close(layer.load());
        }
    };
    window.tools = tools;  //向外暴露
    //获取左侧导航  注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
    tools.load();
    $.ajax({
        url: tab.tabConfig.url,
        success: function (res) {
            if(res.code==200){
                //处理数据
                console.log(res.data);
                var data = [];
                var menus = res.data;
                for(var i=0;i<menus.length;i++) {
                    var obj = menus[i];
                    var temp = {}
                    temp.icon = obj.icon;
                    temp.title = obj.name;
                    temp.href = obj.url;
                    if (i == 0) {
                        temp.spread = true;
                    }else {
                        temp.spread = false;
                    }
                    if(obj.pid==0){
                        temp.children =getChildrenList(menus,obj.id);
                        data.push(temp);
                    }
                }
                if (data.length != 0) {
                    data[0].children[0].spread = true;
                    dataStr = data;
                    tab.render();
                    showHistoryMenu();
                    tools.stop();
                }else {
                    layer.msg('请重新登陆！', {
                        icon: 5,//提示的样式
                        time: 2000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                        end:function(){
                            window.location.href = '/';
                        }
                    });
                }

            }else{
                layer.alert(res.message);
                tools.stop();
            }
        },
        complete:function(XMLHttpRequest,textStatus){
            if(textStatus != "success"){
                layer.msg('登陆超时！请重新登陆！', {
                    icon: 5,//提示的样式
                    time: 2000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                    end:function(){
                        window.location.href = '/';
                    }
                });
            }
        }
    });
    function getChildrenList(data,pid) {
        var arr = [];
        for (var j = 0; j<data.length;j++){
            var obj = data[j];
            if(pid == obj.pid){
                var temp = {};
                temp.icon = obj.icon;
                temp.title = obj.name;
                temp.href = obj.url;
                temp.children =getChildrenList(data,obj.id);
                arr.push(temp);
            }
        }
        return arr;
    }

    function current(json) {
        $("#clildFrame").html('<iframe id="iframe" src="'+json+'"></iframe>');
    }
    $("body").on("click","#navBar .layui-nav-tree li .layui-nav-child dd",function () {
        console.log($(this).data("href"));
        var src = $(this).parent().prev().text();
        navigation.push(src.substr(1,4));
        navigation.push($(this).text());
        current($(this).data("href"));
        window.sessionStorage.setItem("navigation",JSON.stringify(navigation));
        window.sessionStorage.setItem("menu",JSON.stringify($(this).data("href")));
    });
    // 添加新窗口
    $("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
        $(this).parent("li").siblings().removeClass("layui-nav-itemed");
    });
    $("#signOut").click(function () {
        layer.confirm('退出该平台？', {btn: ['确认', '取消']}, function () {
            window.location.href = "/logout"
        });
    });
    // 修改密码弹窗
    $("#changePwdBtn").click(function () {
        current("/route?name=changePwd");
    });

    function showHistoryMenu(){
        if(window.sessionStorage.getItem("menu") != null){
            var menu = window.sessionStorage.getItem("menu");
            var side = window.sessionStorage.getItem("navigation");
            var navigationData = dataStr
            // var navigationData = dataStr;
            current(JSON.parse(menu));
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
        }
    }
});
