/**
 * Created by zhuxq on 2019/9/5.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true
        , limitNumber = 10
        , url = "/statistics/getAllSanatoriumCount";

    var searchObj = {};

    // 列表渲染
    function tablePlay(data) {
        table.render({
            id:"enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'sname', title: '疗养院名称', width: '20%'}
                    , {field: 'lineName', title: '疗养线路', width: '25%'}
                    , {field: 'time', title: '疗养时间', width: '25%',templet:function(e){
                        return e.sbenginTime + "-" + e.sendTime;
                    }}
                    , {field: 'userType', title: '疗养群体', width: '20%',templet:function(e){
                        var userType = e.userType;
                        if(userType == 1){
                            return "普通职工";
                        }else if(userType == 2){
                            return "优秀职工";
                        }else if(userType == 3){
                            return "劳模职工";
                        }
                    }}
                    , {field: 'usersCount', title: '人数', width: '10%'}
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data: res, num: limitNumber}, function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                limitNumber = obj.limit;
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
        var params = searchObj;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlay(res.data.list); //列表渲染
                    laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 初始化加载
    getCadreList();

    // 表单查询
    form.on('submit(submitData)', function (data) {
        pageFlag = true;
        var field = data.field;
        for(var key in field){
            if(field[key].trim().length == 0){
                delete field[key];
            }
        }
        searchObj = data.field;
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 导出列表
    $("#export").click(function () {
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
                window.location.href = "/statistics/exportAllSanatoriumCount"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });

    //疗养院列表
    getSanatorium();
    function getSanatorium(){
        $.ajax({
            url: '/sanatoriumSanatorium/lsitNoPage' ,
            type: "GET",
            //data: {"id":routeId},
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    var value = "<option value=''>请选择</option>";
                    var data = res.data;
                    for(var i = 0; i < data.length; i++){
                        value += "<option value="+ data[i].id +">"+ data[i].name +"</option>";
                    }
                    $("[name=sId]").html(value);
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    getAllLine();
    function getAllLine(){
        $.ajax({
            url: '/lineLine/listNoPage' ,
            type: "GET",
            //data: {"id":routeId},
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    var value = "<option value=''>请选择</option>";
                    var data = res.data;
                    for(var i = 0; i < data.length; i++){
                        value += "<option value="+ data[i].id +">"+ data[i].name +"</option>";
                    }
                    $("[name=lineId]").html(value);
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
});