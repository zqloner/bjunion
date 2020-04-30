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
        , hour = layui.hour //自定义时间选择
        , pageFlag = true
        , url = "/bjzgh/json/company.json";

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
            //id:"enquiry",
            elem: "#table",
            data: data.data,
            // 设置表头参数
            cols: [
                [
                    {field: 'lastCompany', title: '企业名称', width: '35%'}
                    , {field: 'numSum', title: '限报人数', width: '22%'}
                    , {field: 'numLast', title: '报名人数', width: '22%'}
                    , {
                    title: '操作', width: '21%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">查看详情</a>';
                    }
                }
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
            // dataType:"json",
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

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'look') { // 查看详情
            projectile.elastic({title: "名单", content: $("#popup"), area: ['900px', '488px']}, function () {
                // 列表渲染
                function tablePlayPop(data) {
                    table.render({
                        id:"popTable",
                        elem: "#popTable",
                        data: data.data,
                        // 设置表头参数
                        cols: [
                            [
                                {field: 'realName', title: '姓名', width: '10%'}
                                , {field: 'company', title: '所属单位', width: '15%'}
                                , {field: 'card', title: '京卡号', width: '15%'}
                                , {field: 'idCard', title: '身份证号', width: '15%'}
                                , {field: 'tel', title: '联系方式', width: '15%'}
                                , {field: 'title', title: '疗养线路', width: '15%'}
                                , {field: 'winTime', title: '疗养日期', width: '15%'}
                            ]
                        ]
                    });
                }
                // 分页渲染
                function laypageCurrPop(res) {
                    var nums = 10;
                    if (pageFlag) {
                        pagination.paging({data: res, num: nums}, function (obj, first) {
                            // obj包含了当前分页的所有参数，比如：
                            console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                            console.log(obj.limit); // 得到每页显示的条数
                            if (!first) {
                                pageFlag = false;
                                getCadreListPop(obj.curr, obj.limit)
                            }
                        });
                    }
                }
                // 加载数据
                function getCadreListPop(pageNumber, pageSize) {
                    // 数据加载中loading
                    // parent.tools.load();
                    var params = new Object();
                    params.pageNumber = pageNumber;
                    params.pageSize = pageSize;
                    console.log(pageNumber);
                    console.log(pageSize);
                    $.ajax({
                        url: "/bjzgh/json/worker.json",
                        type: "GET",
                        data: params,
                        dataType:"json",
                        success: function (res) {
                            console.log(res);
                            if (res.state == "200") {
                                tablePlayPop(res.result); //列表渲染
                                laypageCurrPop(res.result); //分页渲染
                            } else {
                                layer.msg(res.data.msg);
                            }
                        }
                    });
                }
                // 初始化加载
                getCadreListPop();
            });
        }
    });
});