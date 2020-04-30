/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour', 'tree'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , tree = layui.tree
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true
        , url = "/preRegistration/findPregistrationStatictis";

        var searchObj = {};
        searchObj.userType = 3;
    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)', function (data) {
        searchObj.userType = $(".layui-this").val();
        $("#area").val("");
        $("#enterPrise").val("");
        $("[name=myPreLineName]").val("");
        $("#myMonth").val("");
        $("[name=start]").val("");
        $("[name=end]").val("");
        form.render();
        getCadreList();
        return false;
        // table.resize('fine');
        // table.resize('general');
    });
    zTreeObj= $.fn.zTree.init($("#tree"), setting, zNodes);
    zTreeObjC=$.fn.zTree.init($("#treeCompany"), setting, zNodesC);
    // 表单查询
    form.on('submit(submitData)', function (data) {
        var nodes = zTreeObj.getChangeCheckedNodes(); //获取勾选状态改变的节点
        var nodesC = zTreeObjC.getChangeCheckedNodes(); //获取勾选状态改变的节点
        searchObj.userType = $(".layui-this").val();
        searchObj.startTime = data.field.start;
        searchObj.endTime =data.field.end;
        searchObj.title = data.field.myPreLineName;
        searchObj.dictId = data.field.permission;
        if(nodes != null &&  nodes.length > 0){
            searchObj.areaId  = nodes[0].id;
        }
        if(nodesC != null &&  nodesC.length> 0){
            searchObj.enterpriseId = nodesC[0].id;
        }
        if(searchObj.areaId==7459){
            searchObj.areaId  = "";
        }
      getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可
    });

    // 劳模职工
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data.list,
            // 设置表头参数
            cols: [
                [
                    {field: 'title', title: '预报任务名称', width: '20%'}
                    , {field: 'regionName', title: '疗养地区', width: '15%'}
                    , {field: 'month', title: '疗养月份', width: '10%'}
                    , {field: 'aunit', title: '一级单位', width: '15%'}
                    , {field: 'bunit', title: '二级单位', width: '15%'}
                    , {field: 'createTime', title: '报名日期', width: '15%'}
                    , {field: 'personCount', title: '报名人数', width: '10%'}
                ]
            ]
        });
    }

    // 分页渲染
    function laypageCurr(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); // 得到每页显示的条数
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }

    // 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.userType = searchObj.userType;
        params.title = searchObj.title;
        params.dictId = searchObj.dictId;
        params.areaId=  searchObj.areaId ;
        params.enterpriseId= searchObj.enterpriseId ;
        params.startTime = searchObj.startTime ;
        params.endTime = searchObj.endTime ;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        console.log(pageNumber);
        console.log(pageSize);
        $.ajax({
            url: "/preRegistration/findPregistrationStatictis",
            type: "GET",
            data: params,
            dataType:"json",
            success: function (res) {
                console.log(res);
                if (res.code == "200") {
                    tablePlay(res.data); //列表渲染
                    laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
        return false;
    }

    // 初始化加载
    getCadreList();


    function findTree(){
        $.ajax({
            url: "/preFindAll/findAllZondes",
            type:"GET",
        success: function (data) {
            zNodesC = data.data.enterPriseZnodeDtos;
            zNodes = data.data.areaZnodesDtos;
            $.fn.zTree.init($("#tree"), setting, zNodes);
            $.fn.zTree.init($("#treeCompany"), setting, zNodesC);
        },
        dataType: "json"
    });
        return false;
    }

//初始化数据
    findTree();
    // 导出列表
    $(".export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                var requestURL = "?";
                var boolean = true;
                for(var obj in searchObj){
                    if(boolean){
                        requestURL += obj + "=" + searchObj[obj];
                        boolean = false;
                    }else {
                        if(obj!="pageNum" && obj!="pageSize") {
                            requestURL += "&" + obj + "=" + searchObj[obj];
                        }
                    }
                }
                window.location.href = "/preRegistration/downloadPregistrationStatictisCount"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });

    // 疗养地区
    $(".lydq").click(function () {
        projectile.elastic({title: "疗养地区", content: $("#popup_lydq"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                $("#area").val(zTreeObj.getChangeCheckedNodes()[0].name);
                layer.closeAll();
            });
        });
    });

    // 预报名单位
    $(".ybmdw").click(function () {
        projectile.elastic({title: "预报名单位", content: $("#popup"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                $("#enterPrise").val(zTreeObjC.getChangeCheckedNodes()[0].name);
                layer.closeAll();
            });
        });
    });

        // 疗养地区
        // 树形结构数据
        var treeData = [];

        // 企业查看权限
        // 树形结构数据
        var treeCompanyData = [];
        //查找地区和企业树数据和所有的路线
    var setting = {
        view:{
            showIcon:false //设置是否显示节点图标
        },
        check: {
            enable: true, //设置是否显示单选框
            chkStyle: "radio",
            radioType: "all"
        },
        data: {
            simpleData: {
                enable: true //设置是否启用简单数据格式
            }
        },
        callback: {
            onCheck: onCheck  //定义节点复选框选中或取消选中事件的回调函数
        }
    };
    var zNodes =[
        // { id:1, pId:0, name:"全部", description:"全部"},
        //
        // { id:11, pId:1, name:"北京市", description:"北京市"},

        //
        // { id:12, pId:1, name:"河北省", description:"河北省"},
        // { id:201, pId:12, name:"石家庄", description:"石家庄"}
    ];
    var zNodesC =[
        // { id:1, pId:0, name:"全部", description:"全部"},
        //
        // { id:11, pId:1, name:"北京总工会", description:"北京总工会"},
        // { id:101, pId:11, name:"东城区工会", description:"东城区工会"},
        //
        // { id:12, pId:1, name:"XXX", description:"XXX"},
        // { id:201, pId:12, name:"XXXXXXXXXX", description:"XXXX"}
    ];


