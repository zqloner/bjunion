/**
 * Created by zhuxq on 2019/9/5.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择
        , pageFlag = true
        , url = "../bjzgh/json/news.json";

    var searchObj = {};
    // 表单查询
    form.on('submit(submitData)', function (data) {
        pageFlag = true;
        searchObj.type = data.field.kind;
        searchObj.title = data.field.title;
        searchObj.startTime = data.field.start;
        searchObj.endTime = data.field.end;
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 列表渲染
    function tablePlay(data) {
        table.render({
            id:"enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'title', title: '标题', width: '35%'}
                    , {
                    field: 'type', title: '分类', width: '15%', templet: function (d) {
                        if (d.type == "2") {
                            return '通知公告';
                        } else if (d.type == "1") {
                            return '新闻动态';
                        }else if (d.type == "3") {
                            return '首页banner';
                        }else if (d.type == "4") {
                            return '公告banner';
                        }

                    }
                }
                    , {field: 'createTime', title: '添加时间', width: '15%'}
                    , {field: 'author', title: '作者', width: '15%'}
                    , {
                    field:'sort',title: '操作', width: '20%', templet: function (d) {
                        if(d.sort == "0"){
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="top">置顶</ a>'  ;
                        }else {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="cancelTop">取消置顶</ a>'  ;
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
                // obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); // 得到每页显示的条数
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    // 加载数据
    function getCadreList(pageNum, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNum = pageNum;
        params.pageSize = pageSize;
        searchObj.pageNum = pageNum;
        searchObj.pageSize = pageSize;
        params.type = searchObj.type;
        params.title = searchObj.title;
        params.startTime = searchObj.startTime;
        params.endTime = searchObj.endTime;
        $.ajax({
            url:"/sysNews/getNews" ,
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    tablePlay(res.data.list);
                    laypageCurr(res.data);
                    // window.location.href="route?name=system/partSet"
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    // 初始化加载
    getCadreList();

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href="route?name=website/newsAdd&newsId="+obj.data.id;
        } else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该文章吗？', function (index) {
                $.ajax({
                    url:"/sysNews/delete" ,
                    type:"GET" ,
                    data:{"id":obj.data.id},
                    success:function (res) {
                        if(res.code==200){
                            window.location.href="route?name=website/news"
                        }else {
                            layer.alert(res.message);
                        }
                    } ,
                    dataType:"json"
                });
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
            });
        }else if (obj.event === 'top') { // 操作—置顶
            $.ajax({
                url:"/sysNews/toTop" ,
                type:"GET" ,
                data:{"id":obj.data.id},
                success:function (res) {
                    if(res.code==200){
                        getCadreList(searchObj.pageNum,searchObj.pageSize);
                    }else {
                        layer.alert(res.message);
                    }
                } ,
                dataType:"json"
            });
        }
        else if (obj.event === 'cancelTop') { // 操作—置顶
            $.ajax({
                url:"/sysNews/cancelTop" ,
                type:"GET" ,
                data:{"id":obj.data.id},
                success:function (res) {
                    if(res.code==200){
                        getCadreList(searchObj.pageNum,searchObj.pageSize);
                    }else {
                        layer.alert(res.message);
                    }
                } ,
                dataType:"json"
            });
        }
    });

    // 添加
    $("#add").click(function () {
        window.location.href="route?name=website/newsAdd";
    });
});