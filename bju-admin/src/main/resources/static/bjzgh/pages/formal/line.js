/**
 * Created by zhuxq on 2019/9/9.
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
        , pageFlag = true
        , typeId = 3 //职工类型
        , limitNumber = 10
        , url = "/formalLineSingUp/list";

    var searchObj = {};

    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        typeId = $(this).data("id");
        searchObj = {};
        pageFlag = true;
        form.val("queryForm", {
            "name": ''
        });
        getCadreList();
        /*table.resize('fine');
        table.resize('general');*/
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
            limit:limitNumber,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '线路', width: '17%'}
                    , {field: 'maxCount', title: '限报人数', width: '10%'}
                    , {field: 'nowCount', title: '已报人数', width: '10%'}
                    , {field: 'timeSum', title: '报名开放时段', width: '20%',templet:function(e){
                    return e.rbeginTime + "-" + e.rendTime;
                }}
                    , {field: 'createTime', title: '添加日期', width: '10%'}
                    , {
                    title: '操作', width: '18%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">详情</a>';
                    }
                }
                    , {
                    title: '是否成团', width: '15%', templet: function (d) {
                        var isTeam = d.isTeam;
                        if(isTeam == undefined){
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="success">成团</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="fail">不成团</a>';
                        }else{
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn unavailable">成团</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn unavailable">不成团</a>';
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
                limitNumber = obj.limit;
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
            success: function (res) {
                if (res.code == 200) {
                    var data = res.data;
                    laypageCurr(data);
                    tablePlay(data.list);
                }else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 初始化加载
    getCadreList();

    // 监听表格操作按钮点击
    function deleteLineById(id) {
        $.ajax({
            url: "/formalLineSingUp/del/" + id,
            type: "GET",
            data: "",
            success: function (res) {
                if (res.code == 200) {
                    layer.msg("删除成功");
                    pageFlag = true;
                    getCadreList();
                }else {
                    layer.msg(res.message);
                }
            }
        });
    }

    table.on('tool(test)', function (obj) {
        var id = obj.data.id;
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href="/formalLineSingUp/lineAdd?userType=" + typeId + "&id=" + id;
        }else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该线路吗？', function (index) {
                deleteLineById(id);
                layer.close(index);
                //向服务端发送删除指令
            });
        }else if (obj.event === 'detail') { // 操作—详情
            window.location.href="/formalLineSingUp/lineDetail?id=" + id + "&type=1";
        }else if (obj.event === 'success') { // 是否成团—成团
            projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                $(".sureBtn").unbind("click").click(function () {
                    changeIsTeam({"id":id,"isTeam":1});
                    layer.closeAll();
                });
                $(".cancelBtn").unbind("click").click(function () {
                    layer.closeAll();
                });
            });
        }else if (obj.event === 'fail') { // 是否成团—不成团
            projectile.elastic({title: "操作提示", content: $("#popup_input"), area: ['520px', '288px']}, function () {
                form.on('submit(submitData)', function (data) {
                    var message = data.field.message.trim();
                    if(message.length == 0){
                        layer.msg("请填写不成团理由");
                        return false;
                    }
                    // 前端测试代码，正式删掉。
                    changeIsTeam({"id":id,"isTeam":0,"message":message});
                    layer.closeAll();
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            });
            $(".cancelBtn").unbind("click").click(function () {
                layer.closeAll();
                return false;
            });
        }
    });

    function changeIsTeam(data){
        $.ajax({
            url: "/formalLineSingUp/isTeam",
            type: "GET",
            data: data,
            success: function (res) {
                if (res.code == 200) {
                    layer.msg("操作成功");
                    getCadreList();
                }else {
                    layer.msg(res.message);
                }
            }
        });
    }

    // 单个添加
    $(".addOne").click(function () {
        window.location.href="/formalLineSingUp/lineAdd?userType=" + typeId;
    });

    // 批量添加
    $(".addMore").click(function () {
        window.location.href="route?name=formal/lineAddMore";
    });
});