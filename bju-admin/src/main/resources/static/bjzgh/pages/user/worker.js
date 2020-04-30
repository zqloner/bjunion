/**
 * Created by zhuxq on 2019/9/5.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , pageFlag = true
        ,searchObj = {}
        ,nums = 10//查询参数
        , url = "/enterpriseUser/list";

    // 初始化加载
    getCadreList();
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
                    {field: 'cardId', title: '京卡卡号', width: '10%'}
                    , {field: 'name', title: '姓名', width: '6%'}
                    , {field: 'enterpriseName', title: '所属单位', width: '10%'}
                    , {field: 'sex', title: '性别', width: '6%', templet: function (d) {
                    if (d.sex == "0") {
                        return '女';
                    } else if (d.sex == "1") {
                        return '男';
                    }else{
                        return '';
                    }
                }}
                    , {field: 'age', title: '年龄', width: '6%'}
                    , {field: 'nationName', title: '民族', width: '7%'}
                    , {field: 'health', title: '健康状况', width: '8%', templet: function (d) {
                    if (d.health == "0") {
                        return '健康';
                    } else if (d.health == "1") {
                        return '一般';
                    } else if (d.health == "2") {
                        return '有疾病';
                    }else{
                        return '';
                    }
                }}
                    , {field: 'idcard', title: '身份证号', width: '12%'}
                    , {field: 'phone', title: '联系方式', width: '10%'}
                    , {field: 'job', title: '职务', width: '5%'}
                    , {field: 'honour', title: '所获荣誉', width: '10%'}
                    , {field: 'honourTime', title: '获荣誉时间', width: '10%'}
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
            url: url,
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


    // 导出列表
    $("#export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
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
                window.location.href = "/enterpriseUser/downLoadUsersExcel"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
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
        $("[name=eId]").html(value);
        form.render();
    }
});