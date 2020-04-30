/**
 * Created by zhuxq on 2019/9/16.
 */
layui.config({
    base: "/leader/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择器
        , pageFlag = true;
       // , url = "../../json/cost.json";

    // 列表渲染
    function tablePlayDe(data) {
        table.render({
            id: "de",
            elem: "#deTable",
            data: data,
            limit: data.length,
            // 设置表头参数
            cols: [
                [
                    {field: 'costType', title: '费用类型', width: '20%', templet: function (d) {
                        if (d.costType == '2') {
                            return '个体消费';
                        }else if (d.costType == '1') {
                            return '团体消费';
                        }
                    }}
                    , {field: 'costInfo', title: '费用明细', width: '20%'}
                    , {field: 'username', title: '消费人', width: '20%', templet: function (d) {
                    if (d.username == ''||d.username==null||d.username==undefined) {
                        return '所有人';
                    }else{
                        return d.username;
                    }
                }}
                    , {field: 'price', title: '消费总额(元)', width: '20%'}
                    , {field: 'remarks', title: '备注', width: '20%'}
                ]
            ]
        });
    }
    // 加载列表数据
    function getCadreListDe() {
        //获取所有人员列表
        var costid = $("#costid").val();
        var params = new Object();
        params.costid = costid;
        $.ajax({
            url: "/formalCost/getCostInfoList",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (res) {
                var perlist = res.data;
                var totalmoney = 0;
                for(var i=0;i<perlist.length;i++){
                    var price = perlist[i].price;
                    totalmoney =totalmoney +  parseFloat(price);
                }
                $("#totalmoney").html(totalmoney);
                tablePlayDe(perlist);

                /*if (res.code == "200") {
                 tablePlayAdd(res.data.list); //列表渲染
                 //laypageCurrAdd(res.result); //分页渲染
                 } else {
                 layer.msg(res.data.message);
                 }*/
            }
        });
    }
    // 初始化加载
    /* 以下 wj 新增 */
    getTuanDetail();//线路基本信息
    getCadreListDe();
    getCostAppendList();

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
                var result = response.data;

                var tuanname = result[0].tuanname; //线路名称
                $("#tuanname").html(tuanname);

                var bengintime = result[0].bengintime; //开始日期
                var endtime = result[0].endtime; //结束日期

                $("#lydate").html(bengintime+"～"+endtime);

                var percount = result[0].percount; //人数
                if(percount!=undefined){
                    $("#percount").html(percount+"人");
                }else {
                    $("#percount").html("0 人");
                }
                var hname = "";
                for(var i=0;i<result.length;i++){
                    var lhname = result[i].hname; //疗养院名称
                    hname = hname + "、"+lhname
                }
                $("#hname").html(hname.substring(1));
            }
        });
    }
    // 加载附件
    function getCostAppendList() {
        //获取所有人员列表
        var costid = $("#costid").val();
        var params = new Object();
        params.costid = costid;
        $.ajax({
            url: "/formalCost/getCostAppendList",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (res) {
                var appends = res.data;
                if(undefined!=appends&&appends.length>0){
                    for(var i=0;i<appends.length;i++){
                        $("#preview").append('<p class="deP">' +
                            '<span>附件： '+appends[i].NAME+'</span> <a class="deA delete" href="javascript:void(0);" data-href="'+appends[i].url+'" data-name="'+appends[i].NAME+'">查看</a>' +
                            '</p>');
                    }
                }
            }
        });
    }

   //下载附件
   $("#preview").on("click",".delete",function () {
        var href = $(this).data("href");
        var name = $(this).data("name");
        //alert(href + "-----" + name);
        var parames = {};
       parames.fileurl = href;
       parames.filename = name;
       window.open(href);
       /*$.ajax({
           url: "/filedownload",
           type: 'get',
           data: parames,
           success: function (res) {
               // console.log("Download file DONE!");
               // console.log(data); // ajax方式请求的数据只能存放在javascipt内存空间，可以通过javascript访问，但是无法保存到硬盘
               // console.log(status);
               // console.log(xhr);
               // console.log("=====================");
           }
       });*/
    });
    //点击修改按钮
    $("#determine").click(function () {
        var formalid = $("#formalid").val();
        var costid = $("#costid").val();
        var lineid = $("#lineid").val();
        var pagedata = $("#pagedata").val();
        window.location.href="/formalCost/tovestMoneyModify?formalid="+formalid+"&costid="+costid+"&lineid="+lineid+"&pagedata="+pagedata;
    });
    //点击返回按钮
    // $("#goback").click(function () {
    //     var formalid = $("#formalid").val();
    //     var costid = $("#costid").val();
    //     var lineid = $("#lineid").val();
    //     var pagedata = $("#pagedata").val();
    //     window.location.href="/formalCost/tovestMoneyModify?formalid="+formalid+"&costid="+costid+"&lineid="+lineid+"&pagedata="+pagedata;
    // });
});