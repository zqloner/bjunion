/**
 * Created by zhuxq on 2019/9/6.
 */

layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form','hour', 'tree'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , tree = layui.tree
        , hour = layui.hour;//自定义时间选择

    form.verify({
        pass: [
            // /^[\u4e00-\u9fffa-zA-Z]{1,25}$/
           /^.{1,25}$/
            , '标题不能为控且不可超过25个字'
        ],
        desc:[
            // /^[\u4e00-\u9fffa-zA-Z]{1,500}$/
            /^.{0,500}$/
            , '说明不可超过500个字'
        ],
        months:function (value) {
            var checkLenth = $("[name='month']:checked");
            if(checkLenth.length<=0){
                return "请选择月份";
            }
        },
        areas:function (value) {
            var are = tree.getChecked('treeId');
            if(are.length<=0){
                return "请选择疗养地区";
            }
        },
        enterPrise:function (value) {
            var ent = checkCompany=tree.getChecked('treeCompanyId');
            if(ent.length<=0){
                return "请选择企业查看权限";
            }
        },
        comparetime:function () {
            var start = $("[name=start]").val();
            var end = $("[name=end]").val();
            if(start>=end){
                return "开始报名时间必须小于报名结束时间";
            }
        }
    });

    // 树形结构渲染
    // tree.render({
    //     elem: '#tree'
    //     , id: 'treeId'
    //     , data: treeData
    //     , showCheckbox:true
    //     , showLine: false  //是否开启连接线
    //     , click: function (obj) {
    //         console.log(obj.data);
    //     }
    //     ,oncheck: function(obj){
    //         console.log(obj.data); //得到当前点击的节点数据
    //     }
    // });

    var myData = {};
    // 疗养地区
    // 树形结构数据
    var treeData = [];
    // 企业查看权限
    // 树形结构数据
    var treeCompanyData = [];
    //查找地区和企业树数据
    function findTree() {
        $.get({
            url:"/preFindAll/findAllZondes",
            success:function (res) {
                var ta = [];
                for(var i=0;i<res.data.areaZnodesDtos.length;i++){
                    var item = {};
                    item.id = res.data.areaZnodesDtos[i].id;
                    item.title = res.data.areaZnodesDtos[i].name;
                    item.parentId = res.data.areaZnodesDtos[i].pId;
                    ta.push(item);
                }
                var ta1 = [];
                for(var i=0;i<res.data.enterPriseZnodeDtos.length;i++){
                    var item = {};
                    item.id = res.data.enterPriseZnodeDtos[i].id;
                    item.title = res.data.enterPriseZnodeDtos[i].name;
                    item.parentId = res.data.enterPriseZnodeDtos[i].pId;
                    ta1.push(item);
                }
                myData.areas =toTree(ta);
                myData.enterPrises  = toTree(ta1);
                treeRender(myData);

            },
            dataType:"json"
        });
    }
    //初始化数据
    findTree();

    //递归渲染树
    function toTree(data) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
            delete item.children;
        });

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        var map = {};
        data.forEach(function (item) {
            map[item.id] = item;
        });
