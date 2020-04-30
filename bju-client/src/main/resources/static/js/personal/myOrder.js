layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','element','hour','ajax','pagination'],function(){
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
        ,url = "/sanatoriumOrder/getList";

    var searchObj = {};

    //没有劳模权限隐藏
    if(window.sessionStorage.getItem("modelStatus") == 0){
        $("#laomo").hide();
    }

    getCadreList();

    //监听职工类型切换
    element.on('nav(role)', function(elem){
        typeId = $(this).data("id");
        //表单初始赋值
        form.val("queryForm", {
            "lineName": ''
            ,"sBenginTime": ''
            ,"sEndTime": ''
        });
        getCadreList();
        // $(".currency").hide();
        // $("#operation").hide();
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
        $("#operation").show();
        getCadreList();
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "lineName": ''
            ,"sBenginTime": ''
            ,"sEndTime": ''
        });
        $(".currency").hide();
        $("#operation").hide();
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
                    {field: 'lineName',title: '线路', width: '25%'}
                    , {field: 'time',title: '疗养日期', width: '20%',templet:function(e){
                    return e.sbenginTime + "-" + e.sendTime;
                }}
                    , {field: 'leaderName',title: '领队', width: '10%'}
                    , {field: 'allUsers',title: '总疗养人数',align:'center', width: '15%'}
                    , {field: 'myUsers',title: '我的疗养人员',align:'center', width: '15%'}
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
        var data = obj.data;
        if(obj.event==='see'){//操作—查看详情
            var requestURL = "id="+ data.id +"&sanatorName=" + data.sanatorName + "&lineName=" + data.lineName + "&sBenginTime=" + data.sbenginTime + "&sEndTime=" + data.sendTime + "&leaderName=" + data.leaderName + "&allUsers=" + data.allUsers + "&myUsers=" + data.myUsers;
            window.location.href="/route?name=personal/orderDetails&" + requestURL;
        }
    });
    //点击列表导出
    $("#export").click(function () {
        layer.msg('列表导出');
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});