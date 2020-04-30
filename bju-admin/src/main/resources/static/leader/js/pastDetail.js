/**
 * Created by zhuxq on 2019/9/16.
 */
layui.config({
    base: "/leader/js/"
}).use(['jquery', 'table', 'layer', 'form', 'transfer', 'layedit', 'hour', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , transfer = layui.transfer
        , layedit = layui.layedit
        , hour = layui.hour
        , pagination = layui.pagination //自定义分页
        , projectile = layui.projectile //自定义弹窗
        , pageFlag = true
        , pageSize = 10;
    // 表单查询
    form.on('submit(submitData)', function (data) {
        getCadreList(0,pageSize);
        // 前端测试代码，正式删掉。
        // layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function () {
        //     layer.closeAll(); //关闭所有层
        // });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    // 列表渲染
    function tablePlay(data) {
        table.render({
            //id:"enquiry",
            elem: "#table",
            data: data,
            limit: pageSize,
            // 设置表头参数
            cols: [
                [
                    {field: 'username', title: '疗养人姓名', width: '10%'}
                    , {field: 'dwname', title: '所属单位', width: '10%'}
                    , {field: 'card_id', title: '京卡号', width: '10%'}
                    , {field: 'idcard', title: '身份证号', width: '10%'}
                    , {field: 'phone', title: '联系电话', width: '10%'}
                    , {field: 'gotravel', title: '出行工具', width: '9%'}
                    , {field: 'goticket', title: '车票信息', width: '9%'}
                    , {field: 'go_price', title: '票价', width: '7%'}
                    , {field: 'backtravel', title: '返程工具', width: '9%'}
                    , {field: 'backeticket', title: '车票信息', width: '9%'}
                    , {field: 'back_price', title: '票价', width: '7%'}
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
                // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
                pageSize = obj.limit;
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
        var formalid = $("#formalid").val();

        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        params.formalid = formalid;

        var eid = $("#companylist").val();
        if(eid!=""){
            params.eid = eid;
        }
        var uname = $("#uname").val();
        if(uname!=""){
            params.uname = uname;
        }
        var cardid = $("#cardid").val();
        if(cardid!=""){
            params.cardid = cardid;
        }
        var phone = $("#phone").val();
        if(phone!=""){
            params.phone = phone;
        }
        var IDCard = $("#IDCard").val();
        if(IDCard!=""){
            params.IDCard = IDCard;
        }
        $.ajax({
            url: "/formalLine/getFormalLineUserList",
            type: "GET",
            data: params,
            dataType:"json",
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

    /* 以下 wj 新增 */
    getTuanDetail();//线路基本信息
    function getTuanDetail() {
        var formalid = $("#formalid").val();
        var params={};
        params.formalid = formalid;
        $.ajax({
            type: "get",
            url: "/formalLine/getFormalSanatoriumInfo",
            dataType: "json",
            data: params,
            success:function(response){
                var tuanname = response.data[0].tuanname; //线路名称
                $("#tuanname").html(tuanname);

                var hname = response.data[0].hname; //疗养院名称
                $("#hname").html(hname);

                var bengintime = response.data[0].bengintime; //开始日期
                var endtime = response.data[0].endtime; //结束日期

                $("#lydate").html(bengintime+"～"+endtime);

                var percount = response.data[0].percount; //人数

                if(percount!=undefined){
                    $("#percount").html(percount+"人");
                }else {
                    $("#percount").html("0 人");
                }
            }
        });
    }
    getFormalLineCompanyList();//单位列表
    function getFormalLineCompanyList() {
        var formalid = $("#formalid").val();
        $("#companylist").text("");
        var params={};
        params.formalid = formalid;
        $.ajax({
            type: "get",
            url: "/formalLine/getFormalLineCompanyList",
            dataType: "json",
            data: params,
            success:function(response){
                var dlist = response.data;
                var quarter_html = "<option value=\"0\">请选择</option>";
                for (var i=0;i<dlist.length;i++){
                    var id = dlist[i].eid;
                    var dwname = dlist[i].dwname;
                    quarter_html += '<option value="' + id + '">' + dwname + '</option>';
                }
                $("#companylist").append(quarter_html);
                form.render();
            }
        });
    }
});