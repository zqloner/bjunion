/**
 * Created by zhuxq on 2019/9/10.
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
       // , url = "/leader/json/order.json";

    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        /*table.resize('enquiry');
        table.resize('fine');
        table.resize('general');*/
    });

    // 劳模 表单查询
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
    $("#lmsubmitData").click(function () {
        getCadreList(1,pageSize);
        return false;
    });
    // 优秀 表单查询
   /* form.on('submit(yxsubmitData)', function (data) {
        getCadreListFine();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });*/
    $("#yxsubmitData").click(function () {
        getCadreListFine(1,pageSizeFine);
        return false;
    });
    // 普通 表单查询
    /*form.on('submit(ptsubmitData)', function (data) {
        getCadreListGeneral();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });*/
    $("#ptsubmitData").click(function () {
        getCadreListGeneral(1,pageSizeGeneral);
        return false;
    });
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
                    {field: 'tuanname', title: '线路', width: '25%'}
                    , {
                        field: 'bengintime', title: '疗养日期', width: '35%', templet: function (d) {
                            return '<span>' + d.bengintime + '～'+ d.endtime+'</span> ';
                        }
                    }
                    , {field: 'percount', title: '疗养人员', width: '10%'}
                    , {
                        field: 'tuanstatus', title: '出行状态', width: '15%', templet: function (d) {
                            if (d.tuanstatus == 5||d.tuanstatus == 1||d.tuanstatus == 2) {
                                return '<span class="layui-badge-dot layui-bg-green"></span> 已成团（已购票）';
                            }else if (d.tuanstatus == 3) {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 已成团（待购票） ';
                            }else if (d.tuanstatus == 4) {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 出团中 ';
                            }else if (d.tuanstatus == 6) {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 待结算 ';
                            }else if (d.tuanstatus == 7) {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 已结束';
                            }
                        }
                    }
                    , {
                        title: '操作', width: '15%', templet: function (d) {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look" >查看详情</a>';
                        }
                    }
                ]
            ]
        });
        table.resize('enquiry');
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
    // 劳模 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.usertype = "3";
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        params.linename = $("#lmlinename").val();
        params.linestatus = $("#lmlinestatus").val();
        params.starttime = $("#lmlmstarttime").val();
        params.endtime = $("#lmendtime").val();
        $.ajax({
            url: "/formalLine/getFormalLineList",
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
    // 初始化加载
    getCadreList();
    // 初始化加载
    getCadreListFine();
    // 初始化加载
    getCadreListGeneral();

    // 优秀职工
    // 列表渲染
    function tablePlayFine(data) {
        table.render({
            id:"fine",
            elem: "#fineTable",
            data: data,
            limit: pageSizeFine,
            // 设置表头参数
            cols: [
                [
                    {field: 'tuanname', title: '线路', width: '25%'}
                    , {
                        field: 'bengintime', title: '疗养日期', width: '35%', templet: function (d) {
                            return '<span>' + d.bengintime + '～'+ d.endtime+'</span> ';
                        }
                    }
                    , {field: 'percount', title: '疗养人员', width: '10%'}
                    , {
                        field: 'tuanstatus', title: '出行状态', width: '15%', templet: function (d) {
                            if (d.tuanstatus == '5') {
                                return '<span class="layui-badge-dot layui-bg-green"></span> 已成团（已购票）';
                            }else if (d.tuanstatus == '3') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 已成团（待购票） ';
                            }else if (d.tuanstatus == '4') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 出团中 ';
                            }else if (d.tuanstatus == '6') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 待结算 ';
                            }else if (d.tuanstatus == '7') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 已结束';
                            }
                        }
                    }
                    , {
                        title: '操作', width: '15%', templet: function (d) {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">查看详情</a>';
                        }
                    }
                ]
            ]
        });
        table.resize('fine');
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
    // 优秀 加载数据
    function getCadreListFine(pageNumber, pageSizeFine) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.usertype = "2";
        params.pageNumber = pageNumber;
        params.pageSize = pageSizeFine;
        params.linename = $("#yxlinename").val();
        params.linestatus = $("#yxlinestatus").val();
        params.starttime = $("#yxstarttime").val();
        params.endtime = $("#yxendtime").val();
        $.ajax({
            url: "/formalLine/getFormalLineList",
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
            id:"general",
            elem: "#generalTable",
            data: data,
            limit: pageSizeGeneral,
            // 设置表头参数
            cols: [
                [
                    {field: 'tuanname', title: '线路', width: '25%'}
                    , {
                        field: 'bengintime', title: '疗养日期', width: '35%', templet: function (d) {
                            return '<span>' + d.bengintime + '～'+ d.endtime+'</span> ';
                        }
                    }
                    , {field: 'percount', title: '疗养人员', width: '10%'}
                    , {
                        field: 'tuanstatus', title: '出行状态', width: '15%', templet: function (d) {
                            if (d.tuanstatus == '5') {
                                return '<span class="layui-badge-dot layui-bg-green"></span> 已成团（已购票）';
                            }else if (d.tuanstatus == '3') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 已成团（待购票） ';
                            }else if (d.tuanstatus == '4') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 出团中 ';
                            }else if (d.tuanstatus == '6') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 待结算 ';
                            }else if (d.tuanstatus == '7') {
                                return '<span class="layui-badge-dot layui-bg-gray"></span> 已结束';
                            }
                        }
                    }
                    , {
                        title: '操作', width: '15%', templet: function (d) {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">查看详情</a>';
                        }
                    }
                ]
            ]
        });
        table.resize('general');
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
    //普通 加载数据
    function getCadreListGeneral(pageNumber, pageSizeGeneral) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.usertype = "1";
        params.pageNumber = pageNumber;
        params.pageSize = pageSizeGeneral;
        params.linename = $("#ptlinename").val();
        params.linestatus = $("#ptlinestatus").val();
        params.starttime = $("#ptstarttime").val();
        params.endtime = $("#ptendtime").val();
        $.ajax({
            url: "/formalLine/getFormalLineList",
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


    // 监听表格工具条点击 - 查看详情
    table.on('tool(test)', function (obj) {
        if (obj.event === 'look') { // 操作—查看详情
            var tuanstatus = obj.data.tuanstatus;
            var formalid = obj.data.formalid;
            window.location.href="/formalLine/toDetailPage?tuanstatus="+tuanstatus+"&formalid="+formalid
            // if(obj.data.tuanstatus ==  '0'){//待出行
            //     window.location.href="waitDetail.html"
            // }else{//已出行
            //     window.location.href="pastDetail.html"
            // }
        }
    });

    // 导出列表
    $(".export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_export"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });
    // 判断显示哪个群体数据
    checkshowdata();
    function checkshowdata() {
        var pagedata = $("#pagedata").val();
        element.tabChange('tabChange', pagedata); //假设当前地址为：http://a.com#test1=222，那么选项卡会自动切换到“发送消息”这一项
    }
});