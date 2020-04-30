/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'fileUpload', 'hour'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , hour = layui.hour//自定义时间选择器
        , fileUpload = layui.fileUpload;//自定义文件上传

    var contractId = $("#contractId").val();
    //合同表单验证
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
        cstcode:function (value) {
            var reg = /^\w{0,20}$/;
            if(!reg.test(value)){
                return "合同编号必须是字母，数字或是下划线"
            }
        }
        ,
        cstname:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "服务合同名称不能为空";
            }
        },
        sta:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "合同开始时间不能为空";
            }
        },
        ywfzr:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "业务负责人不能为空";
            }
        },
        aname:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "甲方名称不能为控";
            }
        },
        alname:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "甲方法务实体名称不能为空";
            }
        },
        alaname:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "甲方联系人不能为空";
            }
        },
        aaddr:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "甲方地址人不能为空";
            }
        },
        bname:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "乙方名称不能为控";
            }
        },
        barr:function (value) {
            var reg = value.trim();
            if(reg == undefined || reg ==''){
                return "乙方地址不能为空";
            }
        },
        comparetime:function () {
            var start = $("[name=start]").val();
            var end = $("[name=end]").val();
            if(start>=end){
                return "开放报名时间必须小于报名结束时间";
            }
        }
    });

    function toUpdate(){
        if(contractId !=undefined && contractId != ''){
            $.ajax({
                url:"/contractContract/toUpdateOrSeeDetail" ,
                type:"GET" ,
                data:{"contractId":contractId},
                success:function (res) {
                    $("[name='num']").val(res.data.contractCode);
                    $("[name='name']").val(res.data.contractName);
                    $("[name='start']").val(res.data.contractBeginTime);
                    $("[name='end']").val(res.data.contractEndTime);
                    $("[name='kind']").val(res.data.type);
                    $("[name='ywPerson']").val(res.data.person);
                    $("[name='ywTel']").val(res.data.phone);
                    $("[name='kaName']").val(res.data.partyaName);
                    $("[name='kaRname']").val(res.data.partyaNameLegal);
                    $("[name='kaPerson']").val(res.data.partyaPerson);
                    $("[name='kaTel']").val(res.data.partyaPhone);
                    $("[name='kaPhone']").val(res.data.partyaTel);
                    $("[name='kaWhere']").val(res.data.partyaAddress);
                    $("[name='yiPerson']").val(res.data.partybPerson);
                    $("[name='yiTel']").val(res.data.partybPhone);
                    $("[name='yiPhone']").val(res.data.partybTel);
                    $("[name='yiWhere']").val(res.data.partyAddress);
                },
                dataType:"json"
            });
        }
    }
    toUpdate();

    // 监听提交
    form.on('submit(submitData)', function (data) {
        console.log(data.field);
        var params = new Object();
        params.contractName = data.field.name ;
        params.contractCode =  data.field.num ; //合同编号
        params.startTime = data.field.start  ;
        params.overTime =data.field.end  ;
        params.person = data.field.ywPerson ; //负责人
        params.phone = data.field.ywTel  ;  //负责人联系方式
        params.partyaName =data.field.kaName;
        params.partyaNameLegal =data.field.kaRname;
        params.partyaPerson = data.field.kaPerson;
        params.partyaPhone = data.field.kaTel;
        params.partyaTel = data.field.kaPhone;
        params.partyaAddress = data.field.kaWhere;
        params.partybPerson = data.field.yiPerson;
        params.partybPhone = data.field.yiTel;
        params.partybTel = data.field.yiPhone;
        params.partyAddress = data.field.yiWhere;
        params.type =data.field.kind;
        params.id = contractId;
        // // 前端测试代码，正式删掉。
        // layer.alert(JSON.stringify(data.field), {
        //     title: '最终的提交信息'
        // }, function () {
        //     layer.closeAll(); //关闭所有层
        //     window.location.href = "../../../../templates/bjzgh/service/agreement.html";
        // });
        if(contractId != undefined && contractId !=''){
            $.ajax({
                url:"/contractContract/doUpdate" ,
                type:"POST" ,
                data:params,
                success:function (res) {
                    if(res.code == 200){
                        window.location.href = "route?name=service/agreement&type="+$("#type").val();
                    }
                    else {
                        layer.alert(res.message);
                    }
                },
                dataType:"json"
            });
        }else {
            $.ajax({
                url:"/contractContract/add" ,
                type:"POST" ,
                data:params,
                success:function (res) {
                    if(res.code == 200){
                        window.location.href = "route?name=service/agreement&type="+$("#type").val();
                    }
                    else {
                        layer.alert(res.message);
                    }
                },
                dataType:"json"
            });
        }
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});