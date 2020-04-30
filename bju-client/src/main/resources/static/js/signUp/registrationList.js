layui.config({
    base: "../../js/"
}).use(['form', 'jquery', 'element', 'layer', 'laytpl', 'ajax'], function () {
    var form = layui.form,
        $ = layui.jquery
        , element = layui.element
        , layer = layui.layer
        , laytpl = layui.laytpl
        , ajax = layui.ajax //自定义请求数据
        , registrationList = []
        , url = "https://www.easy-mock.com/mock/5d70cd69173be2677010f36b/sanatorium/route";

    var currentTime = sessionStorage.getItem("currentTime");
    function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    console.log(getQuery('isPre'));//是否是预报名
    console.log(getQuery('typeId'));//用来区分劳模报名、优秀员报名、普通职工报名
    getList();

    function getList() {
        if ($("#userType").val() !== undefined) {
            userType = $("#userType").val();
            getCadreList();
        }
    }

    registrationList = [
        // {name:'北京-张掖七彩丹霞七日游',address:'北京龙脉温泉度假村鼓浪屿疗养院疗养院1',month:'7月、8月、9月',
        //     date:'2019.07.02-2019.09.30',img:'../../img/seize.png',type:1,start:'03',id:1},
        // {name:'北京-张掖七彩丹霞七日游',address:'北京龙脉温泉度假村鼓浪屿疗养院疗养院2',month:'7月、8月、9月',
        //     date:'2019.07.02-2019.09.30',img:'../../img/seize.png',type:2,completed:0,id:2},
        // {name:'北京-张掖七彩丹霞七日游',address:'北京龙脉温泉度假村鼓浪屿疗养院疗养院3',month:'7月、8月、9月',
        //     date:'2019.07.02-2019.09.30',img:'../../img/seize.png',type:3,closure:0,id:3},
        // {name:'北京-张掖七彩丹霞七日游',address:'北京龙脉温泉度假村鼓浪屿疗养院疗养院2',month:'7月、8月、9月',
        //     date:'2019.07.02-2019.09.30',img:'../../img/seize.png',type:2,completed:1,id:4},
        // {name:'北京-张掖七彩丹霞七日游',address:'北京龙脉温泉度假村鼓浪屿疗养院疗养院1',month:'7月、8月、9月',
        //     date:'2019.07.02-2019.09.30',img:'../../img/seize.png',type:1,start:'03',id:5},
        // {name:'北京-张掖七彩丹霞七日游',address:'北京龙脉温泉度假村鼓浪屿疗养院疗养院3',month:'7月、8月、9月',
        //     date:'2019.07.02-2019.09.30',img:'../../img/seize.png',type:3,closure:1,id:6},
    ];

    journalism(registrationList);

    // 疗休养点
    function journalism(data) {
        var getBase = base.innerHTML
            , baseView = document.getElementById('baseView');
        laytpl(getBase).render(data, function (html) {
            baseView.innerHTML = html;
        });
        //页面渲染完成后获取bady的高度赋值给iframe
        parent.tools.redefinition($(".childrenBody").height());
    }

    function compareTime(nowTime,beginTime) {
        var myNowTime = new Date(nowTime).getTime();
        var mybeginTime = new Date(beginTime).getTime();
        var myDate = (mybeginTime-myNowTime)/86400000;
        var myNewDate = Math.ceil(myDate);
        return myNewDate;
    }
    //加载数据
    // getCadreList(url);
    var userType = {};
    if (getQuery('typeId') == 0) {  //劳模
        userType = 3;
    }
    if (getQuery('typeId') == 1) {  //优秀员工
        userType = 2;
    }
    if (getQuery('typeId') == 2) {  //普通职工
        userType = 1;
    }
    getCadreList();

    function getCadreList() {
        // //数据加载中loading
        // // parent.tools.load();
        // ajax.request(url,'GET','',function(res){
        //     if(res.result.length!=0){
        //         registrationList = res.result;
        //         journalism(res.result);
        //     }
        //     //删除loding
        //     // parent.tools.stop();
        // });
        var isPre = getQuery('isPre');
        // var userType = {};
        // if(getQuery('typeId')== 0){  //劳模
        //     userType = 3;
        // }
        // if(getQuery('typeId')== 1){  //优秀员工
        //     userType = 2;
        // }
        // if(getQuery('typeId')== 2){  //普通职工
        //     userType = 1;
        // }
        if (isPre == 0) {
            $.ajax({
                url: "/preRegistration/getCourrentPreLines",
                type: "GET",
                data: {"userType": userType},
                success: function (res) {
                    if (res.code == 200) {
                        var items = res.data;
                        for (var i = 0; i < items.length; i++) {
                            var item = {};
                            item.name = items[i].title;
                            item.address = '';
                            item.month = '7月、8月、9月';
                            item.date = items[i].beginTime + '-' + items[i].endTime;
                            item.img = '../../img/zhanweitu.png';
                            if (items[i].ttl == 0) {  // 0  即将开始     item.type==2&&item.completed==0
                                item.type = 1;
                                item.closure = 3;
                                item.mydate = compareTime(currentTime,items[i].beginTime);
                            } else if (items[i].ttl == 1) {  // 1  开始报名     item.type==2&&item.completed==0
                                item.type = 2;
                                item.completed = 0;
                            } else if (items[i].ttl == 2) { // 2  查看报名   item.type==2&&item.completed==1
                                item.type = 2;
                                item.completed = 1;
                            } else if (items[i].ttl == 3) {  //3  报名已结束   item.type==3&&item.closure==1
                                item.type = 3;
                                item.closure = 1;
                            } else if (items[i].ttl == 4) {  //4   已报名，并且报名结束    查看报名    item.type==3&&item.closure==0
                                item.type = 3;
                                item.closure = 0;
                            }
                            item.createTime = items[i].createTime;
                            item.id = items[i].id;
                            registrationList.push(item);
                            journalism(registrationList);
                        }
                    }
                },
                dataType: "json"
            });
        } else if (isPre == 1) {
            $.ajax({
                url: "/formalLine/list",
                type: "GET",
                data: {"userType": userType},
                success: function (res) {
                    var items = res.data;
                    for (var i = 0; i < items.length; i++) {
                        var item = {};
                        item.name = items[i].name;
                        item.address = '';
                        item.month = '7月、8月、9月';
                        item.date = items[i].rbeginTime + '-' + items[i].rendTime;
                        item.img = '../../img/zhanweitu.png';
                        if (items[i].ttl == 0) {  // 0  即将开始     item.type==2&&item.completed==0
                            item.type = 1;
                            item.closure = 3;
                            item.mydate = compareTime(currentTime,items[i].rBeginTime);
                        } else if (items[i].ttl == 1) {  // 1  开始报名     item.type==2&&item.completed==0
                            item.type = 2;
                            item.completed = 0;
                        } else if (items[i].ttl == 2) { // 2  查看报名   item.type==2&&item.completed==1
                            item.type = 2;
                            item.completed = 1;
                        } else if (items[i].ttl == 3) {  //3  报名已结束   item.type==3&&item.closure==1
                            item.type = 3;
                            item.closure = 1;
                        } else if (items[i].ttl == 4) {  //4   已报名，并且报名结束    查看报名    item.type==3&&item.closure==0
                            item.type = 3;
                            item.closure = 0;
                        }
                        item.createTime = items[i].createTime;
                        item.id = items[i].id;
                        registrationList.push(item);
                        journalism(registrationList);
                    }
                },
                dataType: "json"
            });
        }
    }

    var myformalLineId = {};

    //到疗养路线详情页
    $("#baseView").on('click', '.layui-btn', function () {
        console.log($(this).data("id"));
        console.log($(this).data("completed"));
        if ($(this).data("completed") == 0) { //点击开始报名
            if (getQuery('isPre') == 0) { //预报名
                window.location.href = "route?name=signUp/forecastName&preId=" + $(this).data("id") + "&userType=" + userType;
            } else if (getQuery('isPre') == 1) { //正式报名
                myformalLineId = $(this).data("id");
                window.location.href = "route?name=signUp/formalRegistration&formalLineId=" + myformalLineId + "&userType=" + userType;
            }
        } else if ($(this).data("completed") == 1) { //点击查看报名
            if (getQuery('isPre') == 0) { //预报名
                window.location.href = "route?name=signUp/preSeeDetails&preId=" + $(this).data("id") + "&userType=" + userType + "&myBtn=" + 0;
            } else if (getQuery('isPre') == 1) { //正式报名
                window.location.href = "route?name=signUp/seeDetails&formalLineId=" + $(this).data("id") + "&userType=" + userType + "&myBtn=" + 0;
            }
        } else {//报名结束--点击查看报名
            if (getQuery('isPre') == 0) { //预报名
                window.location.href = "route?name=signUp/preSeeDetails&preId=" + $(this).data("id") + "&userType=" + userType + "&myBtn1=" + 1;
            } else if (getQuery('isPre') == 1) { //正式报名
                window.location.href = "route?name=signUp/seeDetails&formalLineId=" + $(this).data("id") + "&userType=" + userType + "&myBtn1=" + 1;
            }
        }


    });

    element.on('nav(navigation)', function (elem) {
        console.log($(this).data("id"));
        var list = [];
        if ($(this).data("id") == 0) {
            journalism(registrationList);
        } else {
            for (var i = 0; i < registrationList.length; i++) {
                if (registrationList[i].type == $(this).data("id")) {
                    list.push(registrationList[i]);
                }
            }
            journalism(list);
        }
    });
});