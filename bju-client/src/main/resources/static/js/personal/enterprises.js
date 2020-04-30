layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','element','ajax','projectile','pagination'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,element = layui.element
        ,ajax = layui.ajax //自定义请求数据
        ,projectile = layui.projectile//自定义弹框
        ,pagination = layui.pagination//自定义分页
        ,typeId = 1 //职工类型
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/enterpriseEnterprise/getLowerLevel";

    var searchObj = {};



    if(switchType != ""){
        $("#examineStatusDiv").hide();
        $("#navTab li").removeClass("layui-this");
        $("#navTab li").eq(1).addClass("layui-this");
        typeId = 2;
        searchObj.examineStatus = 3;
        $("#operation").show();
        getCadreList();
    }else{
        $("#examineStatusDiv").show();
        $("#operation").hide();
        $("#navTab li").eq(0).addClass("layui-this");
    }


    //监听职工类型切换
    element.on('nav(role)', function(elem){
        searchObj = {};
        typeId = $(this).data("id");
        getCadreList();
        form.val("queryForm", {
            "name": ''
            ,"contacts": ''
            ,"examineStatus": ''
        });
        if(typeId==1){
            $("#operation").hide();
            $("#examineStatusDiv").show();
        }else{
            $("#operation").show();
            $("#examineStatusDiv").hide();
        }
        // $(".currency").hide();
        // getCadreList();
    });
    getCadreList();
    //企业信息审核
    var audit = [//设置表头参数
        [
            {field: 'account',title: '企业账号', width: '9%'}
            , {field: 'name',title: '企业名称', width: '9%'}
            , {field: 'examineStatus',title: '审核状态', width: '12%',templet: function (d) {
            var examineStatus = d.examineStatus;
                if (examineStatus == 1 || examineStatus == 0) {
                    return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                        "<i class='layui-badge-dot layui-bg-gray'></i>未审核</a>";
                } else if (examineStatus == 2) {
                    return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                        "<i class='layui-badge-dot layui-bg-orange'></i>审核中</a>";
                } else if (examineStatus == 3) {
                    return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                        "<i class='layui-badge-dot layui-bg-green'></i>审核通过</a>";
                } else if (examineStatus == 4) {
                    return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                        "<i class='layui-badge-dot'></i>审核未通过</a>";
                }
            }}
            , {field: 'pname',title: '上级单位', width: '9%'}
            , {field: 'areaName',title: '所在区域', width: '9%'}
            , {field: 'contacts',title: '联系人姓名', width: '10%'}
            , {field: 'phone',title: '联系人电话', width: '10%'}
            , {title: '资质证明',align:'center', width: '9%',templet: function (d) {
                return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='see'>点击查看</a>";
            }}
            , {field: 'createTime',title: '申请时间', width: '9%'}
            , {title: '操作',align:'center',width: '14%',templet: function (d) {
            var examineStatus = d.examineStatus;
            if(examineStatus == 1 || examineStatus == 0){
                return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='adopt'>通过</a>"+
                    "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='notPass'>不通过</a>";
            }else {
                return "<a class='layui-btn layui-btn-xs layui-btn-primary unavailable'>通过</a>"+
                    "<a class='layui-btn layui-btn-xs layui-btn-primary unavailable'>不通过</a>";
            }
            }}
        ]
    ];
    //企业管理
    var manage = [//设置表头参数
        [
            {type: 'checkbox',width:'5%'}
            ,{field: 'account',title: '企业账号', width: '10%'}
            , {field: 'name',title: '企业名称', width: '15%'}
            , {field: 'areaName',title: '所在区域', width: '10%'}
            , {field: 'contacts',title: '联系人姓名', width: '10%'}
            , {field: 'phone',title: '联系人电话', width: '10%'}
            , {field: 'createTime',title: '申请时间', width: '10%'}
            , {title: '操作',align:'center',width: '30%',templet: function (d) {
                var power = '';
            var modelStatus = d.modelStatus;
                if(modelStatus==0 || modelStatus == undefined){
                    power = "<input type='checkbox' name='close' lay-skin='switch' value='"+d.id+"' lay-filter='power' lay-event='power' lay-text='开|关'>";
                }else if(modelStatus==1){
                    power = "<input type='checkbox' checked='' name='close' lay-skin='switch' value='"+d.id+"' lay-filter='power' lay-event='power' lay-text='开|关'>";
                }
                return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='check'>企业详情</a>"+
            "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='reset'> 重置密码</a>"+
            "<span class='xsBtn'>劳模权限</span>"+power;
            }}
        ]
    ];
    //点击查找---监听submit提交
    form.on("submit(addNews)",function(data){
        pageFlag = true;
        var field = data.field;
        for(var key in field){
            if(field[key].trim().length == 0){
                delete field[key];
            }
        }
        searchObj = data.field;
        $(".currency").show();
        if(typeId==2){
            $("#operation").show();
            searchObj.examineStatus = 3;
        }
        getCadreList();
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "name": ''
            ,"contacts": ''
            ,"examineStatus": ''
        });
        $(".currency").hide();
    });
    //表格渲染
    function tablePlay(data,cols) {
        table.render({
            id: "enquiry",
            elem: '#table',
            data: data,
            loading: true,
            skin: 'line',
            limit:limitNumber,
            cols: cols,
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
            pagination.paging({data:res,num:limitNumber,elem:'page'},function (obj, first) {
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    //加载数据
    function getCadreList(pageNumber,pageSize){
        //数据加载中loading
        // parent.tools.load();
        var params = searchObj;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        ajax.request(url,'GET',params,function(res){
            laypageCurr(res);
            if(typeId==1){
                tablePlay(res.list,audit);
            }else if(typeId==2){
                tablePlay(res.list,manage);
            }
            //去除loding
            // parent.tools.stop();
        });
    }
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        var id = obj.data.id;
        if(obj.event==='toExamine'){//审核状态
            var maxHeight = '';
            if($("#registered").height()>=380){
                maxHeight = '423px';
            }else if($("#registered").height()<380){
                maxHeight = $("#registered").height();
            }
            ajax.request("/enterpriseExamine/getExamineList",'GET',{"id":id},function(res){
                dealExamineHtml(res);
                projectile.elastic({title:'审核记录',content:$("#registered"),area: ['520px',maxHeight]},function () {});
            });
        }else if(obj.event==='see'){//操作—资质证明
            projectile.elastic({title:'资质证明',content:$("#prove"),area: ['520px','350px']},function () {
                $(".proveImg").attr("src",obj.data.qaUrl);
            });
        }else if(obj.event==='adopt'){//操作—通过
            projectile.tips({content:$("#adopt"),area: ['416px','170px']},function () {
                //弹框---点击确定
                $("#define").unbind("click").click(function () {
                    changeStatus({"enterpriseId": id, "examineStatus": 1});
                    layer.closeAll();
                });
            });
        }else if(obj.event==='notPass'){//操作—不通过
            projectile.elastic({title:'操作提示',content:$("#failed"),area: ['520px','231px']},function () {
                //表单初始赋值
                form.val("failedForm", {"message": ''});
                //点击提交---监听不通过原因提交
                form.on("submit(failed)",function(data){
                    if(data.field.message.trim().length == 0){
                        layer.msg('请输入不通过原因');
                        return false;
                    }
                    changeStatus({"enterpriseId": id, "examineStatus": 0,"message":data.field.message.trim()});
                    layer.closeAll();
                    return false; //阻止表单跳转
                });
            });
        }else  if(obj.event==='check'){//操作—企业详情
            window.location.href="enterpriseEnterprise/companyDetails?id=" + id;
        }else if(obj.event==='reset'){//操作—重置密码
            ajax.request("/enterpriseEnterprise/restPassword/" + id,'GET',"",function(res){
                layer.msg('密码重置为111111。', {icon: 1});
            });
        }
    });
    function dealExamineHtml(res) {
        var value = "";
        for(var i = 0;i < res.length;i++){
            var currentObj = res[i];
            var examineStatusValue;
            if(currentObj.examineStatus == 0){
                examineStatusValue = "未通过";
            }else if(currentObj.examineStatus == 1){
                examineStatusValue = "通过";
            }else if(currentObj.examineStatus == 2){
                examineStatusValue = "待审核";
            }
            value += '<li class="layui-timeline-item">'+
                '                <i class="layui-icon layui-timeline-axis">'+ (res.length - i) +'</i>'+
                '                <div class="layui-timeline-content layui-text">'+
                '                    <div class="layui-timeline-title">'+ (examineStatusValue == undefined ? "" : "审核状态：" + examineStatusValue) +'</div>'+
                '                    <div class="layui-timeline-title">'+ (currentObj.examineName == undefined ? "" : "审核单位：" + currentObj.examineName) +'</div>'+
                '                    <div class="layui-timeline-title">审核日期：'+ currentObj.createTime +'</div>'+
                '                    <div class="layui-timeline-title">'+ ((currentObj.message != undefined && currentObj.examineStatus == 0) ? "原因：" + currentObj.message : "") +'</div>'+
                '                </div>'+
                '            </li>';
        }
        $("#examineInfo").html(value);
    }
    //监听劳模权限操作
    form.on('switch(power)', function(obj){
        ajax.request("/enterpriseEnterprise/changeModel/" + this.value,'GET',"",function(res){
            layer.msg("操作成功!");
            getCadreList();
        });
        // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
    });
    //弹框---点击取消
    $(".cancel").click(function () {
        layer.closeAll();
    });
    //劳模权限批量处理
    $("#del").click(function () {
        var checkStatus = table.checkStatus("enquiry")
            ,data = checkStatus.data; //获取选中项

        if(data.length==0){
            layer.msg("请选择要处理的人");
            return false;
        }
        var params = new Object();
        var ids = [];
        for(var i=0;i<data.length;i++){
            ids.push(data[i].id);
        }
        params.ids = ids ;
        if(data[0].modelStatus == 0){
            params.modelStatus =1;
        }else {
            params.modelStatus =0;
        }
        $.ajax({
            url:"/enterpriseEnterprise/batchUpdateModel" ,
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    getCadreList();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
        //
        // tablePlay(personnel,manage);
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);

    function changeStatus(data){
        ajax.request("/enterpriseExamine/changeStauts",'POST',data,function(res){
            layer.msg("操作成功");
            getCadreList();
        });
    }
});