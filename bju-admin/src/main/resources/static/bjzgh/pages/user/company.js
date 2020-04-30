/**
 * Created by zhuxq on 2019/9/17.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'tree'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , pageFlag = true
        , tree = layui.tree
        //, url = "../../json/company.json"
        , url = "/enterpriseEnterprise/getList"
        ,treeData = []
        ,searchObj = {}
        ,searchObjFine = {}
        ,nums = 10
        ,numsFine = 10;//查询参数


    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        table.resize('fine');
    });

    // 初始化加载
    getCadreList();

    // 企业资料审计
    // 列表渲染
    function tablePlay(data) {
        table.render({
            //id:"enquiry",
            elem: "#table",
            data: data,
            limit:nums,
            // 设置表头参数
            cols: [
                [
                    {field: 'account', title: '企业账号', width: '9%'}
                    , {field: 'name', title: '企业名称', width: '9%'}
                    , {
                    field: 'examineStatus', title: '审核状态', width: '9%', templet: function (d) {//1 未审核 2审核中 3审核通过 4审核不通过
                        if (d.examineStatus == "1") {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">未审核</a>';
                        } else if (d.examineStatus == "2") {
                            return '<span class="layui-badge-dot layui-bg-blue"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核中</a>';
                        }else if (d.examineStatus == "3") {
                            return '<span class="layui-badge-dot layui-bg-green"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核通过</a>';
                        }else if (d.examineStatus == "4") {
                            return '<span class="layui-badge-dot"></span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="progress">审核不通过</a>';
                        }
                    }
                }
                    , {field: 'parentName', title: '上级单位', width: '10%'}
                    , {field: 'addressInfo', title: '所在区域', width: '10%'}
                    , {field: 'contacts', title: '联系人姓名', width: '10%'}
                    , {field: 'phone', title: '联系人电话', width: '10%'}
                    , {
                    title: '资质证明', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">点击查看</a>';
                    }
                }
                    , {field: 'createTime', title: '申请时间', width: '10%'}
                    , {
                    title: '操作', width: '13%', templet: function (d) {
                        if (d.examineStatus != "2"){
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs layui-btn-disabled">通过</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs layui-btn-disabled">不通过</a>';
                        }else{
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="pass">通过</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="notPass">不通过</a>';
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
        // parent.tools.load();
        var params = searchObj;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/enterpriseEnterprise/getExamineList',
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
    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'progress') { // 操作—审核状态
            projectile.elastic({title: " ", content: $("#popup"), area: ['600px', '486px']}, function () {
                auditStatus(obj.data);
            });
        } else if (obj.event === 'look') { // 操作—资质证明
            projectile.elastic({title: "", content: $("#prove"), area: ['700px', '486px']}, function () {
                if(obj.data.qaUrl == undefined || obj.data.qaUrl == ''){
                    $("#proveImg").prop("src","");
                }else{
                    $("#proveImg").prop("src",obj.data.qaUrl);
                }
            });
        } else if (obj.event === 'pass') { // 操作—通过
            projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    var param = new Object();
                    param.examineStatus = 1;
                    param.requestName = obj.data.name;
                    param.enterpriseId = obj.data.id;
                    updateStauts(param);
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
            });
        } else if (obj.event === 'notPass') { // 操作—不通过
            projectile.elastic({title: "操作提示", content: $("#popup_input"), area: ['520px', '288px']}, function () {
                $("[name=msg]").val('');
                form.on('submit(submit)', function (data) {
                    var msg = $("[name=msg]").val();
                    var param = new Object();
                    param.message = msg;//不通过原因
                    param.examineStatus = 0;//不通过
                    param.requestName = obj.data.name;//申请单位
                    param.enterpriseId = obj.data.id;//企业id
                    updateStauts(param);
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
            });
        }
    });
    //审核状态
    function updateStauts(data){
        $.ajax({
            url: '/enterpriseExamine/changeStauts',
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
    //查看审核状态
    function auditStatus(data){
        $.ajax({
            url: '/enterpriseExamine/getExamineList',
            type: "GET",
            data: {"enterpriseId":data.id},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    var html = '';
                    if(res.data.length > 0){
                        for(var i=0; i < res.data.length ;i++){
                            var examineStatus = '';
                            if(res.data[i].examineStatus == 0){
                                examineStatus = '未通过';
                            }else if(res.data[i].examineStatus == 1){
                                examineStatus = '通过';
                            }else {
                                examineStatus = '提交申请，等待审核中';
                            }
                            html += '<li class="layui-timeline-item">' +
                                '            <i class="layui-icon layui-timeline-axis">'+ (res.data.length - i) +'</i>' +
                                '            <div class="layui-timeline-content layui-text">' +
                                '                <div class="layui-timeline-title">' +
                                '                    申请单位：<span class="layui-timeline-span">'+(res.data[i].requestName == undefined ? '' :res.data[i].requestName) +'</span>' +
                                '                </div>' +
                                '                <div class="layui-timeline-title">' +
                                '                    审核日期：<span class="layui-timeline-span">'+(res.data[i].createTime == undefined ? '' :res.data[i].createTime)+'</span>' +
                                '                </div>' +
                                '                <div class="layui-timeline-title">' +
                                '                    审核状态：<span class="layui-timeline-span">'+examineStatus+'</span>' +
                                '                </div>';
                            if(res.data[i].examineStatus == 0){
                                html += '<div class="layui-timeline-title">' +
                                '             原因：<span class="layui-timeline-span">'+(res.data[i].message == undefined ? '' :res.data[i].message)+'</span>' +
                                '        </div>';
                            }
                                '            </div>' +
                                '        </li>';
                        }
                    }
                    $("#auditUl").html(html);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 企业管理
    // 树形结构数据
    getEnterpriseAll();
    function getEnterpriseAll(){
        $.ajax({
            url: '/enterpriseEnterprise/getEnterpriseAll',
            type: "GET",
            //data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //组装tree
                    dealTreeData(res.data);
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
        $("[name=pid]").html(value);
        form.render();
    }

    //组装tree
    function dealTreeData(data) {
        if(data.length != 0){
            var arr = [];
            for(var i= 0; i<data.length; i++){
                var obj = {};
                if(data[i].pid == 0){
                    obj["title"] = data[i].name;
                    obj["id"] = data[i].id;
                    obj["spread"] = true;
                    obj["children"] = findChildList(data[i].id,data);
                    arr.push(obj);
                }
            }
            treeData = arr;
            // 树形结构渲染
            tree.render({
                elem: '#tree'
                , id: 'treeId'
                , data: treeData
                , showLine: false  //是否开启连接线
                , click: function (obj) {
                    // 根据点击内容重载表格
                    searchObjFine.pid = obj.data.id;
                    pageFlag = true;
                    getCadreListFine(null,null);
                }
            });
        }
    }
    //组装child
    function findChildList(id,data){
        var arr = [];
        for (var i = 0; i < data.length; i++){
            var obj = {};
            if(id == data[i].pid){
                obj["title"] = data[i].name;
                obj["id"] = data[i].id;
                obj["spread"] = true;
                obj["children"] = findChildList(data[i].id,data);
                arr.push(obj);
            }
        }
        return arr;
    }

    // 列表渲染
    function tablePlayFine(data) {
        table.render({
            id: "fine",
            elem: "#fineTable",
            data: data,
            limit:numsFine,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '企业名称', width: '15%'}
                    , {field: 'account', title: '企业账号', width: '15%'}
                    , {field: 'parentName', title: '上级单位', width: '15%'}
                    , {field: 'contacts', title: '联系人姓名', width: '10%'}
                    , {field: 'phone', title: '联系人电话', width: '10%'}
                    , {field: 'createTime', title: '申请时间', width: '10%'}
                    , {
                    title: '操作', width: '25%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">查看详情</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="change">修改权限</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="pwd">重置密码</a>';
                    }
                }
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurrFine(res) {
        res.elem = 'finePage';
        //var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: numsFine}, function (obj, first) {
                numsFine = obj.limit;
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
        var params = searchObjFine;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlayFine(res.data.list); //列表渲染
                    laypageCurrFine(res.data); //分页渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 初始化加载
    getCadreListFine();
    // 监听表格操作按钮点击
    table.on('tool(fineTool)', function (obj) {
        if (obj.event === 'detail') { // 操作—查看详情
            projectile.elastic({title: " ", content: $("#popup_de"), area: ['800px', '486px']}, function () {
                getInfo(obj.data.id);
            });
        } else if (obj.event === 'change') { // 操作—修改权限
            projectile.elastic({title: "操作提示", content: $("#popup_change"), area: ['520px', '288px']}, function () {
                // 表单提交
                form.on('submit(submitChange)', function (data) {
                    var param = new Object();
                    param.id = obj.data.id;
                    param.pid = data.field.pid;
                    if(param.id == param.pid){
                        layer.msg("不能勾选自己为上级单位！");
                        return false;
                    }
                    update(param);
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });

            });
        } else if (obj.event === 'pwd') { // 操作—重置密码
            projectile.elastic({title: "操作提示", content: $("#popup_pwd"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    var param = new Object();
                    param.id =obj.data.id;
                    param.password =hex_md5("111111");
                    update(param);
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
            });
        }
    });
    
    //查看详情
    function getInfo(id) {
        $.ajax({
            url: '/enterpriseEnterprise/getInfo/'+ id,
            type: "GET",
            //data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    $("#name").html(res.data.name == undefined ? '' : res.data.name);
                    $("#creditCode").html(res.data.creditCode == undefined ? '' : res.data.creditCode);
                    $("#account").html(res.data.account == undefined ? '' : res.data.account);
                    $("#areaName").html(res.data.addressInfo  == undefined ? '' : res.data.addressInfo);
                    $("#contacts").html(res.data.contacts == undefined ? '' : res.data.contacts);
                    $("#mail").html(res.data.mail == undefined ? '' : res.data.mail);
                    $("#phone").html(res.data.phone == undefined ? '' : res.data.phone);
                    $("#qaUrl").prop("src",res.data.qaUrl == undefined ? '' : res.data.qaUrl);
                    $("#parentName").html(res.data.parentName == undefined ? '' : res.data.parentName);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //重置密码&修改权限
    function update(data) {
        $.ajax({
            url: '/enterpriseEnterprise/update',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                layer.closeAll();
                if (res.code == "200") {
                    layer.msg("操作成功！");
                    pageFlag = true;
                    getCadreListFine(null,null);
                    //重新加载树形结构数据
                    getEnterpriseAll();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
});