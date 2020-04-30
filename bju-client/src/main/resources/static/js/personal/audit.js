layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','element','hour','ajax','projectile','pagination'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,element = layui.element
        ,hour = layui.hour//自定义时间选择
        ,ajax = layui.ajax //自定义请求数据
        ,projectile = layui.projectile//自定义弹框
        ,pagination = layui.pagination//自定义分页
        ,typeId = 1 //职工类型
        ,limitNumber = 10
        ,pageFlag = true
        ,pageFlagUser = true
        ,url = "/formalLineEnterprise/regListPid";

    var searchObj = {};
    var searchObjUser = {};
    //没有劳模权限隐藏
    if(window.sessionStorage.getItem("modelStatus") == 0){
        $("#laomo").hide();
    }

    getCadreList();

    //监听职工类型切换
    element.on('nav(role)', function(elem){
        searchObj = {};
        typeId = $(this).data("id");
        //表单初始赋值
        form.val("queryForm", {
            "enterpriseName": ''
            ,"lineName": ''
            ,"examineStatus": ''
        });
        getCadreList();
        // $(".currency").hide();
    });

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
        getCadreList();

        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "enterpriseName": ''
            ,"lineName": ''
            ,"examineStatus": ''
        });
        $(".currency").hide();
    });
    //表格渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: '#table',
            data: data,
            loading: true,
            skin: 'line',
            limit:limitNumber,
            cols: [//设置表头参数
                [
                    {field: 'enterpriseName',title: '企业名称', width: '20%'}
                    , {field: 'lineName',title: '线路名称', width: '15%'}
                    , {field: 'regDate',title: '报名时间', width: '15%'}
                    , {field: 'maxCount',title: '限报人数',align:'center', width: '10%'}
                    , {field: 'nowCount',title: '报名人数',align:'center', width: '10%',templet: function (d) {
                        return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='people'>"+d.nowCount+"</a>";
                    }}
                    , {field: 'auditType',title: '审核状态', width: '15%',templet: function (d) {
                    var examineStatus = d.examineStatus;
                        if (examineStatus == 1) {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot layui-bg-gray'></i>未审核</a>";
                        } else if (examineStatus == 2) {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot layui-bg-orange'></i>审核中</a>";
                        } else if (examineStatus == 3) {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot layui-bg-green'></i>审核通过</a>";
                        } else if (examineStatus == 4) {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot'></i>审核未通过</a>";
                        }
                    }}
                    , {title: '操作',align:'center',width: '15%',templet: function (d) {
                    var examineStatus = d.examineStatus;
                    if(examineStatus == 1){
                        return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='adopt'>通过</a>"+
                            "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='notPass'>不通过</a>";
                    }else{
                        return "<a class='layui-btn layui-btn-xs layui-btn-primary unavailable'>通过</a>"+
                            "<a class='layui-btn layui-btn-xs layui-btn-primary unavailable'>不通过</a>";
                    }
                    }}
                ]
            ],
            done: function(res, curr, count){
                setTimeout(function () {
                    parent.tools.redefinition($(".childrenBody").height());
                },200);
            }
        });
    }
    //报名人员列表渲染
    function tablePlay1(data) {
        table.render({
            id: "enquiry1",
            elem: '#table1',
            data: data,
            loading: true,
            skin: 'line',
            limit:limitNumber,
            cols: [//设置表头参数
                [
                    {field: 'cardId',title: '京卡号', width: '15%'}
                    ,{field: 'name',title: '姓名', width: '8%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '15%'}
                    , {field: 'sex',title: '性别', width: '5%',align:'center',templet: function (d) {
                        if (d.sex == 1) {return "男";
                        } else if (d.sex == 0) {return "女";}
                    }}
                    , {field: 'age',title: '年龄',align:'center', width: '5%'}
                    , {field: 'idcard',title: '身份证号',width: '13%'}
                    , {field: 'phone',title: '联系方式',width: '10%'}
                    , {field: 'job',title: '职务',width: '7%'}
                    , {field: 'honour',title: '所获荣誉',width: '10%'}
                    , {field: 'honourTime',title: '获得荣誉时间',width: '12%'}
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
            pagination.paging({data:res,num:limitNumber,elem:'page'},function (obj, first) {
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    //报名人员列表分页
    function laypageCurr1(res) {
        if (pageFlagUser) {
            pagination.paging({data:res,num:limitNumber,elem:'page1'},function (obj, first) {
                limitNumber = obj.limit;
                if (!first) {
                    pageFlagUser = false;
                    getCadreList1(obj.curr, obj.limit)
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
        params.userType = typeId;
        ajax.request(url,'GET',params,function(res){
            laypageCurr(res);
            tablePlay(res.list);
            //去除loding
            // parent.tools.stop();
        });
    }
    //获取报名人员列表
    function getCadreList1(pageNumber,pageSize,id){
        //数据加载中loading
        // parent.tools.load();
        var params = searchObjUser;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        ajax.request("/formalLineUser/auditlist",'GET',params,function(res){
            laypageCurr1(res);
            tablePlay1(res.list);
            //去除loding
            // parent.tools.stop();
        });
    }
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        var id = obj.data.id;
        if(obj.event==='people'){//操作—报名人数
            projectile.elastic({title:'报名人员列表',content:$("#people"),area: ['95%','80%']},function () {
                pageFlagUser = true;
                searchObjUser.formalLineId = id;
                getCadreList1(null,null,id);
            });
        }else if(obj.event==='toExamine'){//审核状态
            var maxHeight = '';
            if($("#registered").height()>=380){
                maxHeight = '423px';
            }else if($("#registered").height()<380){
                maxHeight = $("#registered").height();
            }
            ajax.request("/formalLineExamine/examineList",'GET',{"formalLineEnterpriseId":id},function(res){
                dealExamineHtml(res);
                projectile.elastic({title:'审核记录',content:$("#registered"),area: ['520px',maxHeight]},function () {});
            });
        }else if(obj.event==='adopt'){//操作—通过
            projectile.tips({content:$("#adopt"),area: ['416px','170px']},function () {
                //弹框---点击确定
                $("#define").unbind("click").click(function(){
                    changeStatus({"formalLineEnterpriseId": id, "examineStatus": 1});
                    layer.closeAll();
                })
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
                    changeStatus({"formalLineEnterpriseId": id, "examineStatus": 0,"message":data.field.message.trim()});
                    layer.closeAll();
                    return false; //阻止表单跳转
                });
            });
        }
    });
    function changeStatus(data){
        ajax.request("/formalLineExamine/examine",'GET',data,function(res){
            layer.msg("操作成功");
            getCadreList();
        });
    }
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
    //点击提交---监听不通过原因提交
    form.on("submit(failed)",function(data){
        if(data.field.failed==''){
            layer.msg('请输入不通过原因');
        }else {
            layer.closeAll(); //关闭所有层
        }
        return false; //阻止表单跳转
    });

    //弹框---点击取消
    $(".cancel").click(function () {
        layer.closeAll();
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});