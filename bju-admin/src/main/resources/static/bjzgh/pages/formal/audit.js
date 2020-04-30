/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , pageFlag = true
        , pageFlagUser = true
        , typeId = 3 //职工类型
        , url = "/formalLineEnterprise/list";

    var searchObj = {};
    var searchObjUser = {};


    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        typeId = $(this).data("id");
        searchObj = {};
        pageFlag = true;
        form.val("queryForm", {
            "name": ''
        });
        getCadreList();
        // table.resize('fine');
        // table.resize('general');
    });

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

    // 劳模职工
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id:"enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'enterpriseName', title: '企业名称', width: '15%'}
                    , {field: 'lineName', title: '线路名称', width: '20%'}
                    , {field: 'regDate', title: '报名时间', width: '10%', }
                    , {field: 'maxCount', title: '限报人数', width: '10%'}
                    , {field: 'nowCount', title: '报名人数', width: '10%', templet: function (d) {
                    return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="num">'+d.nowCount+'</a>';
                }}
                    , {
                    field: 'state', title: '审核状态', width: '15%', templet: function (d) {
                        var examineStatus = d.examineStatus;
                        if (examineStatus == 1) {
                            return '<span class="layui-badge-dot layui-bg-gray"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">未审核</a>';
                        } else if (examineStatus == 2) {
                            return '<span class="layui-badge-dot layui-bg-blue"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核中</a>';
                        } else if (examineStatus == 3) {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核通过</a>';
                        } else if (examineStatus == 4) {
                            return '<span class="layui-badge-dot"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核未通过</a>';
                        }
                    }
                }
                    , {
                    title: '操作', width: '20%', templet: function (d) {
                        var examineStatus = d.examineStatus;
                        var pid = d.pid;
                        if((examineStatus == 1 && pid==1) || examineStatus == 2){
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
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
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
        params.userType = typeId;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
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

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        var id = obj.data.id;
        if (obj.event === 'progress') { // 操作—审核状态
            $.ajax({
                url: "/formalLineExamine/examineList",
                type: "GET",
                data: {"formalLineEnterpriseId":id},
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
        }else if (obj.event === 'pass') { // 操作—通过
            projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    changeStatus({"formalLineEnterpriseId": id, "examineStatus": 1});
                    layer.closeAll();
                });
                $(".cancelBtn").unbind("click").click(function () {
                    layer.closeAll();
                });
            });
        } else if (obj.event === 'notPass') { // 操作—不通过
            projectile.elastic({title: "操作提示", content: $("#popup_input"), area: ['520px', '288px']}, function () {
                //表单初始赋值
                form.val("failedForm", {"message": ''});
                form.on('submit(submitData)', function (data) {
                    if(data.field.message.trim().length == 0){
                        layer.msg('请输入不通过原因');
                        return false;
                    }
                    changeStatus({"formalLineEnterpriseId": id, "examineStatus": 0,"message":data.field.message.trim()});
                    layer.closeAll();
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            });
        }else if (obj.event === 'num') { // 报名人数
            projectile.elastic({title: "名单", content: $("#popup_table"), area: ['1000px', '488px']}, function () {
                pageFlagUser = true;
                searchObjUser.lineEnterpriseId = id;
                getCadreListNumPop(null,null,id);
                // 列表渲染
                function tablePlayNumPop(data) {
                    table.render({
                        //id:"enquiry",
                        elem: "#popTable",
                        data: data,
                        // 设置表头参数
                        cols: [
                            [
                                {field: 'cardId', title: '京卡卡号', width: '10%'}
                                , {field: 'name', title: '姓名', width: '8%'}
                                , {field: 'enterpriseName', title: '所属单位', width: '10%'}
                                , {field: 'sex', title: '性别', width: '8%', templet: function (d) {
                                if (d.sex == 1) {
                                    return '男';
                                } else if (d.sex == 0) {
                                    return '女';
                                }
                            }}
                                , {field: 'age', title: '年龄', width: '8%'}
                                , {field: 'idcard', title: '身份证号', width: '14%'}
                                , {field: 'phone', title: '联系方式', width: '12%'}
                                , {field: 'job', title: '职务', width: '10%'}
                                , {field: 'honour', title: '所获荣誉', width: '10%'}
                                , {field: 'honourTime', title: '获荣誉时间', width: '10%'}
                            ]
                        ]
                    });
                }

                // 分页渲染
                function laypageCurrNumPop(res) {
                    res.elem = "popPage";
                    var nums = 10;
                    if (pageFlagUser) {
                        pagination.paging({data: res, num: nums}, function (obj, first) {
                            if (!first) {
                                pageFlagUser = false;
                                getCadreListNumPop(obj.curr, obj.limit)
                            }
                        });
                    }
                }

                // 加载数据
                function getCadreListNumPop(pageNumber, pageSize) {
                    // 数据加载中loading
                    // parent.tools.load();
                    var params = searchObjUser;
                    params.pageNum = pageNumber;
                    params.pageSize = pageSize;
                    $.ajax({
                        url: "/formalLineUser/list",
                        type: "GET",
                        data: params,
                        // dataType:"json",
                        success: function (res) {
                            if (res.code == 200) {
                                tablePlayNumPop(res.data.list); //列表渲染
                                laypageCurrNumPop(res.data); //分页渲染
                            } else {
                                layer.msg(res.message);
                            }
                        }
                    });
                }
                // 初始化加载
                // getCadreListNumPop();
            });
        }
    });
    function dealExamineHtml(res) {
        var value = "";
        for(var i = 0;i < res.length;i++){
            var currentObj = res[i];
            var examineStatusValue;
            if(currentObj.examineStatus == 0){
                examineStatusValue = "未通过";
            }else if(currentObj.examineStatus == 1){
                examineStatusValue = "通过";
            }else if(currentObj.examineStatus == 2){
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
    function changeStatus(data){
        $.ajax({
            url: "/formalLineExamine/examine",
            type: "GET",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    layer.msg("操作成功");
                    getCadreList();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    getEnterpriseAll();
    var enterprises = [];
    function dealEnterprise() {
        var value = "<option value=''>请选择</option>";
        for(var i = 0;i < enterprises.length;i++){
            var obj = enterprises[i];
            if(obj.pid == 1){
                value += "<option value="+ obj.id +">"+ obj.name +"</option>";
            }
        }
        $("[name=pId]").html(value);
        form.render();
    }
    function getEnterpriseById(id) {
        var arr = [];
        for(var i = 0;i < enterprises.length;i++){
            var obj = enterprises[i];
            if(obj.pid == id){
                arr.push(obj);
            }
        }
        return arr;
    }
    form.on('select(pId)', function (data) {
        $("[name=eId]").html('<option value="">请选择</option>');
        form.render();
        if(data.value != ""){
            var data = getEnterpriseById(Number(data.value));
            var value = "<option value=''>请选择</option>";
            for(var i = 0;i < data.length;i++){
                var obj = data[i];
                value += "<option value="+ obj.id +">"+ obj.name +"</option>";
            }
            $("[name=eId]").html(value);
            form.render();
        }
        return false;
    });
    function getEnterpriseAll(data){
        $.ajax({
            url: "/enterpriseEnterprise/getEnterpriseAll",
            type: "GET",
            data: "",
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    enterprises = res.data;
                    dealEnterprise();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
});