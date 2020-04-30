/**
 * Created by zhuxq on 2019/9/16.
 */
layui.config({
    base: "/leader/js/"
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
        , pageSize = 10
        , pageSizeFine = 10
        , pageSizeGeneral = 10;
        //, url = "/leader/json/order.json";

    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        table.resize('enquiry');
        table.resize('fine');
        table.resize('general');
    });

    // 劳模 表单查询
    $("#lmsubmitData").click(function () {
        getCadreList(0,pageSize);
        return false;
    });
    /*form.on('submit(lmsubmitData)', function (data) {
        // 前端测试代码，正式删掉。
        // layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function () {
        //     layer.closeAll(); //关闭所有层
        // });
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });*/
    // 优秀 表单查询
    $("#yxsubmitData").click(function () {
        getCadreListFine(0,pageSizeFine);
        return false;
    });
    /*form.on('submit(yxsubmitData)', function (data) {
        getCadreListFine();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });*/
    // 普通 表单查询
    $("#ptsubmitData").click(function () {
        getCadreListGeneral(0,pageSizeGeneral);
        return false;
    });
    /*form.on('submit(yxsubmitData)', function (data) {
        getCadreListGeneral();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });*/
    layui.use('element', function(){
        var element = layui.element;
    });
    // 劳模初始化加载
    getCadreList();
    // 优秀初始化加载
    getCadreListFine();
    // 普通初始化加载
    getCadreListGeneral();
    // 判断显示哪个群体数据
   checkshowdata();

    function checkshowdata() {
        var pagedata = $("#pagedata").val();
        element.tabChange('tabChange', pagedata); //假设当前地址为：http://a.com#test1=222，那么选项卡会自动切换到“发送消息”这一项
    }
    
    // 劳模职工
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            limit: pageSize,
            // 设置表头参数
            cols: [
                [
                    {field: 'linename', title: '疗养线路', width: '19%'}
                    , {
                        field: 'bengintime', title: '疗养日期', width: '25%', templet: function (d) {
                            return '<span>' + d.bengintime + '～'+ d.endtime+'</span> ';
                        }
                    }
                    , {field: 'percount', title: '疗养人数', width: '10%'}
                    , {field: 'price', title: '总费用', width: '8%'}
                    , {field: 'createtime', title: '发起时间', width: '17%'}
                    , {
                    field: 'formalid', title: '审核状态', width: '11%', templet: function (d) {
                        if (d.examinestatus == '1') {
                            return '<span class="layui-badge-dot layui-bg-blue"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核通过</a>';
                        } else if (d.examinestatus == '2') {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核未通过</a>';
                        }else if (d.examinestatus==null||d.examinestatus==undefined||d.examinestatus == '0') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">未审核</a>';
                        }
                    }
                }
                    , {
                        title: '操作', width: '10%', templet: function (d) {
                        //return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">添加费用</a>';
                            if (d.costid !=null ||d.costid !=undefined ){
                                return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">查看详情</a>';
                            }else{
                                return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">添加费用</a>';
                            }
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
                pageSize = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    //劳模 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.usertype = "3";

        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        params.linename = $("#lmlinename").val();
        params.examinestatus = $("#lmstatus").val();
        params.starttime = $("#lmlmstarttime").val();
        params.endtime = $("#lmendtime").val();
        $.ajax({
            url: "/formalCost/getFormalCostList",
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlay(res.data.list); //列表渲染
                    laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }

    // 优秀职工
    // 列表渲染
    function tablePlayFine(data) {
        table.render({
            id: "fine",
            elem: "#fineTable",
            data: data,
            limit: pageSizeFine,
            // 设置表头参数
            cols: [
                [
                    {field: 'linename', title: '疗养线路', width: '19%'}
                    , {
                    field: 'bengintime', title: '疗养日期', width: '25%', templet: function (d) {
                        return '<span>' + d.bengintime + '～'+ d.endtime+'</span> ';
                    }
                }
                    , {field: 'percount', title: '疗养人数', width: '10%'}
                    , {field: 'price', title: '总费用', width: '8%'}
                    , {field: 'createtime', title: '发起时间', width: '17%'}
                    , {
                    field: 'formalid', title: '审核状态', width: '11%', templet: function (d) {
                        if (d.examinestatus == '1') {
                            return '<span class="layui-badge-dot layui-bg-blue"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核通过</a>';
                        } else if (d.examinestatus == '2') {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核未通过</a>';
                        }else if (d.examinestatus==null||d.examinestatus==undefined||d.examinestatus == '0') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">未审核</a>';
                        }
                    }
                }
                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        if (d.costid !=null ||d.costid !=undefined ){
                         return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">查看详情</a>';
                         }else{
                         return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">添加费用</a>';
                         }
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
                pageSizeFine = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreListFine(obj.curr, obj.limit)
                }
            });
        }
    }
    // 优秀职工 加载数据
    function getCadreListFine(pageNumber, pageSizeFine) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.usertype = "2";
        params.pageNumber = pageNumber;
        params.pageSize = pageSizeFine;
        params.linename = $("#yxlinename").val();
        params.examinestatus = $("#yxstatus").val();
        params.starttime = $("#yxstarttime").val();
        params.endtime = $("#yxendtime").val();
        $.ajax({
            url: "/formalCost/getFormalCostList",
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlayFine(res.data.list); //列表渲染
                    laypageCurrFine(res.data); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }

    // 普通职工
    // 列表渲染
    function tablePlayGeneral(data) {
        table.render({
            id: "general",
            elem: "#generalTable",
            data: data,
            limit: pageSizeGeneral,
            // 设置表头参数
            cols: [
                [
                    {field: 'linename', title: '疗养线路', width: '19%'}
                    , {
                    field: 'bengintime', title: '疗养日期', width: '25%', templet: function (d) {
                        return '<span>' + d.bengintime + '～'+ d.endtime+'</span> ';
                    }
                }
                    , {field: 'percount', title: '疗养人数', width: '10%'}
                    , {field: 'price', title: '总费用', width: '8%'}
                    , {field: 'createtime', title: '发起时间', width: '17%'}
                    , {
                    field: 'formalid', title: '审核状态', width: '11%', templet: function (d) {
                        if (d.examinestatus == '1') {
                            return '<span class="layui-badge-dot layui-bg-blue"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核通过</a>';
                        } else if (d.examinestatus == '2') {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核未通过</a>';
                        }else if (d.examinestatus==null||d.examinestatus==undefined||d.examinestatus == '0') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">未审核</a>';
                        }
                    }
                }
                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        if (d.costid !=null ||d.costid !=undefined ){
                         return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">查看详情</a>';
                         }else{
                         return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">添加费用</a>';
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
                pageSizeGeneral = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreListGeneral(obj.curr, obj.limit)
                }
            });
        }
    }
    // 普通职工 加载数据
    function getCadreListGeneral(pageNumber, pageSizeGeneral) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.usertype = "1";
        params.pageNumber = pageNumber;
        params.pageSize = pageSizeGeneral;
        params.linename = $("#ptlinename").val();
        params.examinestatus = $("#ptstatus").val();
        params.starttime = $("#ptstarttime").val();
        params.endtime = $("#ptendtime").val();
        $.ajax({
            url: "/formalCost/getFormalCostList",
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlayGeneral(res.data.list); //列表渲染
                    laypageCurrGeneral(res.data); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }


    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        var pagedata = $("#pagedata").val();
        if (obj.event === 'detail') { // 查看详情
            var formalid = obj.data.formalid;
            var costid = obj.data.costid;
            var lineid = obj.data.lineid;
            window.location.href="/formalCost/tovestMoneyDe?formalid="+formalid+"&costid="+costid+"&lineid="+lineid+"&pagedata="+pagedata;
        } else if (obj.event === 'add') { // 费用添加
            var formalid = obj.data.formalid;
            var lineid = obj.data.lineid;
            window.location.href="/formalCost/tovestMoneyAdd?formalid="+formalid+"&lineid="+lineid+"&pagedata="+pagedata;
        }else if (obj.event === 'progress') { // 操作—审核状态
            if (obj.data.costid !=null ||obj.data.costid !=undefined ){
                $("#shztlb").html("");
                var costid = obj.data.costid;
                projectile.elastic({title: " ", content: $("#popup"), area: ['600px', '486px']}, function () {
                    var params = new Object();
                    params.costid = costid;
                    $.ajax({
                        url: "/formalCost/getCostExamineStatus",
                        type: "get",
                        data: params,
                        // dataType:"json",
                        success: function (res) {
                            if (res.code == "200") {
                                var exdata = res.data;
                                var shhtml = "";
                                for(var i=0;i<exdata.length;i++){
                                    var message = "";
                                    if(exdata[i].message!=null&&exdata[i].message!=undefined){
                                        message = exdata[i].message;
                                    }
                                    var sname = "";
                                    if(exdata[i].sname!=null&&exdata[i].sname!=undefined){
                                        sname = exdata[i].sname;
                                    }
                                    var estatus = exdata[i].estatus;
                                    var createtime = exdata[i].createtime;
                                    shhtml += '<li class="layui-timeline-item">'
                                             + '<i class="layui-icon layui-timeline-axis">'+(exdata.length-i)+'</i>'
                                             + '<div class="layui-timeline-content layui-text">'
                                             + '<div class="layui-timeline-title">'
                                             + '审核人：<span class="layui-timeline-span">'+sname+'</span>'
                                             + '</div>'
                                             + '<div class="layui-timeline-title">'
                                             + '审核日期：<span class="layui-timeline-span">'+createtime+'</span>'
                                             + '</div>'
                                             + '<div class="layui-timeline-title">'
                                             + '审核状态：<span class="layui-timeline-span">'+estatus+'</span>'
                                             + '</div>'
                                             + '<div class="layui-timeline-title">'
                                             + '原因：<span class="layui-timeline-span">'+message+'</span>'
                                             + '</div>'
                                             + '</div>'
                                             + '</li>';
                                }
                                $("#shztlb").append(shhtml);
                            } else {
                                layer.msg(res.data.message);
                            }
                        }
                    });
                });
            }else {
                layer.msg("还未添加费用进行审核！");
            }

        }
    });
});