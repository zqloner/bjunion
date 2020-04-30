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
        , url = "/statistics/getTrafficInfoList";

    var searchObj = new Object();
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'type', title: '出行工具', width: '10%', templet: function (d) {
                        if (d.type == '1') {
                            return '火车'
                        } else if (d.type == '2') {
                            return '飞机'
                        } else if (d.type == '3') {
                            return '大巴'
                        }
                    }}
                    , {field: 'lineName', title: '疗养路线', width: '30%'}
                    , { title: '疗养时间', width: '25%',templet:function (d) {
                        return d.sbeginStart +"-"+ d.sbeginEnd;
                    }}
                    , {field: 'userType', title: '疗养群体', width: '15%', templet: function (d) {
                    if (d.userType == '3') {
                        return '劳模职工'
                    } else if (d.userType == '2') {
                        return '优秀职工'
                    } else if (d.userType == '1') {
                        return '普通职工'
                    }
                }}
                    , {field: 'usersCount', title: '人数', width: '10%'}
                    , {field: 'price', title: '交通费用', width: '10%'}
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurr(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: res.pageSize}, function (obj, first) {
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
    //获取所有的路线，渲染路线下拉列表
    // 加载数据
    function getLineList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: "/lineLine/list",
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                console.log(res);
                if (res.code == "200") {
                    myLineList = res.data.list;
                    var myLine = '<option value="">请选择</option>';
                    for(var i=0;i<myLineList.length;i++){
                        myLine += '<option value="'+myLineList[i].id+'">'+myLineList[i].name+'</option>'
                    }
                    $("[name=line]").html(myLine);
                    form.render();
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }
    // 初始化加载
    getLineList();

    // 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.type = searchObj.type;
        params.lineId = searchObj.lineId;
        params.sBeginStart = searchObj.sBeginStart;
        params.sBeginEnd = searchObj.sBeginEnd;
        params.sEndStart=searchObj.sEndStart;
        params.sEndEnd= searchObj.sEndEnd;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                console.log(res);
                if (res.code == "200") {
                    tablePlay(res.data.list); //列表渲染
                    laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }
    // 初始化加载
    getCadreList();

    // 表单查询
    form.on('submit(submitData)', function (data) {
        searchObj.type = data.field.travel;
        searchObj.lineId = data.field.line;
        searchObj.sBeginStart = data.field.start;
        searchObj.sBeginEnd = data.field.end;
        searchObj.sEndStart = data.field.start1;
        searchObj.sEndEnd = data.field.end1;
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
                window.location.href = "/statistics/exportTrafficInfoList"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });
});