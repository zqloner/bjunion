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
        ,pagination = layui.pagination//自定义分页
        ,typeId = 1 //职工类型
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/formalLine/statistics";

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
            "name": ''
            ,"sBenginTime": ''
            ,"sEndTime": ''
            ,"lineStatus": ''
        });
        getCadreList();
        // $("#operation").hide();
        // $(".currency").hide();
    });

    var personnel = [
        {line:'福建厦门6日游', total:'25',clustering:'0',enrolment:'20', time:'2019/04/25 - 2019/04/25'},
        {line:'黄山休闲之旅四晚五日', total:'25',clustering:'1',enrolment:'21', time:'2019/04/25 - 2019/04/25'},
        {line:'北京秦皇岛5日游', total:'25',clustering:'2',enrolment:'22', time:'2019/04/25 - 2019/04/25'},
        {line:'北京秦皇岛5日游', total:'25',clustering:'1',enrolment:'23', time:'2019/04/25 - 2019/04/25'}
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
        debugger;
        $("#operation").show();
        $(".currency").show();
        getCadreList();
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "name": ''
            ,"sBenginTime": ''
            ,"sEndTime": ''
            ,"lineStatus": ''
        });
        $("#operation").hide();
        $(".currency").hide();
    });
    //点击列表导出
    $("#export").click(function () {
        layer.msg('列表导出');
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
                    {field: 'name',title: '线路', width: '30%'}
                    , {field: 'time',title: '疗养日期', width: '20%',templet: function (d) {
                    return d.sbenginTime + "-" + d.sendTime;
                }}
                    , {field: 'clustering',title: '线路成团状态', width: '15%',templet: function (d) {
                    var isTeam = d.lineStatus;
                        if (isTeam == 2) {
                            return "<span><i class='layui-badge-dot layui-bg-gray'></i>未成团</span>";
                        } else if (isTeam == 3) {
                            return "<span><i class='layui-badge-dot layui-bg-green'></i>已成团</span>";
                        } else if (isTeam == 1) {
                            return "<span><i class='layui-badge-dot layui-bg-orange'></i>报名中</span>";
                        }else{
                            return "<span><i class='layui-badge-dot layui-bg-green'></i>已成团</span>";
                        }
                    }}
                    , {field: 'maxCount',title: '限报人数',align:'center', width: '10%'}
                    , {field: 'nowCount',title: '报名人数',align:'center', width: '10%'}
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
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        console.log(obj.data);
        if(obj.event==='see'){//操作—查看详情
            window.location.href="/route?name=personal/statisticsDetails&id=" + obj.data.formalLineEnterpriseId+"&enterpriseId="+obj.data.enterpriseId;
        }
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});