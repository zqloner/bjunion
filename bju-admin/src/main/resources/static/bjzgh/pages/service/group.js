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
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true
        , url = "";

    var objSearch = new Object();
    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            limit:data.length,
            // 设置表头参数
            cols: [
                [
                    {field: 'name', title: '姓名', width: '10%'}
                    , {field: 'cardId', title: '京卡号', width: '10%'}
                    , {field: 'enterpriseName', title: '所属单位', width: '10%'}
                    , {
                    field: 'userType', title: '疗养群体', width: '10%', templet: function (d) {
                        if (d.userType == '3') {
                            return '劳模职工'
                        } else if (d.userType == '2') {
                            return '优秀职工'
                        } else if (d.userType == '1') {
                            return '普通职工'
                        }
                    }
                }
                    , {field: 'lineName', title: '疗养线路', width: '10%'}
                    , {title: '疗养日期', width: '10%',templet:function (d) {
                        return d.sbeginStart+"-"+d.sbeginEnd;
                    }}
                    , {field: 'lyfy', title: '疗养费用', width: '10%'}
                    , {field: 'jtfy', title: '交通费用', width: '10%'}
                    , {field: 'ldfy', title: '领队上报费用', width: '10%'}
                    , {field: 'allfy', title: '疗养总费用', width: '10%'}
                ]
            ]
        });
    }

    // 分页渲染
    function laypageCurr(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: res.pageSize}, function (obj, first) {
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
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.lineName = objSearch.lineName;
        params.name = objSearch.name;
        params.cardId = objSearch.cardId;
        params.phone =  objSearch.phone;
        params.IDCard = objSearch.IDCard;
        params.pId =  objSearch.pId;
        params.eId = objSearch.eId;
        params.sBeginStart =  objSearch.sBeginStart;
        params.sBeginEnd = objSearch.sBeginEnd;
        $.ajax({
            url: "/statistics/getCostInfoList",
            type: "GET",
            data: params,
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


    // 加载数据
    function getAunit() {
        $.ajax({
            url: "/enterpriseEnterprise/findFirstEnterPrise",
            type: "GET",
            data: "",
            success: function (res) {
                if (res.code == "200") {
                    var myList = res.data;
                    var myHtml = '<option value="" >请选择</option>';
                    if (myList != undefined && myList.length > 0) {
                        for (var i = 0; i < myList.length; i++) {
                            myHtml += ' <option value="' + myList[i].id + '">' + myList[i].name + '</option>'
                        }
                    }
                    $("[name=company1]").html(myHtml);
                    form.render();
                }
            }
        });
    }
    // 初始化加载
    getAunit();

    // 加载数据
    function getBunit() {
        var param = {};
        param.id = objSearch.id;
        $.ajax({
            url: "/enterpriseEnterprise/findTwoLevelEnterPrise",
            type: "GET",
            data: param,
            success: function (res) {
                if (res.code == "200") {
                    var myList = res.data;
                    var myHtml = '<option value="" >请选择</option>';
                    if (myList != undefined && myList.length > 0) {
                        for (var i = 0; i < myList.length; i++) {
                            myHtml += ' <option value="' + myList[i].id + '">' + myList[i].name + '</option>'
                        }
                    }
                    $("[name=company2]").html(myHtml);
                    form.render();
                }
            }
        });
    };
    // 初始化加载
    getBunit();

    //加载二级单位
    form.on('select(demo)', function(data){
        objSearch.id= data.value;
        getBunit();
        // if(data.value == 1){
        //     $("#searchSessionNum").attr("disabled","true");
        //     form.render('select');
        // }else{
        //     $("#searchSessionNum").removeAttr("disabled");
        //     form.render('select');//select是固定写法 不是选择器
        // }
    });
    // 表单查询
    form.on('submit(submitData)', function (data) {
        objSearch.lineName = data.field.line;
        objSearch.name = data.field.name;
        objSearch.cardId =data.field.cardId;
        objSearch.phone = data.field.tel;
        objSearch.IDCard = data.field.idCard;
        objSearch.eId = data.field.company1;
        objSearch.pId = data.field.company2;
        objSearch.sBeginStart = data.field.start;
        objSearch.sBeginEnd = data.field.end;
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 导出列表
    $("#export").click(function () {
        projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
            $(".sureBtn").click(function () {
                var requestURL = "?";
                var boolean = true;
                for(var obj in objSearch){
                    if(boolean){
                        requestURL += obj + "=" + objSearch[obj];
                        boolean = false;
                    }else {
                        if(obj!="pageNum" && obj!="pageSize") {
                            requestURL += "&" + obj + "=" + objSearch[obj];
                        }
                    }
                }
                window.location.href = "/statistics/exportCostInfoList"+requestURL;
                layer.closeAll();
            });
            $(".cancelBtn").click(function () {
                layer.closeAll();
            });
        });
    });
});