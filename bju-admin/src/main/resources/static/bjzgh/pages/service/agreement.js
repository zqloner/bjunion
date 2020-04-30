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
        , url = "/contractContract/getConstactsInfos";

    var searchObj ={};
    searchObj.type = $("#type").val();  //默认为疗养合同管理
    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        //表单初始赋值
        $("[name='name']").val("");
        $("[name='vestHome']").val("");
        $("[name='state']").val("0");
        $("[name='start']").val("");
        $("[name='end']").val("");
        form.render();
        searchObj.type = $(".layui-this").val();
        searchObj.startTime = "";
        searchObj.overTime = "";
        searchObj.contractStatus = "";
        searchObj.contractName = "";
        searchObj.partyaName = "";
        getCadreList();
        // table.resize('fine');
    });
    // 疗养院合同管理
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'contractName', title: '合同名称', width: '10%'}
                    , {field: 'partyaName', title: '客户名称', width: '10%'}
                    , {field: 'person', title: '业务负责人', width: '10%'}
                    , {field: 'phone', title: '联系方式', width: '10%'}
                    , {field: 'contractBeginTime', title: '开始时间', width: '10%'}
                    , {field: 'contractEndTime', title: '结束时间', width: '10%'}
                    , {field: 'name', title: '创建人', width: '10%'}
                    , {field: 'createTime', title: '创建时间', width: '10%'}
                    , {
                    field: 'contractStatus', title: '合同状态', width: '10%', templet: function (d) {
                        if (d.contractStatus == '0') {
                            return '<span class="layui-badge-dot layui-bg-blue"></span> 未开始';
                        }else if (d.contractStatus == '1') {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 服务中';
                        }else if (d.contractStatus == '2') {
                            return '<span class="layui-badge-dot"></span> 已结束';
                        }
                    }
                }
                    , {
                    title: '操作', width: '10%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
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

    // 表单查询
    form.on('submit(submitData)', function (data) {
        searchObj.contractName = data.field.name;
        searchObj.partyaName = data.field.vestHome;
        searchObj.startTime = data.field.start;
        searchObj.overTime = data.field.end;
        searchObj.contractStatus = data.field.state;
        getCadreList();
        // // 前端测试代码，正式删掉。
        // layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function () {
        //     layer.closeAll(); //关闭所有层
        // });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    // 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        params.type = searchObj.type;
        params.contractName = searchObj.contractName;
        params.partyaName = searchObj.partyaName;
        params.startTime = searchObj.startTime;
        params.overTime = searchObj.overTime;
        params.contractStatus = searchObj.contractStatus;
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
                    layer.msg(res.msg);
                }
            }
        });
        return false;
    }
    function getMyData() {
        console.log(searchObj.type);

        if(searchObj.type == 0){

            $("[name='fuwuqiye']").attr("class","");
            $("[name='liaoyangyuan']").attr("class","layui-this");
            getCadreList();
        }else {
            $("[name='liaoyangyuan']").attr("class","");
            $("[name='fuwuqiye']").attr("class","layui-this");
            getCadreList();
        }
    }
    getMyData();


    // 监听表格工具条点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
            window.location.href="route?name=service/agreementAdd&contractId="+obj.data.id+"&type="+searchObj.type;
        }else if(obj.event === 'detail'){ // 操作—详情
            window.location.href="route?name=service/agreementDetail&contractId="+obj.data.id+"&type="+searchObj.type;
        }
    });

    // 导出列表
    $(".export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_export"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                // debugger;
                // url = "/contractContract/download";
                // $.ajax({
                //     url: url,
                //     type: "POST",
                //     data: searchObj,
                // });
                // window.location.href = 'route?name=service/agreement&type='+searchObj.type;
               // layer.closeAll();
               // return false;

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
                window.location.href = "/contractContract/download"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });

    // 单个添加
    $(".addOne").click(function () {
        console.log(searchObj.type);
        window.location.href="route?name=service/agreementAdd&type="+searchObj.type;
    });

    // 批量添加
    $(".addMore").click(function () {
        window.location.href="route?name=service/agreementAddMore"
    });
});