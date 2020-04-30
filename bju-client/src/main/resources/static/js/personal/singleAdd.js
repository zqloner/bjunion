layui.config({
    base : "/js/"
}).use(['form','jquery','layer','hour','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,hour = layui.hour//自定义时间选择
        ,ajax = layui.ajax; //自定义请求数据


    form.on('select(selectFilter)', function(data){
        if(data.value == 3){//劳模显示个别项
            $("#honourDiv").show();
            $("#eId").css('display', 'block');
            $("[name=eId]").attr('lay-verify', 'required');
            $("[name=job]").attr("lay-verify","required|illegalChar");//把选项变成必填项
            $("[name=honour]").attr("lay-verify","required|illegalChar");//把选项变成必填项
            $("[name=honourTime]").attr("lay-verify","required");//把选项变成必填项
        }else{//不显示个别项
            $("#eId").css('display', 'none');
            $("[name=eId]").val("");
            $("[name=eId]").removeAttr('lay-verify');
            $("[name=job]").removeAttr("lay-verify");
            $("[name=honour]").removeAttr("lay-verify");
            $("[name=honourTime]").removeAttr("lay-verify");
            $("#honourDiv").hide();
        }
    });

    function  getEnterprise() {
        $.ajax({
            url:"/enterpriseEnterprise/getLowLevelEnterprise" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    var myHtml = '<option value="">请选择</option>';
                    for(var i = 0;i<res.data.length;i++){
                        myHtml += ' <option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
                    }
                    $("[name=eId]").html(myHtml);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    getEnterprise();
    function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    if(getQuery('id')){
        var obj = {workers:'0',cardNum:'sdfgvb565x4',username:'张**',sex:'1', age:'25',nation:'汉族',health:'1',
            IDCard:'1112229993093292912',phone:'17613153127',post:'局长',honors:'三八红旗手',time:'2019/05/09',id:1};
        form.val("addition", {
            "workers": obj.workers
            ,"cardNum": obj.cardNum
            ,"username": obj.username
            ,"sex": obj.sex
            ,"age": obj.age
            ,"nation": obj.nation
            ,"health": obj.health
            ,"IDCard": obj.IDCard
            ,"phone": obj.phone
            ,"hobby": obj.hobby
            ,"post": obj.post
            ,"honors": obj.honors
            ,"time": obj.time
        });
    }
    //监听健康状况选择
    form.on('radio(health)', function(data){
        if(data.value==2){
            // $(".disease").show();
            $("#health").append('<div class="layui-input-inline disease">' +
                '<input type="text" name="disease" placeholder="请输入" maxlength="100" autocomplete="off" class="layui-input">' +
                '</div>');
        }else {
            $(".disease").remove('div');
        }
        form.render();
    });
    //点击确定---监听submit提交
    form.on("submit(addNews)",function(data){
        $("#submitButton").attr("disabled",true);
        var editUrl = "";
        if (id != undefined && id != "") {
            data.field.id = id;
            editUrl = "/enterpriseUser/update";
        }else{
                data.field.eId = $("[name=eId]").val();
                editUrl = "/enterpriseUser/add";
        }
        ajax.request(editUrl,'POST',data.field,function(res){
            $("#submitButton").attr("disabled",false);
            layer.msg("操作成功");
            window.location.href="/route?name=personal/staffManagement";
        },function (res) {
            layer.msg(res.message);
            $("#submitButton").attr("disabled",false);
        });
        return false; //阻止表单跳转
    });
    $("#cancel").click(function () {
        window.location.href="/route?name=personal/staffManagement";
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);

    //todo ***************************************************************************************
    if (id != undefined && id != "") {
        ajax.request("/enterpriseUser/user/" + id,'GET',"",function(obj){
            if(obj.health==2){
                // $(".disease").show();
                $("#health").append('<div class="layui-input-inline disease">' +
                    '<input type="text" name="disease" placeholder="请输入" maxlength="100" autocomplete="off" class="layui-input">' +
                    '</div>');
            }else {
                $(".disease").remove('div');
            }
            form.val("addition", {
                "userType": obj.userType
                ,"cardId": obj.cardId
                ,"name": obj.name
                ,"sex": obj.sex
                ,"birthday": obj.birthday
                ,"nationId": obj.nationId
                ,"health": obj.health
                ,"IDCard": obj.idcard
                ,"phone": obj.phone
                ,"hobby": obj.hobby
                ,"job": obj.job
                ,"honour": obj.honour
                ,"honourTime": obj.honourTime
            });
        });
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
    });
});