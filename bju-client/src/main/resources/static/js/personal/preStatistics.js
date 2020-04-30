layui.config({
    base : "../../js/"
}).use(['form','jquery','table','layer','element','dtree','hour','ajax','pagination'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,element = layui.element
        ,dtree = layui.dtree
        ,hour = layui.hour//自定义时间选择
        ,ajax = layui.ajax //自定义请求数据
        ,pagination = layui.pagination//自定义分页
        ,typeId = 2 //职工类型
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/preRegistration/findPregistrationStatictis";

    var searchObj = {};
    searchObj.userType = typeId;

    //没有劳模权限隐藏
    if(window.sessionStorage.getItem("modelStatus") == 0){
        $("#laomo").hide();
    }

    var data= [
        // {"id":"-1", "title": "全部", "parentId": "-2", "checkArr": "0", "children":[
        //
        //     ]},
        // {"id":"002", "title": "湖北省", "parentId": "0", "checkArr": "0", "children":[]},
        // {"id":"003", "title": "广东省", "parentId": "0", "checkArr": "0", "children":[]},
        // {"id":"004", "title": "浙江省", "parentId": "0", "checkArr": "0", "children":[]},
        // {"id":"005", "title": "福建省", "parentId": "0", "checkArr": "0", "children":[]}
    ];
    var data1= [
        // {"id":"001", "title": "湖南省", "parentId": "0", "checkArr": "0", "children":[
        //         {"id":"0001", "title": "湖南省1", "parentId": "0", "checkArr": "0",},
        //         {"id":"0002", "title": "湖南省2", "parentId": "0", "checkArr": "0",},
        //     ]},
        // {"id":"002", "title": "湖北省", "parentId": "0", "checkArr": "0", "children":[]}
    ];

    function dropDown(data) {
        var DTreeNode = dtree.render({
            elem: "#checkbarTreeNode",  //绑定元素
            data: data,
            ficon: ["1","-1"],
            skin: "laySimple",
            checkbar: true,
            initLevel: "1",
            checkbarType: "only"
        });
        // 绑定节点点击事件
        dtree.on("node(checkbarTreeNode)", function(obj){
            var nodeId = obj.param.nodeId;
            var $checkbar = DTreeNode.getNodeDom(nodeId).checkbox(); //获取当前点击节点的checkbar的dom
            DTreeNode.temp = [$checkbar]; //通过内置交换对象，将复选框放入交换队列中
            DTreeNode.changeCheck(); //调取内置选中函数，选中/不选/半选复选框
            // var checkbarNodes = dtree.getNowParam("checkbarTreeNode");// 获取当前选中节点
            // console.log(checkbarNodes);
        });
    }
    function frameChoice(data,title){
        layer.open({
            type: 1,
            title: title,
            area: ['380px','240px'],
            content: $("#treeNode"),
            shade: 'transparent',//遮罩
            btn: ['确认选择'],
            success: function(layero, index){
                dropDown(data);
            },
            yes: function(index, layero) {
                var checkbarNodes = dtree.getNowParam("checkbarTreeNode");// 获取当前选中节点
                //console.log(checkbarNodes);
                if(title == '审疗养地区选择'){
                    $("input[name='region']").val(checkbarNodes.context);
                    searchObj.areaId = checkbarNodes.nodeId;
                }else if(title == '预报名单位选择'){
                    $("input[name='unit']").val(checkbarNodes.context);
                    searchObj.enterpriseId = checkbarNodes.nodeId;
                }
                console.log(searchObj);
                layer.closeAll();
            }
        });
    }
    // $("input[name='region']").click(function () {
    //     frameChoice(data,'审疗养地区选择');
    // });
    // $("input[name='unit']").click(function () {
    //     frameChoice(data1,'预报名单位选择');
    // });
    //
    // var personnel = [
    //     {taskName:'福建厦门6日游', region:'北京-秦皇岛',month:'一月',unit1:'一级单位名称名称名称',unit2:'二级单位名称名称名称', time:'2019-12-27',people:'25'},
    //     {taskName:'黄山休闲之旅四晚五日', region:'北京-秦皇岛',month:'一月',unit1:'一级单位名称名称名称',unit2:'二级单位名称名称名称', time:'2019-12-27',people:'25'},
    //     {taskName:'北京秦皇岛5日游', region:'北京-秦皇岛',month:'一月',unit1:'一级单位名称名称名称',unit2:'二级单位名称名称名称', time:'2019-12-27',people:'25'},
    //     {taskName:'北京秦皇岛5日游', region:'北京-秦皇岛',month:'一月',unit1:'一级单位名称名称名称',unit2:'二级单位名称名称名称', time:'2019-12-27',people:'25'}
    // ];


    function findTree(){
        $.ajax({
            url: "/preFindAll/findAllZondes",
            type:"GET",
            success: function (res) {
                console.log(res);
                var ta = [];
                for(var i=0;i<res.data.areaZnodesDtos.length;i++){
                    var item = {};
                    item.id = res.data.areaZnodesDtos[i].id;
                    item.title = res.data.areaZnodesDtos[i].name;
                    item.parentId = res.data.areaZnodesDtos[i].pId;
                    ta.push(item);
                }
                var ta1 = [];
                for(var i=0;i<res.data.enterPriseZnodeDtos.length;i++){
                    var item = {};
                    item.id = res.data.enterPriseZnodeDtos[i].id;
                    item.title = res.data.enterPriseZnodeDtos[i].name;
                    item.parentId = res.data.enterPriseZnodeDtos[i].pId;
                    ta1.push(item);
                }

                data =toTree(ta);
                data1  = toTree(ta1);
                $("input[name='region']").click(function () {
                    frameChoice(data,'审疗养地区选择');
                });
                $("input[name='unit']").click(function () {
                    frameChoice(data1,'预报名单位选择');
                });
                form.render();
            },
            dataType: "json"
        });
    }

//初始化数据
    findTree();
    //递归渲染树
    function toTree(data) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
            delete item.children;
        });

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        var map = {};
        data.forEach(function (item) {
            map[item.id] = item;
        });
