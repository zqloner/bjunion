/**
 * Created by zhuxq on 2019/9/5.
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
       // , url = "../../json/news.json";

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
                    {field: 'name', title: '疗养院名称', width: '45%'}
                    , {field: 'area', title: '所在地区', width: '25%'}
                    , {
                    title: '操作', width: '30%', templet: function (d) {
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
            url: '/sanatoriumSanatorium/lsit',
            type: "POST",
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

    //加载content
    // 监听表格操作按钮点击
    function getById(myId) {
        $.ajax({
            url: '/sanatoriumSanatorium/' + myId,
            type: "GET",
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
    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href = "/changePageParam?page=website/manageAdd&data=" + obj.data.id;
        } else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该疗养院吗？', function (index) {
                delSanatorium(obj.data.id);
                //obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                //layer.close(index);
                //向服务端发送删除指令
            });
        } else if (obj.event === 'detail') { // 操作—详情
            getById(obj.data.id);
        }
    });

    //删除
    function delSanatorium(id){
        $.ajax({
            url: '/sanatoriumSanatorium/delete/' + id,
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
    // 添加
    $("#add").click(function () {
        window.location.href = "/changePageParam?page=website/manageAdd&data=";
    });

    //获取省
    getProvinceList();
    function getProvinceList() {
        $.ajax({
            type:"GET",
            //data:data,
            url:"/sysArea/pList",
            success:function(data){
                if(data.code == 200){
                    var result = data.data;
                    var value = '<option value="">请选择省</option>';
                    for(var i = 0; i < result.length; i++){
                        value += '<option value='+ result[i].id +'>'+ result[i].regionName +'</option>';
                    }
                    $("[name=pId]").html(value);
                    form.render();
                }else{
                    layer.msg(data.message);
                }
            }
        });
    }
    //通过省id获取市
    form.on('select(pId)', function (data) {
        $("[name=cId]").html('<option value="">请选择市</option>');
        form.render();
        if(data.value != ""){
            var arr = getAreaById(data.value);
            var value = '<option value="">请选择市</option>';
            for(var i = 0; i < arr.length; i++){
                value += '<option value='+ arr[i].id +'>'+ arr[i].regionName +'</option>';
            }
            $("[name=cId]").html(value);
            form.render();
        }
        return false;
    });
    function getAreaById(id) {
        var result;
        var data = {
            "pid":id
        }
        $.ajax({
            type:"GET",
            data:data,
            url:"/sysArea/cList",
            success:function(data){
                if(data.code == 200){
                    result = data.data;
                }else{
                    layer.msg(data.message);
                }
            }, async:false

        });
        return result;
    }

});