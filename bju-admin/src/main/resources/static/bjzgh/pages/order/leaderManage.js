/**
 * Created by zhuxq on 2019/9/11.
 */
layui.config({
    base: "bjzgh/js/"
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
        //, url = "../../json/worker.json";
        , searchObj = {}//查询参数
        , nums = 10;//每页条数

    var formalId = $("[name=formalId]").val();
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
                    {field: 'name', title: '疗养人姓名', width: '13%'}
                    , {field: 'enterpriseName', title: '所属单位', width: '15%'}
                    , {field: 'cardId', title: '京卡号', width: '15%'}
                    , {field: 'idcard', title: '身份证号', width: '17%'}
                    , {field: 'phone', title: '联系电话', width: '15%'}
                    , {
                    field: 'yesNo', title: '是否出团', width: '10%', templet: function (d) {
                        if (d.yesNo == '0') {
                            return '否';
                        } else if (d.yesNo == '1') {
                            return '是';
                        }else {
                            return '';
                        }
                    }
                }
                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="change">更改路线</a>';
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
        params.formalId = formalId;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/formalLineUser/list',
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

    var userId;
    var oldLineId;
    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'change') { // 操作—审核状态
            projectile.elastic({title: "操作提示", content: $("#popup_input"), area: ['520px', '288px']}, function () {
                userId = obj.data.id;
                oldLineId = obj.data.formalId;
            });
        }
    });


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
        $("[name=enterpriseId]").html(value);
        form.render();
    }

    //线路下拉框
    getLineAll();
    function getLineAll(){
        $.ajax({
            url: '/formalLineSingUp/listNoPageIsTeam',
            type: "GET",
            //data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    //组装下拉框
                    dealLineSelectData(res.data);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    //组装下拉框
    function dealLineSelectData(data) {
        var value = "";
        if(data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                value += "<option value=" + data[i].id + ">" + data[i].name+'('+data[i].sBenginTime+'-'+data[i].sEndTime+')'+"</option>"
            }
        }
        $("[name=lineId]").html(value);
        form.render();
    }

    //更改路线
    $("#updateBtn").click(function(){
        var otherLineId = $("[name=lineId]").val();
        var data = new Object();
        data.userId = userId;
        data.oldLineId = oldLineId;
        data.otherLineId = $("[name=lineId]").val();
        $.ajax({
            url: '/formalLineUser/change',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    layer.closeAll();
                    layer.msg("修改成功！");
                    getCadreList();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    })
    $(".cancelBtn").click(function () {
        layer.closeAll();
    });
});