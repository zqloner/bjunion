/**
 * Created by zhuxq on 2019/9/10.
 */
layui.config({
    base: "../../js/"
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
        , url = "../../json/ticket.json";

    // 表单查询
    form.on('submit(submitData)', function (data) {
        // 前端测试代码，正式删掉。
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        }, function () {
            layer.closeAll(); //关闭所有层
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 列表渲染
    function tablePlay(data) {
        table.render({
            id:"enquiry",
            elem: "#table",
            data: data.data,
            // 设置表头参数
            cols: [
                [
                    {field: 'realName', title: '疗养人姓名', width: '10%'}
                    , {field: 'company', title: '所属单位', width: '10%'}
                    , {field: 'bjCard', title: '京卡号', width: '10%'}
                    , {field: 'idCard', title: '身份证号', width: '10%'}
                    , {field: 'tel', title: '联系电话', width: '10%'}
                    , {field: 'tool', title: '出行工具', width: '8%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.tool+'</a>';
                }}
                    , {field: 'ticket', title: '车票/航班', width: '10%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.ticket+'</a>';
                }}
                    , {field: 'money', title: '票价', width: '7%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.money+'</a>';
                }}
                    , {field: 'backTool', title: '返回工具', width: '8%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.backTool+'</a>';
                }}
                    , {field: 'backTicket', title: '车票/航班', width: '10%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.backTicket+'</a>';
                }}
                    , {field: 'backMoney', title: '票价', width: '7%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn">'+ d.backMoney+'</a>';
                }}
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
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        console.log(pageNumber);
        console.log(pageSize);
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            dataType:"json",
            success: function (res) {
                console.log(res);
                if (res.state == "200") {
                    tablePlay(res.result); //列表渲染
                    laypageCurr(res.result); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }
    // 初始化加载
    getCadreList();

    // 批量添加出行票务弹窗
    $("#change").click(function () {
        window.location.href="../../../../templates/bjzgh/order/ticketAdd.html"
    });
});