//        console.log(map);
        var val = [];
        data.forEach(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            var parent = map[item.parentId];
            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                (parent.children || ( parent.children = [] )).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item);
            }
        });
        return val;
    }
    //初始化树的数据
    function treeRender(data){
        // 树形结构渲染
        tree.render({
            elem: '#treeCompany'
            , id: 'treeCompanyId'
            , data: data.enterPrises
            , showCheckbox:true
            , showLine: false  //是否开启连接线
            , click: function (obj) {
                console.log(obj.data);
            }
        });
        // 树形结构渲染
        tree.render({
            elem: '#tree'
            , id: 'treeId'
            , data: data.areas
            , showCheckbox:true
            , showLine: false  //是否开启连接线
            , click: function (obj) {
                console.log(obj.data);
            }
            ,oncheck: function(obj){
                console.log(obj.data); //得到当前点击的节点数据
            }
        });
        checkPreId();
    }
    /**
     * 修改的时候到达新增页面的ajax
     */
    function checkPreId() {
        var id = $("[name='preId']").val();
        if(id !=undefined ){
            $.ajax({
                url:"/preLine/toUpdatePreLine" ,
                type:"GET" ,
                data:{"preId":id},
                success:function (res) {
                    if(res.code == 200) {
                        var months = res.data.months;
                        var checkBoxAll = $("input[name='month']");
                        for (var i = 0; i < months.length; i++) {
                            $.each(checkBoxAll, function (j, checkbox) {
                                var checkValue = $(checkbox).val();
                                if (months[i] == checkValue) {
                                    $(checkbox).attr("checked", true);
                                }
                            })
                        }
                        // tree.getChecked('treeId') == res.data.areas;
                        var areas = res.data.areas;
                        tree.setChecked('treeId', areas);
                        // tree.getChecked('treeCompanyId') == res.data.enterPrises;
                        var enterPrises = res.data.enterPrises;
                        tree.setChecked('treeCompanyId', enterPrises);
                        $("[name='title']").val(res.data.preLine.title);
                        $("[name='describetion']").val(res.data.preLine.describetion);
                        $("[name='start']").val(res.data.preLine.beginTime);
                        $("[name='end']").val(res.data.preLine.endTime);
                        form.render();
                    }
                },
                dataType:"json"
            });
        }
    }
    $("[name='cenCelBtn']").click(function () {
        window.location.href="route?name=prediction/line";
    });
// //加载
//     checkPreId();
    var  userType = $("[name='userType']").val();
    var id = $("[name='preId']").val();
    // 监听提交
    form.on('submit(submitData)', function (data) {
        $("[name=sureButton]").attr("disabled","disabled");
        var months = [];
        $("[name=month]:checked").each(function () {
            months.push($(this).val());
        });
        //地域id数组
        var areas = [];
        var checkData=tree.getChecked('treeId');
        var checkDataString=JSON.stringify(checkData);
        if (checkData != undefined && checkData.length>0){
            for(var i in checkData[0].children){
                var j = checkData[0].children[i].id;
                areas.push(j);
                if (checkData[0].children[i].children != undefined){
                    for( var k in checkData[0].children[i].children){
                        var a = checkData[0].children[i].children[k].id;
                        areas.push(a);
                    }
                }
            }
        }
        var checkCompany=tree.getChecked('treeCompanyId');
        var checkCompanyString=JSON.stringify(checkCompany);
        //定义企业id数组
        var enterPrises = [];
        if(checkCompany != undefined && checkCompany.length>0){
            for(var i in checkCompany){
                enterPrises.push(checkCompany[i].id);
                if (checkCompany[i].children != undefined){
                    for( var k in checkCompany[i].children){
                        var a = checkCompany[i].children[k].id;
                        enterPrises.push(a);
                    }
                }
            }
        }
        // var  userType = $("[name='userType']").val();
        // var id = $("[name='preId']").val();
        if(id == undefined){
            $.ajax({
                url:"preLine/addPreLines" ,
                type:"POST" ,
                data: {"title":data.field.title,"describetion":data.field.describetion,"startTime":data.field.start,
                    "overTime":data.field.end,"months":months,"userType":userType ,
                    "areas":areas,"enterPrises":enterPrises
                },
                success:function (res) {
                    if(res.code==200){
                        layer.confirm("新增成功");
                        window.location.href="route?name=prediction/line&userType="+userType;
                    }else {
                        $("[name=sureButton]").removeAttr("disabled");
                        $("[name=sureButton]").attr("enabled","enabled");
                        layer.confirm("新增失败");
                    }
                },
                dataType:"json"
            });
            return false;
        }else {
            $.ajax({
                url:"preLine/doUpdatePreLine" ,
                type:"POST" ,
                data: {"id":id,"title":data.field.title,"describetion":data.field.describetion,"startTime":data.field.start,
                    "overTime":data.field.end,"months":months,"userType":userType ,
                    "areas":areas,"enterPrises":enterPrises},
                success:function (res) {
                    if(res.code==200){
                        layer.alert(res.message);
                    }else {
                        $("[name=sureButton]").removeAttr("disabled");
                        $("[name=sureButton]").attr("enabled","enabled");
                        layer.alert("修改失败");
                    }
                    window.location.href="route?name=prediction/line&userType="+userType;
                },
                dataType:"json"
            });
            return false;
        }
           return false;
    });
});

