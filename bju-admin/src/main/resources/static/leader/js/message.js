/**
 * Created by zhuxq on 2019/9/16.
 */
layui.config({
    base: "js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true
        , url = "../../json/order.json";

    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        table.resize('fine');
        table.resize('general');
    });

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

    // 发送消息
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data.data,
            // 设置表头参数
            cols: [
                [
                    {field: 'title', title: '线路', width: '25%'}
                    , {field: 'time', title: '疗养日期', width: '25%'}
                    , {
                    field: 'groupState', title: '疗养群体', width: '15%', templet: function (d) {
                        if (d.groupState == '1') {
                            return '劳模职工';
                        } else if (d.groupState == '2') {
                            return '优秀职工';
                        } else if (d.groupState == '3') {
                            return '普通职工';
                        }
                    }
                }
                    , {field: 'numLast', title: '疗养人员', width: '10%'}
                    , {
                    field: 'addState', title: '出行状态', width: '15%', templet: function (d) {
                        if (d.addState == '0') {
                            return '<span class="layui-badge-dot layui-bg-green"></span> 待出行';
                        } else if (d.addState == '1') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 已出行';
                        }
                    }
                }
                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="send">发送消息</a>';
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
                // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
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
        // console.log(pageNumber);
        // console.log(pageSize);
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
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

    // 发送记录
    // 列表渲染
    function tablePlayFine(data) {
        table.render({
            id: "fine",
            elem: "#fineTable",
            data: data.data,
            // 设置表头参数
            cols: [
                [
                    {field: 'id', title: '序号', width: '5%'}
                    , {field: 'title', title: '疗养线路', width: '18%'}
                    , {field: 'time', title: '疗养日期', width: '18%'}
                    , {
                    field: 'groupState', title: '接收群体', width: '8%', templet: function (d) {
                        if (d.groupState == '1') {
                            return '劳模职工';
                        } else if (d.groupState == '2') {
                            return '优秀职工';
                        } else if (d.groupState == '3') {
                            return '普通职工';
                        }
                    }
                }
                    , {field: 'mould', title: '模板名称', width: '15%'}
                    , {
                    field: 'post', title: '发送方式', width: '8%', templet: function (d) {
                        if (d.post == '0') {
                            return '系统发送';
                        } else if (d.post == '1') {
                            return '手动发送';
                        }
                    }
                }
                    , {field: 'numLast', title: '发送人数', width: '8%'}
                    , {field: 'openTime', title: '发送时间', width: '10%'}

                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">详情</a>';
                    }
                }
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurrFine(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
                if (!first) {
                    pageFlag = false;
                    getCadreListFine(obj.curr, obj.limit)
                }
            });
        }
    }
    // 加载数据
    function getCadreListFine(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.state == "200") {
                    tablePlayFine(res.result); //列表渲染
                    laypageCurrFine(res.result); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }
    // 初始化加载
    getCadreListFine();

    // 发送模板
    // 列表渲染
    function tablePlayGeneral(data) {
        table.render({
            id: "general",
            elem: "#generalTable",
            data: data.data,
            // 设置表头参数
            cols: [
                [
                    {field: 'id', title: '序号', width: '5%'}
                    , {field: 'mould', title: '模板名称', width: '25%'}
                    , {field: 'title', title: '信息内容', width: '25%'}
                    , {
                    title: '创建日期', width: '20%', templet: function (d) {
                        if (d.addState == '0') {
                            return d.openTime;
                        } else {
                            return '系统内置';
                        }
                    }
                }
                    , {
                    title: '操作', width: '25%', templet: function (d) {
                        if (d.addState == '0') {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>';
                        } else {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>';
                        }

                    }
                }
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurrGeneral(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
                if (!first) {
                    pageFlag = false;
                    getCadreListGeneral(obj.curr, obj.limit)
                }
            });
        }
    }
    // 加载数据
    function getCadreListGeneral(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.state == "200") {
                    tablePlayGeneral(res.result); //列表渲染
                    laypageCurrGeneral(res.result); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }
    // 初始化加载
    getCadreListGeneral();

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'detail') { // 查看详情
            var detail = layer.open({
                type: 1 //此处以iframe举例
                , title: '详情'
                , area: ['900px', '460px']
                , shade: 0
                , maxmin: true
                , content: $('#deContent')
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero); //层置顶
                }
            });
            //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
            $(window).resize(function () {
                layui.layer.full(detail);
            });
            layui.layer.full(detail);
            // 列表渲染
            function tablePlayDe(data) {
                table.render({
                    id: "de",
                    elem: "#deTable",
                    data: data.data,
                    // 设置表头参数
                    cols: [
                        [
                            {field: 'id', title: '序号', width: '10%'}
                            , {field: 'guideCard', title: '京卡卡号', width: '20%'}
                            , {field: 'realName', title: '姓名', width: '10%'}
                            , {field: 'company', title: '所属单位', width: '15%'}
                            , {
                            field: 'sex', title: '性别', width: '10%', templet: function (d) {
                                if (d.sex == '0') {
                                    return '男';
                                } else if (d.sex == '1') {
                                    return '女';
                                }
                            }
                        }
                            , {field: 'idCard', title: '身份证号', width: '15%'}
                            , {field: 'tel', title: '联系方式', width: '15%'}
                        ]
                    ]
                });
            }
            // 分页渲染
            function laypageCurrDe(res) {
                var nums = 10;
                if (pageFlag) {
                    pagination.paging({data: res, num: nums}, function (obj, first) {
                        // obj包含了当前分页的所有参数，比如：
                        // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                        // console.log(obj.limit); // 得到每页显示的条数
                        if (!first) {
                            pageFlag = false;
                            getCadreListDe(obj.curr, obj.limit)
                        }
                    });
                }
            }
            // 加载数据
            function getCadreListDe(pageNumber, pageSize) {
                // 数据加载中loading
                // parent.tools.load();
                var params = new Object();
                params.pageNumber = pageNumber;
                params.pageSize = pageSize;
                $.ajax({
                    url: "../../json/worker.json",
                    type: "GET",
                    data: params,
                    dataType: "json",
                    success: function (res) {
                        if (res.state == "200") {
                            tablePlayDe(res.result); //列表渲染
                            laypageCurrDe(res.result); //分页渲染
                        } else {
                            layer.msg(res.data.msg);
                        }
                    }
                });
            }
            // 初始化加载
            getCadreListDe();
        } else if (obj.event === 'edit') { // 编辑
            projectile.elastic({title: " ", content: $("#popup"), area: ['800px', '306px']}, function () {
                // 监听提交
                form.on('submit(submitData)', function (data) {
                    // 前端测试代码，正式删掉。
                    layer.alert(JSON.stringify(data.field), {
                        title: '最终的提交信息'
                    }, function () {
                        layer.closeAll(); //关闭所有层
                    });
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            });
        } else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该模板吗？', function (index) {
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (obj.event === 'send') { // 发送消息
            window.location.href = "messageAdd.html";
        }
    });

    // 添加管理员弹窗
    $(".add").click(function () {
        projectile.elastic({title: " ", content: $("#popup"), area: ['800px', '306px']}, function () {
            // 监听提交
            form.on('submit(submitData)', function (data) {
                // 前端测试代码，正式删掉。
                layer.alert(JSON.stringify(data.field), {
                    title: '最终的提交信息'
                }, function () {
                    layer.closeAll(); //关闭所有层
                });
                return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        });
    });

    $(".cancelBtn").click(function () {
        layer.closeAll();
    });
});