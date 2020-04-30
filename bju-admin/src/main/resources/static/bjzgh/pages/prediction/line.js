/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , pageFlag = true
        , url = "/preLine/findByConditions";

    var searchObj = {};
    searchObj.userType = 3;
    // 监听tab切换 重载表格尺寸 以防表格宽度被压缩
    element.on('tab(tabChange)',function(data){
        // var value = $(".layui-this").val();
        // userTypeId = value;
        pageFlag = true;
       $("#preLineName").val("");
        searchObj.userType =$(".layui-this").val();
        getCadreList();
    });

    function myTableChange(){
        pageFlag = true;
        var myUserType = $("[name='userType']").val();
        if($("[name='userType']").val() == 2){
            $("#myLaoMo").attr("class","");
            $("#myPuTong").attr("class","");
            $("#myYouXiu").attr("class","layui-this");
        }else if($("[name='userType']").val() == 1){
            $("#myLaoMo").attr("class","");
            $("#myYouXiu").attr("class","");
            $("#myPuTong").attr("class","layui-this");
        }else {
            $("#myYouXiu").attr("class","");
            $("#myPuTong").attr("class","");
            $("#myLaoMo").attr("class","layui-this");
        }
        form.render();
        searchObj.userType = $("[name='userType']").val();
        getCadreList();
    }
    myTableChange();
    // 表单查询
    form.on('submit(submitData)', function (data) {
        pageFlag = true;
        // var title = data.field.name;
        // var params ={};
        // params.title  =  title;
        // params.userType = userTypeId;
        // $.ajax({
        //     url: "/preLine/findByConditions",
        //     type: "GET",
        //     data: params,
        //     dataType:"json",
        //     success: function (res) {
        //         console.log(res);
        //         if (res.code == "200") {
        //             tablePlay(res.data.list); //列表渲染
        //             laypageCurr(res.data); //分页渲染
        //         } else {
        //             layer.msg(res.message);
        //         }
        //     }
        pageFlag = true;
        searchObj.title = data.field.name;
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可
    });
        // 劳模职工
        // 列表渲染
        function tablePlay(data) {
            table.render({
                id:"enquiry",
                elem: "#table",
                data: data,
                // 设置表头参数
                cols: [
                    [
                        {field: 'title', title: '线路', width: '20%'}
                        , {field: 'nowCount', title: '已报人数', width: '10%'}
                        , {title: '报名开放时段', width: '35%',templet:function (e) {
                            return e.beginTime+ "-"+ e.endTime;
                        }}
                        , {field: 'createTime', title: '添加日期', width: '15%'}
                        , {
                        title: '操作', width: '20%', templet: function (d) {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</ a>'
                                + '<span class="table-cut" lay-separator="">|</span>'
                                + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</ a>';
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
        // // 初始化加载
        // getCadreList();

        // 加载数据
        function getCadreList(pageNum, pageSize) {
            // 数据加载中loading
            // parent.tools.load();
            var params =searchObj;
            params.pageNum = pageNum;
            params.pageSize = pageSize;
            // params.userType = searchObj.userType;
            // params.title  =  searchObj.title;
            $.ajax({
                url: "/preLine/findByConditions",
                type: "GET",
                data: params,
                dataType:"json",
                success: function (res) {
                    console.log(res);
                    if (res.code == "200") {
                        tablePlay(res.data.list); //列表渲染
                        laypageCurr(res.data); //分页渲染
                    } else {
                        layer.msg(res.message);
                    }
                }
            });
        }
    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
           window.location.href="/route?name=prediction/lineAdd&preId="+obj.data.id+"&userType="+$(".layui-this").val()+"&param=1";
        }else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该线路吗？', function (index) {
                // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
                $.ajax({
                    url: "/preLine/deleteById",
                    type: "GET",
                    data: {"preId":obj.data.id},
                    dataType:"json",
                    success: function (res) {
                        console.log(res);
                        if (res.code == "200") {
                            layer.alert(res.message);
                            // window.location.href="/route?name=prediction/line&userType="+$(".layui-this").val();
                            getCadreList();
                            table.resize('fine');
                            table.resize('general');
                        } else {
                            // 已有企业填报,不可删除
                            projectile.elastic({title: " ", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                                $(".sureBtn").click(function () {
                                    layer.closeAll();
                                });
                                $(".cancelBtn").click(function () {
                                    layer.closeAll();
                                });
                            });
                        }
                    }
                });
                return false;
            });
        }
        return false;
    }
    );

    // 添加
    $(".add").click(function () {
        console.log($(".layui-this").val());
        window.location.href="/route?name=prediction/lineAdd&userType="+$(".layui-this").val();
    });
});