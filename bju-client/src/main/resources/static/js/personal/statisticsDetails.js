layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','ajax','projectile','pagination'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,ajax = layui.ajax //自定义请求数据
        ,projectile = layui.projectile//自定义弹框
        ,pagination = layui.pagination//自定义分页
        ,limitNumber = 10
        ,pageFlag = true
        ,pageFlagUser = true
        ,url = "/formalLineEnterprise/infoList";

    var searchObj = {};
    var searchObjUser = {};
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
                    {field: 'enterpriseName',title: '企业名称', width: '35%'}
                    , {field: 'maxCount',title: '限报人数',align:'center', width: '25%'}
                    , {field: 'nowCount',title: '报名人数',align:'center', width: '25%'}
                    , {title: '操作',width: '15%',templet: function (d) {
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
                    {field: 'name',title: '姓名', width: '10%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '20%'}
                    , {field: 'cardId',title: '京卡号', width: '15%'}
                    , {field: 'idcard',title: '身份证号',width: '15%'}
                    , {field: 'phone',title: '联系方式',width: '10%'}
                /*    , {field: 'line',title: '疗养线路',width: '15%'}
                    , {field: 'time',title: '疗养时间',width: '15%'}*/
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
        params.formalId = id;
        params.enterpriseId = enterpriseId;
        ajax.request(url,'GET',params,function(res){
            laypageCurr(res);
            tablePlay(res.list);
            //去除loding
            // parent.tools.stop();
        });
    }

    getCadreList();
    //获取报名人员列表
    function getCadreList1(pageNumber,pageSize,id){
        //数据加载中loading
        // parent.tools.load();
        var params = searchObjUser;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        ajax.request("/formalLineUser/list",'GET',params,function(res){
            laypageCurr1(res);
            tablePlay1(res.list);
            //去除loding
            // parent.tools.stop();
        });
    }
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        var id = obj.data.formalId;
        if(obj.event==='see'){//操作—查看详情
            projectile.elastic({title:'报名人员列表',content:$("#people"),area: ['95%','80%']},function () {
                pageFlagUser = true;
                searchObjUser.formalLineId = id;
                searchObjUser.enterpriseId = enterpriseId;
                getCadreList1();
            });
        }
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});