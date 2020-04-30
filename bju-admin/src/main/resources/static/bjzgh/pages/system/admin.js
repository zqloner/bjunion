/**
 * Created by zhuxq on 2019/9/4.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , pageFlag = true
        , url = "";

    form.verify({
        checkPwd:function (value) {
            var reg = /^[\w]{6,12}$/;
            if(!reg.test(value)){
                return "密码长度为6至12位，由数字和字母组成";
            }
        },
        checkAcount:function (value) {
            var reg = /^[\w]{5,}$/;
            if(!reg.test(value)){
                return "账号只能是大于等于5位字母、数字或字母和数字的组合";
            }
        }
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
                    {field: 'admin', title: '账号', width: '15%'}
                    , {field: 'name', title: '角色名称', width: '15%'}
                    , {field: 'realName', title: '姓名', width: '10%'}
                    , {field: 'tel', title: '手机号码', width: '15%'}
                    , {field: 'addTime', title: '添加时间', width: '20%'}
                    , {
                    title: '操作', width: '25%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="resetPwd">重置密码</a>';
                    }
                }
                ]
            ]
        });
    }
    function findAllRoles() {
        $.ajax({
            url:"/sysAdmin/findAllroles" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    // $("[name=admin]").val("哈哈哈");
                    var myHtml = '<option value="">请选择</option>';
                   for(var i in res.data){
                       // month +=  '<input type="checkbox" name="month" value="'+res.data.preMonthAndNames[i].id+'" lay-skin="primary" title="'+res.data.preMonthAndNames[i].name+'">'
                       myHtml += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>'
                   }
                   $("#myPermission").html(myHtml);
                   form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    //加载所有角色
    findAllRoles();

    function changeBlank(){
        $("[name=admin]").val("");
        $("[name=pwd]").val("");
        // $("[name=myPermission]").val(res.data.roleId);
        // $("[name='myPermission'][value="+res.data.roleId+"]").attr("selected");
        $("[name='permission']").val("");
        $("[name=remark]").val("");
        form.render();
    }

    function findAdmin(obj) {
        $.ajax({
            url:"/sysAdmin/toUpdate" ,
            type:"GET" ,
            data:{"id":obj},
            success:function (res) {
                if(res.code==200){
                     $("[name=admin]").val(res.data.admin);
                    $("[name=pwd]").val(res.data.password);
                    // $("[name=myPermission]").val(res.data.roleId);
                    // $("[name='myPermission'][value="+res.data.roleId+"]").attr("selected");
                    $("[name='permission']").val(res.data.roleId);
                    $("[name=remark]").val(res.data.note);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
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
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url:"/sysAdmin/list" ,
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    tablePlay(res.data.list); //列表渲染
                    laypageCurr(res.data); //分页渲染
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    // 初始化加载
    getCadreList();

    var adminId = {};
    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'edit') { // 操作—编辑
            adminId=obj.data.id;
            findAdmin(obj.data.id);
            projectile.elastic({title: " ", content: $("#popup"), area: ['800px', '486px']}, function () {
                // 监听提交
                form.on('submit(submitData)', function (data) {
                    var paramsObj = {};
                    paramsObj.username = $("[name='admin']").val();
                    paramsObj.password = $("[name='pwd']").val();
                    paramsObj.roleId = $("[name='permission']").val();
                    paramsObj.note = $("[name='remark']").val();
                    paramsObj.id = adminId;
                    console.log(paramsObj);
                    $.ajax({
                        url:"/sysAdmin/update" ,
                        type:"POST" ,
                        data:paramsObj,
                        success:function (res) {
                            if(res.code==200){
                                layer.alert(res.message)
                                window.location.href="route?name=system/admin"
                            }else {
                                layer.alert(res.message);
                            }
                        } ,
                        dataType:"json"
                    });
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                    return false;
                });
            });
        } else if (obj.event === 'delete') { // 操作—删除
            adminId=obj.data.id;
            layer.confirm('确定要删除该角色吗？', function (index) {
                var paramsObj = {};
                paramsObj.id = adminId;
                console.log(paramsObj);
                $.ajax({
                    url:"/sysAdmin/delete" ,
                    type:"GET" ,
                    data:paramsObj,
                    success:function (res) {
                        if(res.code==200){
                            layer.alert(res.message)
                            window.location.href="route?name=system/admin"
                        }else {
                            layer.alert("删除失败");
                        }
                    } ,
                    dataType:"json"
                });
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (obj.event === 'resetPwd') { // 操作—重置密码
            adminId=obj.data.id;
            projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                $(".sureBtn").click(function () {
                    var paramsObj = {};
                    paramsObj.id = adminId;
                    console.log(paramsObj);
                    $.ajax({
                        url:"/sysAdmin/changePassword" ,
                        type:"POST" ,
                        data:paramsObj,
                        success:function (res) {
                            if(res.code==200){
                                layer.alert(res.message)
                                window.location.href="route?name=system/admin"
                            }else {
                                layer.alert("重置密码失败");
                            }
                        } ,
                        dataType:"json"
                    });
                    return false;
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                    return false;
                });
            });
        }
    });
    // 添加管理员弹窗
    $("#add").click(function () {
        changeBlank();
        projectile.elastic({title: " ", content: $("#popup"), area: ['800px', '486px']}, function () {
            // 监听提交
            form.on('submit(submitData)', function (data) {

                var paramsObj = {};
                paramsObj.username = $("[name='admin']").val();
                paramsObj.password = $("[name='pwd']").val();
                paramsObj.roleId = $("[name='permission']").val();
                paramsObj.note = $("[name='remark']").val();
                console.log(paramsObj);
                $.ajax({
                    url:"/sysAdmin/add" ,
                    type:"POST" ,
                    data:paramsObj,
                    success:function (res) {
                        if(res.code==200){
                            layer.alert(res.message)
                            window.location.href="route?name=system/admin"
                        }else {
                            layer.alert(res.message);
                        }
                    } ,
                    dataType:"json"
                });

                // // 前端测试代码，正式删掉。
                // layer.alert(JSON.stringify(data.field), {
                //     title: '最终的提交信息'
                // }, function () {
                //     layer.closeAll(); //关闭所有层
                // });
                return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
                return false;
            });
        });
    });
});
// function myCancel(){
//     layer.closeAll();
// }