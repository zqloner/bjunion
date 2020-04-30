layui.config({
    base : "/js/"
}).use(['form','jquery','layer','projectile','fileUpload','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,projectile = layui.projectile//自定义弹框
        ,fileUpload = layui.fileUpload//自定义上传文件
        ,ajax = layui.ajax; //自定义请求数据

    form.val('material', {
        "province": provinceId,
        "pid": pid
    })
    if(provinceId != ''){
        var areaData;
        //市
        areaData = getAreaById(provinceId);
        //option  变量
        var areaOption = '<option value="">请选择市</option>';
        $("[name=city]").html(areaOption + appendValue(areaData));
        //区县
        areaData = getAreaById(cityId);
        areaOption = '<option value="">请选择县/区</option>';
        $("[name=area]").html(areaOption + appendValue(areaData));


        function appendValue(data){
            var value = "";
            for(var i = 0; i < data.length; i++){
                value += '<option value='+ data[i].id +'>'+ data[i].regionName +'</option>';
            }
            return value;
        }
        form.render();
        form.val('material', {
            "city": cityId,
            "area": areaId
        })
    }

    //上传图片
    fileUpload.picture({
        elem:"#preview",
        url:"/upload",//上传接口
        data:{"towPath":"enterprise/image"},//额外参数
        accept:"image",
        size:1024
    }, function(res, index, upload){  //执行上传请求后的回调
        layer.closeAll('loading'); //关闭loading
        layer.msg("上传成功！");
        if(res.code == 200){
            imageUrl = res.data;
        }
    });

    //点击提交审核---监听submit提交
    form.on("submit(addNews)",function(data){
        var field = data.field;
        field.qaUrl = imageUrl;
        field.id = id;
        field.areaIdP = field.province;
        field.areaIdC = field.city;
        field.areaIdA = field.area;
        projectile.tips({content:$("#registered"),area: ['416px','170px']},function () {
            //弹框---点击确认提交
            $("#define").click(function () {
                ajax.request("/enterpriseEnterprise/update","POST",field,function(res){
                    layer.closeAll();
                    window.sessionStorage.setItem("perfect",0);
                    window.sessionStorage.setItem("menu",JSON.stringify({href:"/route?name=enterpriseEnterprise/toExamine",side:true}));
                    window.location.href="/route?name=enterpriseEnterprise/toExamine";
                });
            });
        });
        return false; //阻止表单跳转
    });
    //弹框---点击再检查下
    $("#cancel").click(function () {
        layer.closeAll();
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);

    //**********************************************************************************************************
    form.on('select(province)', function (data) {
        $("[name=city]").html('<option value="">请选择市</option>');
        $("[name=area]").html('<option value="">请选择县/区</option>');
        form.render();
        if(data.value != ""){
            var data = getAreaById(data.value);
            var value = '<option value="">请选择市</option>';
            for(var i = 0; i < data.length; i++){
                value += '<option value='+ data[i].id +'>'+ data[i].regionName +'</option>';
            }
            $("[name=city]").html(value);
            form.render();
        }
        return false;
    });
    form.on('select(city)', function (data) {
        $("[name=area]").html('<option value="">请选择县/区</option>');
        form.render();
        if(data.value != ""){
            var data = getAreaById(data.value);
            var value = '<option value="">请选择县/区</option>';
            for(var i = 0; i < data.length; i++){
                value += '<option value='+ data[i].id +'>'+ data[i].regionName +'</option>';
            }
            $("[name=area]").html(value);
            form.render();
        }
        return false;
    });
    function getAreaById(id) {
        var result;
        var data = {
            "pid":id
        }
        $.ajax({
            type:"GET",
            data:data,
            url:"/sysArea/cList",
            success:function(data){
                if(data.code == 200){
                    result = data.data;
                }else{
                    layer.msg(data.message);
                }
            },
            async:false
        });
        return result;
    }
    //表单校验
    form.verify({
        illegalChar:function (value) {
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
            if (value != undefined && value != '') {
                if(!CheckSocialCreditCode(value)){
                    return "请输入正确的社会统一信用代码";
                }
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
    });
});