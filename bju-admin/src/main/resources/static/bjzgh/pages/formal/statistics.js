/**
 * Created by zhuxq on 2019/9/10.
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
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true
        , typeId = 3 //职工类型
        , url = "/formalLineSingUp/statistics";

    var searchObj = {};


    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        typeId = $(this).data("id");
        searchObj = {};
        pageFlag = true;
        getCadreList();
        // table.resize('fine');
        // table.resize('general');
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
            id: "enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '线路名称', width: '28%'}
                    , {field: 'timeSum', title: '疗养时间', width: '20%', templet: function (d) {
                    return d.sbenginTime + "-" + d.sendTime;
                }
                }
                    , {
                    field: 'isTeam', title: '线路成团状态', width: '15%', templet: function (d) {
                        var lineStatus = d.lineStatus;
                        if (lineStatus == 3) {
                            return '<span class="layui-badge-dot layui-bg-green"></span> 已成团';
                        }else if (lineStatus == 2) {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 未成团';
                        }else if (lineStatus == 1) {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 报名中';
                        }else if (lineStatus == 4) {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 出团中';
                        }else if (lineStatus == 5) {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 票务购票';
                        }else if (lineStatus == 6) {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 待结算';
                        }else if (lineStatus == 7) {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 已结束';
                        } else{
                            return "";
                        }
                    }
                }
                    , {field: 'maxCount', title: '限报人数', width: '11%'}
                    , {field: 'nowCount', title: '报名人数', width: '11%'}
                    , {
                    title: '操作', width: '15%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="look">查看详情</a>';
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
        params.userType = typeId;
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            // dataType:"json",
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

    // 监听表格工具条点击
    table.on('tool(test)', function (obj) {
        var id = obj.data.id;
        if (obj.event === 'look') { // 操作—查看详情
            // window.location.href="/route?name=formal/statisticsMore"
            window.location.href="/formalLineSingUp/lineDetail?id=" + id + "&type=2";
        }
    });

    // 导出列表
    $(".export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_export"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                var requestURL = "?";
                var boolean = true;
                for(var obj in searchObj){
                    if(boolean){
                        requestURL += obj + "=" + searchObj[obj];
                        boolean = false;
                    }else {
                        if(obj!="pageNum" && obj!="pageSize") {
                            requestURL += "&" + obj + "=" + searchObj[obj];
                        }
                    }
                }
                window.location.href = "/formalLineSingUp/download"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });

    getEnterpriseAll();
    var enterprises = [];
    function dealEnterprise() {
        var value = "<option value=''>请选择</option>";
        for(var i = 0;i < enterprises.length;i++){
            var obj = enterprises[i];
            if(obj.pid == 1){
                value += "<option value="+ obj.id +">"+ obj.name +"</option>";
            }
        }
        $("[name=pId]").html(value);
        form.render();
    }
    function getEnterpriseById(id) {
        var arr = [];
        for(var i = 0;i < enterprises.length;i++){
            var obj = enterprises[i];
            if(obj.pid == id){
                arr.push(obj);
            }
        }
        return arr;
    }
    form.on('select(pId)', function (data) {
        $("[name=eId]").html('<option value="">请选择</option>');
        form.render();
        if(data.value != ""){
            var data = getEnterpriseById(Number(data.value));
            var value = "<option value=''>请选择</option>";
            for(var i = 0;i < data.length;i++){
                var obj = data[i];
                value += "<option value="+ obj.id +">"+ obj.name +"</option>";
            }
            $("[name=eId]").html(value);
            form.render();
        }
        return false;
    });
    function getEnterpriseAll(data){
        $.ajax({
            url: "/enterpriseEnterprise/getEnterpriseAll",
            type: "GET",
            data: "",
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    enterprises = res.data;
                    dealEnterprise();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
});