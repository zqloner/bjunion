/**
 * Created by zhuxq on 2019/9/10.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'transfer', 'layedit', 'hour', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , transfer = layui.transfer
        , layedit = layui.layedit
        , hour = layui.hour
        , pagination = layui.pagination //自定义分页
        , projectile = layui.projectile //自定义弹窗
        , pageFlag = true
        //, url = "../../json/ticket.json";
        , searchObj = {}//查询参数
        , nums = 10;//每页条数

    var formalId = $("[name=formalId]").val();

    //回显
    getTicketInfo();
    function getTicketInfo(){
        $.ajax({
            url: '/formalLineSingUp/getLineDetail/'+ formalId,
            type: "GET",
            //data: {"id":formalId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    $("#name").html(res.data.lineName);
                    $("#sanatorName").html(res.data.sanatorName);
                    $("#time").html( res.data.sBenginTime + '-'  + res.data.sEndTime);
                    $("#nowCount").html(res.data.nowCount);
                    $("#leaderName").html(res.data.leaderName);

                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 表单查询
    form.on('submit(submitData)', function (data) {
        pageFlag = true;
        var field = data.field;
        for(var key in field){
            if(field[key].trim().length == 0){
                delete field[key];
            }
        }
        searchObj = field;
        getCadreList(null, null);
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 列表渲染
    function tablePlay(data) {
        table.render({
            id:"enquiry",
            elem: "#table",
            data: data,
            limit:nums,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '疗养人姓名', width: '8%'}
                    , {field: 'enterpriseName', title: '所属单位', width: '5%'}
                    , {field: 'cardId', title: '京卡号', width: '5%'}
                    , {field: 'idcard', title: '身份证号', width: '10%'}
                    , {field: 'phone', title: '联系电话', width: '8%'}
                    , {field: 'goTool', title: '出行工具', width: '6%', templet: function (d) {
                    if(d.goTool == undefined) return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ ""+'</a>';
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.goTool+'</a>';
                }}
                    , {field: 'goTicketInfo', title: '车票/航班', width: '8%', templet: function (d) {
                    if(d.goTicketInfo == undefined) return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ ""+'</a>';
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.goTicketInfo+'</a>';
                }}
                    , {field: 'goPrice', title: '票价', width: '7%', templet: function (d) {
                    if(d.goPrice == undefined) return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ ""+'</a>';
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.goPrice+'</a>';
                }}
                    ,{field: 'goNote', title: '票务备注', width: '5%'},
                    {field: 'backTool', title: '返回工具', width: '8%', templet: function (d) {
                    if(d.backTool == undefined) return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ ""+'</a>';
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.backTool+'</a>';
                }}
                    , {field: 'backTicketInfo', title: '车票/航班', width: '8%', templet: function (d) {
                    if(d.backTicketInfo == undefined) return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ ""+'</a>';
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.backTicketInfo+'</a>';
                }}
                    , {field: 'backPrice', title: '票价', width: '7%', templet: function (d) {
                        if(d.backPrice == undefined) return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ ""+'</a>';
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.backPrice+'</a>';
                }
            }, {field: 'backNote', title: '票务备注', width: '5%'},
                    {
                    title: '操作', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="change">修改</a>';
                    }
                }
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                nums = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }

    var exportParams = new Object();
    // 加载数据
    function getCadreList(pageNumber, pageSize) {
        var params = searchObj;
        params.formalId = formalId;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        exportParams = params;
        $.ajax({
            url: '/ticketInfo/userTicketList',
            type: "GET",
            data: params,
            dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    debugger;
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

    // 企业下拉框
    getEnterpriseAll();
    function getEnterpriseAll(){
        $.ajax({
            url: '/enterpriseEnterprise/getEnterpriseAll',
            type: "GET",
            //data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //组装下拉框
                    dealSelectData(res.data);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    //组装下拉框
    function dealSelectData(data) {
        var value = "<option value=''>请选择</option>";
        if(data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                value += "<option value=" + data[i].id + ">" + data[i].name + "</option>"
            }
        }
        $("[name=eId]").html(value);
        form.render();
    }

    // 出行方式下拉框
    getTravelAll();
    function getTravelAll(){
        $.ajax({
            url: '/sysDict/travel',
            type: "GET",
            //data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    var data = res.data;
                    var value = "";
                    if(data.length != 0) {
                        for (var i = 0; i < data.length; i++) {
                            value += "<option value=" + data[i].id + ">" + data[i].value + "</option>"
                        }
                    }
                    $("[name=toolId]").html(value);
                    $("[name=goType]").html(value);
                    $("[name=backType]").html(value);
                    form.render();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 批量添加出行票务弹窗
    $("#add").click(function () {
        projectile.elastic({title: "批量添加出行票务", content: $("#popup"), area: ['800px', '288px']}, function () {
            $("[name=tickeInfo]").val('');
            $("[name=price]").val('');
            // 监听提交
            form.on('submit(submitAdd)', function (data) {
                data.field.goOrType = 0;
                batchAdd(data.field);
                return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        });
    });

    // 批量添加返回票务
    $("#addBack").click(function () {
        projectile.elastic({title: "批量添加返回票务", content: $("#popup"), area: ['800px', '288px']}, function () {
            $("[name=tickeInfo]").val('');
            $("[name=price]").val('');
            // 监听提交
            form.on('submit(submitAdd)', function (data) {
                data.field.goOrType = 1;
                batchAdd(data.field);
                return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        });
    });

    $("#exportList").click(function () {
        projectile.elastic({title: "批量添加出行票务", content: $("#popup"), area: ['800px', '288px']}, function () {
            var requestURL = "?";
            var boolean = true;
            for(var obj in exportParams){
                if(boolean){
                    requestURL += obj + "=" + exportParams[obj];
                    boolean = false;
                }else {
                    if(obj!="pageNum" && obj!="pageSize") {
                        requestURL += "&" + obj + "=" + exportParams[obj];
                    }
                }
            }
            window.location.href = "/ticketInfo/exportUserTicketList"+requestURL;
            layer.closeAll();
        });
    });

    //批量添加返回票务&出行
    function batchAdd(data){
        data.formalId = formalId;
        $.ajax({
            url: '/ticketInfo/batchAdd',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    layer.closeAll(); //关闭所有层
                    pageFlag = true;
                    getCadreList(null,null);
                    layer.msg("添加成功！");
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 2019/10/25   0
    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        var currentObj = obj.data;
        if (obj.event === 'change') { // 操作—修改
            projectile.elastic({title: "修改", content: $("#Change"), area: ['800px', '480px']}, function () {
                form.val('formEvent', {
                    "goTicketInfo": currentObj.goTicketInfo,
                    "goPrice": currentObj.goPrice,
                    "backTicketInfo": currentObj.backTicketInfo,
                    "backPrice": currentObj.backPrice,
                    "backType": currentObj.backType,
                    "goType": currentObj.goType,
                    "backNote": currentObj.backNote,
                    "goNote": currentObj.goNote
                })
                // 监听提交
                form.on('submit(submitChange)', function (data) {
                    debugger;
                    data.field.id = currentObj.id;
                    $.ajax({
                        url: "/ticketInfo/updateById",
                        type: "POST",
                        data: data.field,
                        // dataType:"json",
                        success: function (res) {
                            if (res.code == "200") {
                                layer.closeAll();
                                layer.msg("修改成功");
                                getCadreList();
                            } else {
                                layer.msg(res.message);
                            }
                        }
                    });
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            });
        }
    });
    // 2019/10/25   1
});