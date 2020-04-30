/**
 * Created by zhuxq on 2019/9/11.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义分页
        , pageFlag = true
        //, url = "../../json/company.json";
        , searchObj = {}//查询参数
        , nums = 10;//每页条数

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
            id: "enquiry",
            elem: "#table",
            data: data,
            limit:nums,
            // 设置表头参数
            cols: [
                [
                    {field: 'leaderName', title: '发起人', width: '8%'}
                    , {field: 'username', title: '手机号', width: '11%'}
                    , {field: 'lineName', title: '疗养线路', width: '11%'}
                    , {field: 'timeSum', title: '疗养日期', width: '10%',templet:function (d){
                        return d.start + "-" + d.end;
                    }}
                    , {field: 'nowCount', title: '疗养人数', width: '9%'}
                    , {field: 'price', title: '新增费用', width: '9%'}
                    , {field: 'createTime', title: '发起时间', width: '10%'}
                    , {
                    title: '费用详情', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">查看详情</a>';
                    }
                }
                    , {
                    field: 'examineStatus', title: '审核状态', width: '12%', templet: function (d) {
                        if (d.examineStatus == 2) {
                            return '<span class="layui-badge-dot"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn"  lay-event="progress">审核不通过</a>';
                        } else if (d.examineStatus == 1) {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn"  lay-event="progress">审核通过</a>';
                        }else if (d.examineStatus == 0) {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn"  lay-event="progress">未审核</a>';
                        }
                    }
                }
                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        if (d.examineStatus == 0){
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="pass">通过</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="notPass">不通过</a>';
                        }else{
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs layui-btn-disabled">通过</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs layui-btn-disabled">不通过</a>';
                        }
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
    // 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        var params = searchObj;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/formalCost/getLeaderCostList',
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

    //审核状态
    function updateStauts(data){
        $.ajax({
            url: '/formalCostExamine/update',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    layer.closeAll();
                    layer.msg('操作成功！');
                    pageFlag = true;
                    getCadreList(null,null);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        var id = obj.data.formalId;
        var costId = obj.data.costId;
        if (obj.event === 'progress') { // 操作—审核状态
            $.ajax({
                url: "/formalCostExamine/getExamineList/" + id,
                type: "GET",
                data: "",
                // dataType:"json",
                success: function (res) {
                    if (res.code == 200) {
                        dealExamineHtml(res.data);
                        projectile.elastic({title: " ", content: $("#popup"), area: ['600px', '486px']}, function () {

                        });
                    } else {
                        layer.msg(res.message);
                    }
                }
            });
        } else if (obj.event === 'pass') { // 操作—通过
            projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    var param = new Object();
                    param.examineStatus = 1;
                    param.id = costId;
                    updateStauts(param);
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                    return false;
                });
            });
        } else if (obj.event === 'notPass') { // 操作—不通过
            projectile.elastic({title: "操作提示", content: $("#popup_input"), area: ['520px', '288px']}, function () {
                $("[name=msg]").val('');
                form.on('submit(submitData)', function (data) {
                    var msg = $("[name=msg]").val();
                    var param = new Object();
                    param.message = msg;//不通过原因
                    param.examineStatus = 2;//不通过
                    param.id = costId;//企业id
                    updateStauts(param);
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                    return false;
                });
            });
        } else if (obj.event === 'detail') { // 费用详情
            var detail = layer.open({
                type: 1 //此处以iframe举例
                , title: '详情'
                , area: ['900px', '460px']
                , shade: 0
                , maxmin: true
                , content: $('#preContent')
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero); //层置顶
                    getDetailById(id);
                }
            });
            //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
            $(window).resize(function () {
                layui.layer.full(detail);
            });
            layui.layer.full(detail);
        }
    });
    function getDetailById(id) {
        $.ajax({
            url: '/formalCost/getByIdForLeader/',
            type: "GET",
            data: {"id":id},
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    var currentObj = res.data;
                    $("#lineName").html(currentObj.lineName);
                    $("#price").html(currentObj.price);
                    $("#nowCount").html(currentObj.nowCount);
                    $("#sanatorName").html(currentObj.sanatorName);
                    $("#time").html(currentObj.sbenginTime + "-" + currentObj.sendTime);
                    tablePlayGeneral(currentObj.infos);
                    dealEnclosure(currentObj.appends);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    function dealEnclosure(data){
        var value = "";
        for(var i = 0;i < data.length;i++) {
            // value += '<p class="deP">'+
            //     '            '+ data[i].name +' <a class="deA" target="_blank" href="'+ data[i].url +'">在线预览</a> <a class="deA" href="'+ data[i].url +'" download="">下载</a>'+
            //     '        </p>';
            value += '<p class="deP">'+
                '            '+ data[i].name +' <a class="deA" target="_blank" href="'+ data[i].url +'">在线预览</a> '+
                '        </p>';
        }
        $("#enclosure").after(value);
    }
    // 列表渲染
    function tablePlayGeneral(data) {
        table.render({
            id: "general",
            elem: "#generalTable",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'costType', title: '费用类型', width: '20%',templet:function (d){
                        var costType = d.costType;
                        return costType == 1 ? "团体" : "个人";
                    }}
                    , {field: 'costInfo', title: '费用明细', width: '20%'}
                    , {field: 'costUser', title: '消费人', width: '20%'}
                    , {field: 'price', title: '消费总额', width: '20%'}
                    , {field: 'remarks', title: '备注', width: '20%'}
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
                console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); // 得到每页显示的条数
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
        console.log(pageNumber);
        console.log(pageSize);
        $.ajax({
            url: "../../json/cost.json",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (res) {
                console.log(res);
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
    function dealExamineHtml(res) {
        var value = "";
        for(var i = 0;i < res.length;i++){
            var currentObj = res[i];
            var examineStatusValue;
            if(currentObj.examineStatus == 2){
                examineStatusValue = "未通过";
            }else if(currentObj.examineStatus == 1){
                examineStatusValue = "通过";
            }else if(currentObj.examineStatus == 0){
                examineStatusValue = "待审核";
            }
            value += '<li class="layui-timeline-item">'+
                '            <i class="layui-icon layui-timeline-axis">'+ (res.length - i) +'</i>'+
                '            <div class="layui-timeline-content layui-text">'+
                '                <div class="layui-timeline-title">'+
                (currentObj.examineName == undefined ? "" : "申请单位：") +'<span class="layui-timeline-span">'+ (currentObj.examineName == undefined ? "" : currentObj.examineName) +'</span>'+
                '                </div>'+
                '                <div class="layui-timeline-title">'+
                '                    审核日期：<span class="layui-timeline-span">'+ currentObj.createTime +'</span>'+
                '                </div>'+
                '                <div class="layui-timeline-title">'+
                (examineStatusValue == undefined ? "" : "审核状态：") +'<span class="layui-timeline-span">'+ (examineStatusValue == undefined ? "" : examineStatusValue) +'</span>'+
                '                </div>'+
                '                <div class="layui-timeline-title">'+
                ((currentObj.message != undefined && currentObj.examineStatus == 0) ? "原因：" : "") +'<span class="layui-timeline-span">'+ ((currentObj.message != undefined && currentObj.examineStatus == 0) ? currentObj.message : "") +'</span>'+
                '                </div>'+
                '            </div>'+
                '        </li>';;
        }
        $("#examineInfo").html(value);
    }

    // 导出列表
    $(".export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_export"), area: ['520px', '288px']}, function () {
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
                window.location.href = "/formalCost/downloadLeaderCost"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });
});