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
        , searchObj = {}//查询参数
        , nums = 10;//每页条数
        //, url = "../../json/news.json";

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
            //id:"enquiry",
            elem: "#table",
            data: data,
            limit:nums,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '线路名称', width: '40%'}
                    , {field: 'createTime', title: '添加时间', width: '20%'}
                    , {field: 'creatorName', title: '上传者', width: '15%'}
                    , {
                    title: '操作', width: '25%', templet: function (d) {
                        if (d.status == "0") {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="up" style="color: #9ea5bd">上架</a>';
                        } else {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="down">下架</a>';
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
            url: '/lineLine/list',
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

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href = "/changePageParam?page=website/routeAdd&data="+ obj.data.id;
        } else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该线路吗？', function (index) {
                //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                //layer.close(index);
                //向服务端发送删除指令
                delRoute(obj.data.id);
            });
        } else if (obj.event === 'up') { // 操作—上架
            projectile.elastic({title: "操作提示", content: $("#popup_up"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    var data = new Object();
                    data.id = obj.data.id;
                    data.status = 1;
                    updateRoute(data);

                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
            });
        } else if (obj.event === 'down') { // 操作—下架
            projectile.elastic({title: "操作提示", content: $("#popup_down"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    var data = new Object();
                    data.id = obj.data.id;
                    data.status = 0;
                    updateRoute(data);
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
            });
        }
    });

    //删除
    function delRoute(id){
        $.ajax({
            url: '/lineLine/del/' + id,
            type: "DELETE",
            //data: {"id":id},
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    layer.msg("删除成功！");
                    getCadreList(null, null);
                    //layer.close();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    //上架&下架
    function updateRoute(data){
        $.ajax({
            url: '/lineLine/update',
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    layer.closeAll(); //关闭所有层
                    layer.msg("操作成功！");
                    getCadreList(null, null);
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 添加
    $("#add").click(function () {
        window.location.href = "/changePageParam?page=website/routeAdd&data=";
    });
});