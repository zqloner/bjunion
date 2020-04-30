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
        ,url = "/formalLineEnterprise/regList";

    var searchObj = {};

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
            "examineStatus": ''
            ,"lineName": ''
            ,"start": ''
            ,"end": ''
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
            "examineStatus": ''
            ,"lineName": ''
            ,"start": ''
            ,"end": ''
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
                    {field: 'lineName',title: '线路', width: '30%'}
                    , {field: 'regDate',title: '疗养日期', width: '20%'}
                    , {field: 'nowCount',title: '人数',align:'center', width: '10%'}
                    , {field: 'clustering',title: '成团状态', width: '10%',templet: function (d) {
                    var lineStatus = d.lineStatus;
                        if (lineStatus== "1" || lineStatus == undefined) {
                            return "<span><i class='layui-badge-dot layui-bg-orange'></i>报名中</span>";
                        } else if (lineStatus == "2") {
                            return "<span><i class='layui-badge-dot layui-bg-gray'></i>未成团</span>";
                        } else if (lineStatus == "3") {
                            return "<span><i class='layui-badge-dot layui-bg-green'></i>已成团</span>";
                        }else{
                            return "<span><i class='layui-badge-dot layui-bg-green'></i>已成团</span>";
                        }
                    }}
                    , {field: 'auditType',title: '审核状态', width: '15%',templet: function (d) {
                    var status = d.examineStatus;
                        if (status == "1") {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot layui-bg-gray'></i>未审核</a>";
                        } else if (status == "2") {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot layui-bg-orange'></i>审核中</a>";
                        } else if (status == "3") {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot layui-bg-green'></i>审核通过</a>";
                        } else if (status == "4") {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='toExamine'>" +
                                "<i class='layui-badge-dot'></i>审核未通过</a>";
                        }
                    }}
                    , {title: '操作',align:'center',width: '15%',templet: function (d) {
                        return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='see'>查看详情</a>";
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
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        var id = obj.data.id;
        var formalId = obj.data.formalId;
        if(obj.event==='see'){//操作—查看详情
            window.location.href="/route?name=signUp/seeDetails&id="+id+"&typeId="+typeId+"&formalLineId="+formalId;
        }else if(obj.event==='toExamine'){//审核状态
            var maxHeight = '';
            if($("#registered").height()>=380){
                maxHeight = '423px';
            }else if($("#registered").height()<380){
                maxHeight = $("#registered").height();
            }
            ajax.request("/formalLineExamine/examineList",'GET',{"formalLineEnterpriseId":id},function(res){
                dealExamineHtml(res);
                projectile.elastic({title:'审核记录',content:$("#registered"),area: ['520px',maxHeight]},function () {
                });
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
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});