layui.config({
    base : "../../js/"
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
        ,url = "/preRegistration/preGistrationStatictisRecord";

    //没有劳模权限隐藏
    if(window.sessionStorage.getItem("modelStatus") == 0){
        $("#laomo").hide();
    }

    //监听职工类型切换
    element.on('nav(role)', function(elem){
        // layer.msg(elem.text());
        // typeId = $(this).data("id");
        //表单初始赋值
        form.val("queryForm", {
            "workers": ''
            ,"auditType": ''
            ,"line": ''
            ,"time_min": ''
            ,"time_max": ''
        });
        var userType = $(".layui-this").val();
        getCadreList('','',userType);
        // $(".currency").hide();
    });
    var userType = $(".layui-this").val();

    //点击查找---监听submit提交
    form.on("submit(addNews)",function(data){
        // console.log(JSON.stringify(data.field));
        pageFlag = true;
        var userType = $(".layui-this").val();
        getCadreList('','',userType);
        $(".currency").show();
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "workers": ''
            ,"auditType": ''
            ,"line": ''
            ,"time_min": ''
            ,"time_max": ''
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
                    {field: 'line',title: '线路', width: '30%'}
                    , {field: 'time',title: '报名时间', width: '20%'}
                    , {field: 'total',title: '人数',align:'center', width: '15%'}
                    // , {field: 'auditType',title: '审核状态', width: '20%',templet: function (d) {
                    //     if (d.auditType == "0") {
                    //         return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                    //             "<i class='layui-badge-dot layui-bg-gray'></i>未审核</a>";
                    //     } else if (d.auditType == "1") {
                    //         return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                    //             "<i class='layui-badge-dot layui-bg-orange'></i>审核中</a>";
                    //     } else if (d.auditType == "2") {
                    //         return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                    //             "<i class='layui-badge-dot layui-bg-green'></i>审核通过</a>";
                    //     } else if (d.auditType == "3") {
                    //         return "<a class='layui-btn layui-btn-xs layui-btn-primary'  lay-event='toExamine'>" +
                    //             "<i class='layui-badge-dot'></i>审核未通过</a>";
                    //     }
                    // }}
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
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    //加载数据
    function getCadreList(pageNumber,pageSize,userType){
        var userType = userType == undefined ? 1:userType;
        var title = $("[name=line]").val();
        var startTime = $("[name=time_min]").val();
        var endTime = $("[name=time_max]").val();

        $.ajax({
            url:"/preRegistration/preGistrationStatictisRecord" ,
            type:"GET" , //请求方式
            data:{"userType":userType,"title":title,"startTime":startTime,"endTime":endTime},
            success:function (res) {
              if(res.code == 200){
                  var personnel = [
                      // {line:'福建厦门6日游', total:'25',auditType:'0', time:'2019-12-27'},
                      // {line:'黄山休闲之旅四晚五日', total:'25',auditType:'1', time:'2019-12-27'},
                      // {line:'北京秦皇岛5日游', total:'25',auditType:'2', time:'2019-12-27'},
                      // {line:'北京秦皇岛5日游', total:'25',auditType:'3', time:'2019-12-27'}
                  ];
                  console.log(res);
                  var dataList = res.data.list;
                  for(var i = 0;i<dataList.length;i++){
                      var p = {};
                      p.id = dataList[i].preId;
                      p.line = dataList[i].title;
                      p.total = dataList[i].personCount;
                      p.time = dataList[i].createTime;
                      personnel.push(p);
                  }
                  laypageCurr(res.data);
                  tablePlay(personnel);
              }
            },
            dataType:"json"
        });
        //数据加载中loading
        // parent.tools.load();
        /*var params =new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        ajax.request(url,'GET',params,function(res){
            if(res.result.length!=0){
                laypageCurr(res,'page');
                console.log(res.result);
                journalism(res.result);
            }
            //去除loding
            // parent.tools.stop();
        });*/

        //前端测试代码——仅限开发环境使用，正式时请去除
        // var res = {count:8};
        // laypageCurr(res);
        // tablePlay(personnel);
    }
    getCadreList();
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        console.log(obj.data);
        if(obj.event==='see'){//操作—查看详情
            window.location.href="route?name=signUp/preSeeDetails&preId="+obj.data.id+"&userType="+$(".layui-this").val();
        }else if(obj.event==='toExamine'){//审核状态
            var maxHeight = '';
            if($("#registered").height()>=380){
                maxHeight = '423px';
            }else if($("#registered").height()<380){
                maxHeight = $("#registered").height();
            }
            projectile.elastic({title:'审核记录',content:$("#registered"),area: ['520px',maxHeight]},function () {});
        }
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});