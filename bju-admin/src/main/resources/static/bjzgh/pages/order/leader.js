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
        , searchObj = {}//查询参数
        , userType = 3
        , nums = 10;//每页条数
        //, url = "../../json/order.json";

    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        $("[name=name]").val('');
        searchObj = {};
        userType = $(this).data("id");
        getCadreList();
        //table.resize('fine');
        //table.resize('general');
    });
    // 初始化加载
    getCadreList();

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
                    {field: 'name', title: '线路', width: '20%'}
                    , {field: 'time', title: '疗养日期', width: '20%',templet: function (d) {
                        return d.sbenginTime + '-'  + d.sendTime;
                    }}
                    , {field: 'maxCount', title: '限报人数', width: '10%'}
                    , {field: 'nowCount', title: '报名人数', width: '10%'}
                    , {
                    /**
                     *  1 报名中，2 未成团，3 已经成团（待出团），4 出团中，5 票务购票，6 待结算，7 已结束
                     */
                    field: 'lineStatus', title: '出团状态', width: '10%', templet: function (d) {
                        if (d.lineStatus == '1') {
                            return '<span class="layui-badge-dot layui-bg-green"></span> 报名中';
                        } else if (d.lineStatus == '2') {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 未成团';
                        } else if (d.lineStatus == '3') {
                            return '<span class="layui-badge-dot"></span> 待出团';
                        } else if (d.lineStatus == '4') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 出团中';
                        } else if (d.lineStatus == '5') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 票务购票';
                        } else if (d.lineStatus == '6') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 待结算';
                        } else if (d.lineStatus == '7') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 已结束';
                        }
                    }
                }
                    , {
                    title: '领队管理', width: '20%', templet: function (d) {
                        if (d.leaderName == undefined || d.leaderName == '') {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">添加领队</a>';
                        }else{
                            return '<span class="leaderName">'+d.leaderName+'</span><a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">修改</a>';
                        }

                    }
                }
                    , {
                    title: '人员管理', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="people">人员管理</a>';
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
        params.userType = userType;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/formalLine/flLeaderList',
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
        if (obj.event === 'add') { // 添加领队
            window.location.href = '/route?page=order/leaderAdd&id='+ obj.data.id + "&status=add";
        } else if (obj.event === 'people') { // 人员管理
            window.location.href = "/changePageParam?page=order/leaderManage&data="+ obj.data.id;
        } else if (obj.event === 'edit') { // 修改领队
            window.location.href = '/route?page=order/leaderAdd&id='+ obj.data.id + "&status=update";
        }
    });
});