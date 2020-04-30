/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , pageFlag = true
        //, url = "../../json/company.json";
        , searchObj = {}//查询参数
        , userType = 3
        , nums = 10;//每页条数

    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        $("[name=name]").val('');
        searchObj = {};
        userType = $(this).data("id");
        getCadreList();
        /*table.resize('fine');
        table.resize('general');*/
    });

    // 表单查询
    form.on('submit(submitData)', function (data) {
        var field = data.field;
        if(field.name != ''){
            searchObj.name = field.name;
        }
        pageFlag = true;
        getCadreList(null, null);
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 劳模职工
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
                    {field: 'name', title: '线路', width: '25%'}
                    , {field: 'timeSum', title: '疗养日期', width: '20%',templet: function(d){
                        return d.sBenginTime + '-'  + d.sEndTime;
                    }}
                    , {field: 'personCount', title: '网报疗养人员', width: '15%'}
                    , {field: 'nowCount', title: '实际疗养人员', width: '15%'}
                    , {field: 'leaderName', title: '领队', width: '15%'}
                    , {
                    title: '票务添加', width: '10%', templet: function (d) {
                        if (d.lineStatus == '5') {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">添加</a>';
                        } else {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">查看</a>';
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
        var params = searchObj;
        params.userType = userType;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/ticketInfo/list',
            type: "GET",
            data: params,
            dataType: "json",
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

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'add') { // 添加
            window.location.href = "/changePageParam?page=order/ticketAdd&data="+ obj.data.id;
        } else if (obj.event === 'look') { // 查看
            window.location.href = "/changePageParam?page=order/ticketAdd&data="+ obj.data.id;
        }
    });
});