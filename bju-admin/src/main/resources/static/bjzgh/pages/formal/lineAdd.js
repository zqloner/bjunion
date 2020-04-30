/**
 * Created by zhuxq on 2019/9/9.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form','transfer', 'layedit','hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , transfer = layui.transfer
        , layedit = layui.layedit
        , hour = layui.hour;


    var value = $("#enterprisesValue").text();
    var enterprises = JSON.parse(value);
    var transferData = [];
    for(var i = 0;i < enterprises.length;i++){
        transferData.push({"value":enterprises[i].id,"title":enterprises[i].name});
    }

    function changChinese(){
        if($("#id").val() != undefined){
            $("[name=myChinese]").html("编辑");
        }else {
            $("[name=myChinese]").html("添加");
        }
    }
    changChinese();

    // 渲染穿梭框
    transfer.render({
        elem: '#company'  //绑定元素
        ,title: ['全部单位名称', '全部单位名称']  //自定义标题
        ,data: transferData
        ,height: 210 //定义高度
        ,id:'company'//定义索引
        ,onchange: function(data, index){
            if(index == 1){
                for(var i = 0;i < data.length;i++){
                    $("[name=" + data[i].value + "]").parents("tr").eq(0).remove();
                }
            }else{
                dealSignUpHtml();
            }
        }
    });
    //获得右侧数据
    // var getData = transfer.getData('company');

    function dealSignUpHtml() {
        var data = transfer.getData('company');
        var value = "";
        for(var i = 0;i < data.length;i++){
            var id = data[i].value;
            if($("[name="+ id +"]").length == 0){
                value += '              <tr>'+
                    '                        <td>'+
                    '                            '+ data[i].title +
                    '                        </td>'+
                    '                        <td>'+
                    '                            <input type="text" name="'+ id +'" class="layui-input signUp" lay-verify="positNumber" autocomplete="off" placeholder="请填写限报人数">'+
                    '                        </td>'+
                    '                    </tr>';
            }
        }
        $("#signUpHtml").after(value);
    }

    // 监听提交
    form.on('submit(submitData)', function (data) {
        $("[name=submitData]").attr("disabled","disabled");
        var params = data.field;
        var enterprisesArr = [];
        var maxCount = 0;
        $(".signUp").each(function(){
            var count = Number($(this).val());
            maxCount += count;
            enterprisesArr.push({"enterpriseId":$(this).attr("name"),"maxCount":count});
        })
        params.maxCount = maxCount;
        params.enterprises = enterprisesArr;
        params.userType = userType;

        var url = "";
        if(currentDataId != ""){
            url = "/formalLineSingUp/update";
            params.id = currentDataId;
        }else{
            url = "/formalLineSingUp/add";
        }
        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(params),
            contentType : "application/json;charsetset=UTF-8",
            success: function (res) {
                if (res.code == 200) {
                    window.location.href="/route?name=formal/line";
                }else {
                    $("[name=submitData]").removeAttr("disabled");
                    $("[name=submitData]").attr("enabled","enabled");
                    layer.msg(res.message);
                }
            }
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


    $("#cancel").click(function () {
        window.location.href="/route?name=formal/line";
    });
    if(currentDataId != ""){
        $.ajax({
            url: "/formalLineSingUp/getInfoById/" + currentDataId,
            type: "GET",
            data: "",
            success: function (res) {
                if (res.code == 200) {
                    showData(res.data);
                }else {
                    layer.msg(res.message);
                }
            }
        });
    }
    function showData(obj){
        form.val("queryForm", {
            "lineId": obj.lineId
            ,"sBenginTime": obj.sbenginTime
            ,"sEndTime": obj.sendTime
            ,"rBeginTime": obj.rbeginTime
            ,"rEndTime": obj.rendTime
        });
        var enterprises = obj.enterprises;
        var arr = [];
        for(var i = 0;i < enterprises.length;i++){
            arr.push(enterprises[i].enterpriseId);
        }
        transfer.reload("company", {"value":arr}); //重载实例
        dealSignUpHtml();
        for(var i = 0;i < enterprises.length;i++){
            $("[name=" + enterprises[i].enterpriseId + "]").val(enterprises[i].maxCount);
        }
        form.render();
    }


    //表单校验
    form.verify({
        positNumber:function (value) {
            var reg = /^[\@\#\$\%\^\&\*\(\)\{\}\:\"\<\>\?\[\]]$/;
            var split = value.split("");
            console.log(split);
            for(var i = 0;i < split.length;i++){
                if(reg.test(split[i])){
                    return "非法字符";
                }
            }
        },
        socialCreditCode:function (value) {
            if(!CheckSocialCreditCode(value)){
                return "请输入正确的社会统一信用代码";
            }
        },
        account:function(value){
            var reg = /^\w{6,20}$/;
            if(!reg.test(value)){
                return "用户名格式为6-20个字符,包括字母、数字、下划线";
            }
        },
        contacts:function(value){
            value = value.trim();
            if(!(value.length >= 2 && value.length <= 20)){
                return "请输入正确的姓名";
            }
        },
        QAUrl:function(value){
            if(imageUrl.trim().length == 0){
                return "请上传资质证明图片";
            }
        },
        positNumber:function (value) {
            if(!(/^[1-9]*[1-9][0-9]*$/.test(value))){
                return "请填写正确的人数";
            }
        },
        company:function(value){
            if($(".signUp").length == 0){
                return "请选择单位";
            }
        },
        checkTime:function(){
            var sBenginTime = $("[name=sBenginTime]").val()+" 23:59:59";
            var rBeginTime = $("[name=rBeginTime]").val();
            var rEndTime = $("[name=rEndTime]").val();
            if(sBenginTime!=undefined && sBenginTime!='' && sBenginTime<rEndTime){
                return "报名结束时间应小于等于疗养开始时间";
            }
            if(sBenginTime!=undefined && sBenginTime!='' && rEndTime<rBeginTime){
                return "报名开始时间应小于等于报名结束时间";
            }
        }
    });
});