//初始化树的数据
//         function treeRender(data) {
//             // 树形结构渲染
//             tree.render({
//                 elem: '#treeCompany'
//                 , id: 'treeCompanyId'
//                 , data: data.data.enterPrises
//                 , showCheckbox: true
//                 , showLine: false  //是否开启连接线
//                 , click: function (obj) {
//                     console.log(obj.data);
//                 }
//             });
//             // 树形结构渲染
//             tree.render({
//                 elem: '#tree'
//                 , id: 'treeId'
//                 , data: data.data.areas
//                 , showCheckbox: true
//                 , showLine: false  //是否开启连接线
//                 , click: function (obj) {
//                     console.log(obj.data);
//                 }
//                 , oncheck: function (obj) {
//                     console.log(obj.data); //得到当前点击的节点数据
//                 }
//             });
//         }

    // var zTreeObj,zTreeObjC;


    // zTreeObj=$.fn.zTree.init($("#tree"), setting, zNodes);
    // zTreeObjC=$.fn.zTree.init($("#treeCompany"), setting, zNodesC);

    //点击重置
    $("#reset").click(function () {
        $("#area").val("");
        $("#enterPrise").val("");
        $("[name=myPreLineName]").val("");
        $("#myMonth").val("");
        $("[name=start]").val("");
        $("[name=end]").val("");
        searchObj.areaId = "";
        searchObj.enterpriseId = "";
        zTreeObj.checkAllNodes(false); //获取勾选状态改变的节点
        zTreeObjC.checkAllNodes(false); //获取勾选状态改变的节点
        $.fn.zTree.init($("#tree"), setting, zNodes);
        $.fn.zTree.init($("#treeCompany"), setting, zNodesC);
        tree.render();
        form.render();
        return false;
    });

    // 获取单选框节点
    function onCheck(){
        var nodes = zTreeObj.getChangeCheckedNodes(); //获取勾选状态改变的节点
        var nodesC = zTreeObjC.getChangeCheckedNodes(); //获取勾选状态改变的节点
        console.log(nodes)
        console.log(nodesC)
    }

    });

