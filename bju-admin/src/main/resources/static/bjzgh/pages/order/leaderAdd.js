/**
 * Created by zhuxq on 2019/9/11.
 */
layui.config({
    base: "bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true
        , searchObj = {}//查询参数
        , nums = 10;//每页条数
        //, url = "../../json/worker.json";

    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            limit:nums,
            cols: [
                [
                    {field: 'username', title: '', width: '5%', templet: function (d) {
                        return '<input type="radio" name="id" value='+ d.id +'>';
                    }}
                    , {type: 'numbers', title: '序号', width: '10%'}
                    , {field: 'username', title: '账号（手机号）', width: '16%'}
                    , {field: 'name', title: '姓名', width: '12%'}
                    , {
                    field: 'sex', title: '性别', width: '11%', templet: function (d) {
                        if (d.sex == '1') {
                            return '男';
                        } else if (d.sex == '0') {
                            return '女';
                        }
                    }
                }
                    , {field: 'age', title: '年龄', width: '11%'}
                    , {field: 'idcard', title: '身份证号', width: '20%'}
                    , {field: 'guideNum', title: '导游证号', width: '15%'}
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data: res, num: res.pageSize}, function (obj, first) {
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
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/leaderLeader/list',
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    laypageCurr(res.data); //分页渲染
                    tablePlay(res.data.list); //列表渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
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

    // 表单查询
    form.on('submit(choose)', function (data) {
        var param = new Object();
        param.formalLindeId = formalId;
        param.leaderId =  $('input[name="id"]:checked').val();
        if(param.leaderId == ''){
            layer.msg("请选择领队！");
            return false;
        }
        if(status == 'add'){
            updateLeader(param,'/formalLineLeader/addLeader');
        }else if(status == 'update'){
            updateLeader(param,'/formalLineLeader/updateLeader');
        }
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 修改添加领队
    function updateLeader(data,url) {
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    window.location.href = "/changePage?page=order/leader";
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }

    $("#add").click(function(){
        window.location.href = "/changePageParam?page=order/leaderAddOne&data=" + formalId;
    });
});