//        console.log(map);
        var val = [];
        data.forEach(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            var parent = map[item.parentId];
            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                (parent.children || ( parent.children = [] )).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item);
            }
        });
        return val;
    }
    //监听职工类型切换
    element.on('nav(role)', function(elem){
        var value = $(".layui-this").val();
        $("#preLineName").val("");
        searchObj.userType = value;
        getCadreList();
        // table.resize('fine');
        // table.resize('general');
        // layer.msg(elem.text());
        // typeId = $(this).data("id");
        // //表单初始赋值
        form.val("queryForm", {
            "definition": ''
            ,"region": ''
            ,"month": ''
            ,"unit": ''
            ,"time_min": ''
            ,"time_max": ''
        });
        // $("#operation").hide();
        // $(".currency").hide();
    });

    var personnel = [];
    //点击查找---监听submit提交
    form.on("submit(addNews)",function(data){
        pageFlag = true;
        if(data.field.month!= null && data.field.month != ""){
            searchObj.dictId = parseInt(data.field.month.split("")[6])+4;
        }
        searchObj.beginTime = data.field.time_min;
        searchObj.overTime = data.field.time_max;
        searchObj.title = data.field.definition;
        console.log(searchObj);
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "definition": ''
            ,"region": ''
            ,"month": ''
            ,"unit": ''
            ,"time_min": ''
            ,"time_max": ''
        });
        searchObj.dictId ="";
        searchObj.beginTime = "";
        searchObj.overTime = "";
        searchObj.title = "";
        searchObj.enterpriseId = "";
        searchObj.areaId = "";
        // $("#operation").hide();
        // $(".currency").hide();
    });
    //点击列表导出
    $("#export").click(function () {
        layer.msg('列表导出');
    });
    //表格渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: '#table',
            data: data,
            loading: true,
            skin: 'line',
            limit:limitNumber,
            cols: [//设置表头参数
                [
                    {field: 'title',title: '预报任务名称', width: '17%'}
                    , {field: 'regionName',title: '疗养地区', width: '15%'}
                    , {field: 'month',title: '疗养月份',align:'center', width: '15%'}
                    , {field: 'aunit',title: '一级单位',width: '15%'}
                    , {field: 'bunit',title: '二级单位',width: '15%'}
                    , {field: 'createTime',title: '报名日期',width: '15%'}
                    , {field: 'personCount',title: '报名人数',align:'center',width: '8%'}
                ]
            ],
            done: function(res, curr, count){
                setTimeout(function () {
                    parent.tools.redefinition($(".childrenBody").height());
                },200);
            }
        });
    }
    //分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data:res,num:limitNumber,elem:'page'},function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    //加载数据
    function getCadreList(pageNumber,pageSize){
        // 数据加载中loading
        // parent.tools.load();
        var params = searchObj;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: "/preRegistration/findPregistrationStatictis",
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                console.log(res);
                if (res.code == "200") {
                    tablePlay(res.data.list); //列表渲染
                    laypageCurr(res.data); //分页渲染
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            }
        });
        return false;
    }
    getCadreList();
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});