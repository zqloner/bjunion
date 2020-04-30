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
        , url = "/sysRole/list";
    // 列表渲染
    var searchObj = {};

    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '角色名称', width: '20%'}
                    , {field: 'describe', title: '角色描述', width: '30%'}
                    , {field: 'permission', title: '操作权限', width: '30%'}
                    , {
                    title: '操作', width: '20%', templet: function (d) {
                        return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="edit">编辑</a>'
                            + '<span class="table-cut" lay-separator="">|</span>'
                            + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="delete">删除</a>';
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
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        console.log(pageNumber);
        console.log(pageSize);
        $.ajax({
            url: url,
            type: "GET",
            data: params,
            //dataType:"json",
            success: function (res) {
                // {field: 'name', title: '角色名称', width: '20%'}
                if (res.code == "200") {
                    var oldList = res.data.list;
                    var myList = [];
                    if (oldList != undefined && oldList.length > 0) {
                        for (var i = 0; i < oldList.length; i++) {
                            var param = {};
                            param.name = oldList[i].name;
                            param.describe = oldList[i].discript;
                            param.id = oldList[i].id;
                            param.permission = oldList[i].permissions;
                            myList.push(param)
                        }
                    }
                    tablePlay(myList); //列表渲染
                    laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }

    // 初始化加载
    getCadreList();

    //权限数据加载
    // 加载数据
    function getmMenuList() {
        $.ajax({
            url: "/sysMenu/menuList",
            type: "GET",
            success: function (res) {
                if (res.code == 200) {
                    var oldList = res.data;
                    searchObj.menuList = res.data;
                    var myList = [];
                    if (oldList != undefined && oldList.length > 0) {
                        /*                     <div class="layui-input-block checkbox-margin">
                                                   <input type="checkbox" name="myPerMissions" value="14" title="网站信息管理"
                                                lay-skin="primary">
                                                    </div>
                                                    <div class="layui-input-block layui-input-block-long checkbox-margin  checkbox-second">
                                                    <input type="checkbox" name="myPerMissions" value="15" title="新闻管理" lay-skin="primary">
                                                    <input type="checkbox" name="myPerMissions" value="16" title="疗休养简介" lay-skin="primary">
                                                    <input type="checkbox" name="myPerMissions" value="17" title="疗休养管理" lay-skin="primary">
                                                    <input type="checkbox" name="myPerMissions" value="18" title="疗养路线管理" lay-skin="primary">
                                                    </div>
                                                    */
                        var myHtml = '<label class="layui-form-label" >角色权限：</label>';
                        for (var i = 0; i < oldList.length; i++) {
                            var par = '<div class="layui-input-block checkbox-margin"><input type="checkbox" class="par" name="myPerMissions" value="' + oldList[i].id +
                                '" title="' + oldList[i].name + '" lay-filter="myPar" lay-skin="primary"></div>';
                            var chil = ' <div class="layui-input-block layui-input-block-long checkbox-margin  checkbox-second"> ';
                            var dren = '</div>';
                            for (var j = 0; j < oldList[i].children.length; j++) {
                                chil += ' <input type="checkbox" class="myChild child" name="myPerMissions" value="' + oldList[i].children[j].id + '" title="' + oldList[i].children[j].name + '" ' +
                                    'lay-filter="myChild" lay-skin="primary">';
                            }
                            myHtml += par + chil + dren;
                        }
                        $("#myMenus").html(myHtml);
                        form.render();
                    }
                } else {
                    layer.msg("操作失败");
                }
            }
        });
    }

    // 初始化加载
    getmMenuList();

    // 监听多选框事件（点击一个得到其附属权限）
    form.on('checkbox(myPar)', function (data) {
        if($(this).prop("checked")){
            $(this).parent("div").next().find(".child").prop("checked",true);
            form.render();
        }else {
            $(this).parent("div").next().find(".child").prop("checked",false);
            form.render();
        }
    });
    form.on('checkbox(myChild)', function (data) {
        if($(this).parent("div").find(".child:checked").length>=1){
            $(this).parent("div").prev("div").find(".par").prop("checked",true);
            form.render();
        }else {
            $(this).parent("div").prev("div").find(".par").prop("checked",false);
            form.render();
        }
    });

    // 监听多选框事件（点击一个得到其附属权限）
    form.on('checkbox(formEvent)', function (data) {
        console.log(data.elem.checked); //是否被选中，true或者false
        console.log(data.value); //复选框value值，也可以通过data.elem.value得到
    });

    // 监听表格操作按钮点击
    function toUpdate() {
        $.ajax({
            url: "/sysRole/toUpdateRole",
            type: "GET",
            data: {"id": searchObj.id},
            success: function (res) {
                if (res.code == 200) {
                    $("[name=name]").val(res.data.name);
                    $("[name=depict]").val(res.data.discript);
                    var menes = res.data.menus;
                    var per = [];
                    if (menes != undefined && menes.length > 0) {
                        for (var i = 0; i < menes.length; i++) {
                            per.push(menes[i].id);
                        }
                    }
                    // var checkBoxAll = $("input[name='myPerMissions']");
                    for (var i = 0; i < per.length; i++) {
                        // $("[name='myPerMissions'][value='+per[i]+']").attr("checked",true)
                        $("[name='myPerMissions'][value=" + per[i] + "]").attr("checked", true)
                    }
                    form.render();
                }
            },
            dataType: "json"
        });
    }

    // toUpdate();
    table.on('tool(test)', function (obj) {
        searchObj.id = obj.data.id;
        if (obj.event === 'edit') { // 操作—编辑
            toUpdate();
            projectile.elastic({title: " ", content: $("#popup"), area: ['800px', '486px']}, function () {
                // 监听提交
                form.on('submit(submitData)', function (data) {
                    var params = new Object();
                    var ids = [];
                    $("[name=myPerMissions]:checked").each(function () {
                        ids.push($(this).val());
                    });
                    params.ids = ids;
                    params.name = data.field.name;
                    params.discript = data.field.depict;
                    params.type = data.field.kind;
                    params.id = obj.data.id;
                    $.ajax({
                        url: "sysRole/update",
                        type: "POST",
                        data: params,
                        success: function (res) {
                            if (res.code == 200) {
                                window.location.href = "route?name=system/partSet";
                            } else {
                                layer.alert("修改失败");
                            }
                        },
                        dataType: "json"
                    });
                    return false;
                });
                return false;
            });
            return false;
        } else if (obj.event === 'delete') { // 操作—删除
            layer.confirm('确定要删除该角色吗？', function (index) {
                $.ajax({
                    url: "/sysRole/deleteRole",
                    type: "GET",
                    data: {"id": obj.data.id},
                    success: function (res) {
                        if (res.code == 200) {
                            layer.msg(res.message);
                            window.location.href = "route?name=system/partSet";
                        } else {
                            layer.msg(res.message);
                        }
                    },
                    dataType: "json"
                });
                return false;
            });
        }
        return false;
    });

    // 添加角色弹窗
    $("#add").click(function () {
        projectile.elastic({title: " ", content: $("#popup"), area: ['800px', '486px']}, function () {
            // 监听提交
            form.on('submit(submitData)', function (data) {
                var params = new Object();
                var ids = [];
                $("[name=myPerMissions]:checked").each(function () {
                    ids.push($(this).val());
                });
                params.ids = ids;
                params.name = data.field.name;
                params.discript = data.field.depict;
                params.type = 1;
                $.ajax({
                    url: "sysRole/add",
                    type: "POST",
                    data: params,
                    success: function (res) {
                        if (res.code == 200) {
                            window.location.href = "route?name=system/partSet";
                        } else {
                            layer.alert("新增失败");
                        }
                    },
                    dataType: "json"
                });
                return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        });
    });

    //表单校验
    form.verify({
        illegalChar: function (value) {
            var reg = /^[\@\#\$\%\^\&\*\(\)\{\}\:\"\<\>\?\[\]]$/;
            var split = value.split("");
            console.log(split);
            for (var i = 0; i < split.length; i++) {
                if (reg.test(split[i])) {
                    return "非法字符";
                }
            }
        },
        socialCreditCode: function (value) {
            if (!CheckSocialCreditCode(value)) {
                return "请输入正确的社会统一信用代码";
            }
        },
        account: function (value) {
            var reg = /^\w{6,20}$/;
            if (!reg.test(value)) {
                return "用户名格式为6-20个字符,包括字母、数字、下划线";
            }
        },
        contacts: function (value) {
            value = value.trim();
            if (!(value.length >= 2 && value.length <= 20)) {
                return "请输入正确的姓名";
            }
        },
        QAUrl: function (value) {
            if (imageUrl.trim().length == 0) {
                return "请上传资质证明图片";
            }
        },
        myPerm: function (value) {
            var checkLenth = $("[name='myPerMissions']:checked");
            if (checkLenth.length <= 0) {
                return "请选择权限";
            }
        },
    });
});