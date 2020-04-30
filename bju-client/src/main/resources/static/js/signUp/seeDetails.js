layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','pagination','ajax','projectile'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,pagination = layui.pagination//自定义分页
        ,ajax = layui.ajax //自定义请求数据
        ,projectile = layui.projectile//自定义弹框
        ,toExamine = 1 //0为未审核、1为已审核
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/formalLineUser/list";

    var myParams = new Object();
    myParams.userType = $("#userType").val();
    myParams.formalLineId = $("#formalLineId").val();
    function getFormalLineById() {
        ajax.request("/formalLine/getInfoById/" + myParams.formalLineId,'GET',"",function(res){
            $("#explain").html(res.message);
            $("#lineName").html(res.name);
            myParams.lineStatus = res.lineStatus;
        });
    }

    getFormalLineById();

    function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    //列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: '#table',
            data: data,
            loading: true,
            skin: 'line',
            limit:data.length,
            cols: [//设置表头参数
                [
                    {type:'numbers',title: '序号', width: '5%'}
                    , {field: 'cardId',title: '京卡卡号', width: '10%'}
                    , {field: 'name',title: '姓名', width: '8%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '15%'}
                    , {field: 'sex',title: '性别', width: '8%',templet: function (d) {
                        if (d.sex == "0") {return "女";
                        } else if (d.sex == "1") {return "男";}
                        else{
                            return "";
                        }
                    }}
                    , {field: 'age',title: '年龄', width: '8%'}
                    , {field: 'nationName',title: '民族', width: '8%'}
                    , {field: 'idcard',title: '身份证号', width: '15%'}
                    , {field: 'phone',title: '联系方式', width: '15%'}
                    , {field: 'job',title: '职务',width: '8%'}
                ]
            ],
            done: function(res, curr, count){
                setTimeout(function () {
                    parent.tools.redefinition($(".childrenBody").height());
                },200);
            }
        });
    }
    //分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data:res,num:res,elem:'page'},function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    //加载数据
    getCadreList();
    function getCadreList(pageNumber,pageSize){
        var params = {};
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.formalLineId = myParams.formalLineId;
        $.ajax({
            url:"/formalLineUser/regList" ,
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    limitNumber == res.data.length;
                        tablePlay(res.data);
                        if(res.data.length > 0){
                        }

                    // laypageCurr(res.data);
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
        return false;
    }
    //修改---正式报名查看修改
    $('#modify').on('click', function () {
        if(myParams.lineStatus >= 3){
            layer.confirm("线路已成团，不能修改");
        }else {
            if(toExamine==0){
                window.location.href="route?name=signUp/formalRegistration&formalLineId="+myParams.formalLineId+"&userType="+myParams.userType;
            }else {
                projectile.tips({content:$("#registered"),area: ['416px','170px']},function () {});
            }
        }
    });
    //确定---正式报名查看修改
    $('#sure').on('click', function () {
        window.location.href="route?name=signUp/registrationList";
            // window.location.href="route?name=signUp/formalRegistration&formalLineId="+myParams.formalLineId+"&userType="+myParams.userType;
    });

    //弹框---点击取消
    $("#cancel").click(function () {
        layer.closeAll();
        return false;
    });
    //弹框---点击确定
    $("#define").click(function () {
        layer.closeAll();
        window.location.href="route?name=signUp/formalRegistration&formalLineId="+myParams.formalLineId+"&userType="+myParams.userType;

        // window.location.href="route?name=signUp/registrationList&userType="+myParams.userType+"&formalLineId="+myParams.formalLineId;
    });

});