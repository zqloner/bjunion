/**
 * Created by zhuxq on 2019/9/10.
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
        , pageSize = 10
       ;
        //, url = "/leader/json/ticket.json";
    // 表单查询
    form.on('submit(submitData)', function (data) {
        getCadreList(1,pageSize);
        // 前端测试代码，正式删掉。
        // layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function () {
        //     layer.closeAll(); //关闭所有层
        // });
         return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    var chutuannum = 0;
    var buchutuannum = 0;
    var zongnum = 0;
    // 列表渲染
    function tablePlay(data) {
        chutuannum = 0;
        buchutuannum = 0;
        table.render({
            //id:"enquiry",
            elem: "#table",
            data: data,
            limit: pageSize,
            // 设置表头参数
            cols: [
                [
                    {field: 'username', title: '疗养人姓名', width: '10%'}
                    , {field: 'dwname', title: '所属单位', width: '15%'}
                    , {field: 'card_id', title: '京卡号', width: '20%'}
                    , {field: 'idcard', title: '身份证号', width: '20%'}
                    , {field: 'phone', title: '联系电话', width: '15%'}
                    , {
                        title: '是否出团', width: '20%', templet: function (d) {
                            if (d.yes_no == '0') {
                                buchutuannum ++;
                                return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="pass">出团</a>'
                                    + '<span class="table-cut" lay-separator="">|</span>'
                                    + '不出团';
                            }else if (d.yes_no == '1'){
                                chutuannum ++;
                                return '出团'
                                    + '<span class="table-cut" lay-separator="">|</span>'
                                    + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="notPass">不出团</a>';
                            }else {
                                return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="pass">出团</a>'
                                    + '<span class="table-cut" lay-separator="">|</span>'
                                    + '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="notPass">不出团</a>';
                            }
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
        var ifout = $("#ifout").val();
        if(ifout!=""){
            params.ifout = ifout;
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
                    zongnum = res.data.total;
                } else {
                    layer.msg(response.message);
                }
            }
        });
    }

    // 初始化加载
    getCadreList();

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        if (obj.event === 'pass') { // 操作—出团
            projectile.elastic({title: "操作提示", content: $("#popup_small"), area: ['520px', '288px']}, function () {
                $(".sureBtn").click(function () {

                    var infoid = obj.data.id;
                    var ifout = "1";
                    changeUserOut(infoid,ifout);
                    layer.closeAll();
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
            });
        } else if (obj.event === 'notPass') { // 操作—不出团
            projectile.elastic({title: "操作提示", content: $("#popup_input"), area: ['520px', '288px']}, function () {
                $(".sureBtn").click(function () {
                    var infoid = obj.data.id;
                    var ifout = "0";
                    changeUserOut(infoid,ifout);
                    layer.closeAll();
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });
                /*form.on('submit(submitData)', function (data) {
                    // 前端测试代码，正式删掉。
                    layer.alert(JSON.stringify(data.field), {
                        title: '最终的提交信息'
                    }, function () {
                        layer.closeAll(); //关闭所有层
                    });
                    return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                $(".cancelBtn").click(function () {
                    layer.closeAll();
                });*/
            });
        }
    });

    /* 以下 wj 新增 */


    //点击确定
    $("#tijiao").click(function () {
        var formalid = $("#formalid").val();
        var pagedata = $("#pagedata").val();
        var params={};
        params.formalid = formalid;
        $.ajax({
            type: "post",
            url: "/formalLine/changeFormalStatus",
            dataType: "json",
            data: params,
            success:function(response){
                if (response.code == "200") {
                    window.location.href="/formalLine/tovestHome?pagedata="+pagedata;
                } else {
                    layer.msg(response.message);
                }
            }
        });
    });
    function changeUserOut(infoid,ifout) {
        var params={};
        params.id = infoid;
        params.ifout = ifout;
        $.ajax({
            type: "post",
            url: "/formalLine/changeUserOut",
            dataType: "json",
            data: params,
            success:function(response){
                if (response.code == "200") {
                    getCadreList();
                    layer.closeAll();
                } else {
                    layer.msg(response.message);
                }
            }
        });
    }
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