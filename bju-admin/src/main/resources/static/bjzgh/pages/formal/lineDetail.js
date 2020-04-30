/**
 * Created by zhuxq on 2019/9/10.
 */
layui.config({
    base: "/bjzgh/js/"
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
        , pageFlagUser = true
        , url = "/formalLineEnterprise/list";

    var searchObj = {};
    var searchObjUser = {};


    // 列表渲染
    function tablePlay(data) {
        table.render({
            id:"enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'enterpriseName', title: '单位名称', width: '20%'}
                    , {field: 'maxCount', title: '限报人数', width: '15%'}
                    , {field: 'nowCount', title: '已报人数', width: '15%'}
                    , {
                    title: '操作', width: '20%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">查看名单</a>';
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
        params.formalId = id;
        params.examineStatus = 3;//查询通过的
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            success: function (res) {
                if (res.code == 200) {
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

    table.on('tool(test)', function (obj) {
        var enterpriseId = obj.data.enterpriseId;
        var formalId = obj.data.id;
        if (obj.event === 'look') { // 查看名单
            projectile.elastic({title: "查看名单", content: $("#popup"), area: ['900px', '488px']}, function () {
                // 初始化加载
                pageFlagUser = true;
                searchObjUser = {};
                // searchObjUser.formalId = 2;
                // searchObjUser.enterpriseId = 9;

                searchObjUser.lineEnterpriseId = formalId;
                searchObjUser.enterpriseId = enterpriseId;
                getCadreListPop();
            });
        }
    });
    // 表单查询
    form.on('submit(define)', function (data) {
        window.location.href = "/route?name=formal/line";
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    // 列表渲染

    function tablePlayPop(data) {
        table.render({
            id:"popTable",
            elem: "#popTable",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '姓名', width: '10%'}
                    , {field: 'enterpriseName', title: '所属单位', width: '15%'}
                    , {field: 'cardId', title: '京卡号', width: '15%'}
                    , {field: 'idcard', title: '身份证号', width: '15%'}
                    , {field: 'phone', title: '联系方式', width: '15%'}
/*                    , {field: 'title', title: '疗养线路', width: '15%'}
                    , {field: 'winTime', title: '疗养日期', width: '15%'}*/
                ]
            ]
        });
    }

    // 分页渲染
    function laypageCurrPop(res) {
        res.elem = "popPage";
        var nums = 10;
        if (pageFlagUser) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                if (!first) {
                    pageFlagUser = false;
                    getCadreListPop(obj.curr, obj.limit)
                }
            });
        }
    }

    // 加载数据
    function getCadreListPop(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = searchObjUser;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: "/formalLineUser/list",
            type: "GET",
            data: params,
            dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    tablePlayPop(res.data.list); //列表渲染
                    laypageCurrPop(res.data); //分页渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
        return false;
    }

    // 表单查询
    form.on('submit(submitData)', function (data) {
        searchObj.enterpriseName = data.field.enterpriseName;
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 导出列表
    $(".export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_export"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                var requestURL = "?formalId="+searchObj.formalId+"&examineStatus=3";
                window.location.href = "/formalLineUser/exportList"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });

});