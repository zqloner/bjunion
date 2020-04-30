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
        , url = "/leaderLeader/list"
        ,searchObj = {}//查询参数
        ,nums = 10;//每页条数

    // 初始化加载
    getCadreList();

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
                    {field: 'username', title: '账号/手机号', width: '15%'}
                    , {field: 'name', title: '姓名', width: '10%'}
                    , {
                    field: 'sex', title: '性别', width: '10%', templet: function (d) {
                        if (d.sex == "1") {
                            return '男';
                        } else if (d.sex == "0") {
                            return '女';
                        }else{
                            return '';
                        }
                    }
                }
                    , {field: 'age', title: '年龄', width: '10%'}
                    , {field: 'idcard', title: '身份证号', width: '18%'}
                    , {field: 'guideNum', title: '导游证号', width: '15%'}
                    , {
                    title: '操作', width: '22%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">详情</a>';
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

    // 监听提交
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
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href = "/changePageParam?page=user/leaderAddOne&data=" + obj.data.id;
        } else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该账号吗？', function (index) {
                //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存

                delLeader(obj.data.id);
                //向服务端发送删除指令
            });
        } else if (obj.event === 'detail') { // 操作—详情
            window.location.href = "/changePageParam?page=user/leaderDetail&data=" + obj.data.id;
        }
    });

    // 单个添加
    $("#addOne").click(function () {
        window.location.href = "/changePageParam?page=user/leaderAddOne&data=";
    });

    // 批量添加
    $("#addMore").click(function () {
        window.location.href = "/changePage?page=user/leaderAddMore";
    });

    // 删除
    /*$("#delete").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });*/
    function delLeader(id){
        $.ajax({
            url: '/leaderLeader/del/' + id,
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
});