/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择
        , pageFlag = true
        , nums = 10;
        //, url = "../../json/news.json";

    var searchObj = new Object();
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
                    {field: 'modelName', title: '模块名称', width: '35%'}
                    , {field: 'updateTime', title: '更新日期', width: '35%'}
                    , {
                    title: '操作', width: '30%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="pre">预览</a>';
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
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/sanatoriumBrief/list',
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlay(res.data); //列表渲染
                    //laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 初始化加载
    getCadreList();

    // 监听表格操作按钮点击
    function getById(myId) {
        $.ajax({
            url: '/sanatoriumBrief/getById',
            type: "GET",
            data: {"id": myId},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    searchObj.content = res.data.content;
                    layer.open({
                        type: 1 //此处以iframe举例
                        , title: '预览'
                        , area: ['590px', '460px']
                        , shade: 0
                        , maxmin: true
                        , content: $('#preContent')
                        , zIndex: layer.zIndex
                        , success: function (layero) {
                            layer.setTop(layero); //层置顶
                            $("#content").html(searchObj.content);
                        }
                    });
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href = "/changePageParam?page=website/profileEdit&data=" + obj.data.id;

        } else if (obj.event === 'pre') { // 操作—预览
            getById(obj.data.id);
        }
    });
});