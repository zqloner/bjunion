layui.config({
    base : "../../js/"
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
        ,url = "/preLine/findByConditions";

    //没有劳模权限隐藏
    if(window.sessionStorage.getItem("modelStatus") == 0){
        $("#laomo").hide();
    }

    //监听职工类型切换
    element.on('nav(role)', function(elem){
        //表单初始赋值
        form.val("queryForm", {
            "line": ''
            ,"lower": ''
        });
        // $(".currency").hide();
        // layer.msg(elem.text());
        // typeId = $(this).data("id");
        var userType = $(".layui-this").val();
        getCadreList('','',url,userType);
    });

    var personnel = [
        {line:'福建厦门6日游',people:'25', time:'2019/04/25 - 2019/04/25', addTime:'2019-12-27', lowerTime:'2019-12-27',lower:'0'},
        {line:'黄山休闲之旅四晚五日',people:'25', time:'2019/04/25 - 2019/04/25', addTime:'2019-12-27', lowerTime:'2019-12-27',lower:'1'},
        {line:'北京秦皇岛5日游',people:'25', time:'2019/04/25 - 2019/04/25', addTime:'2019-12-27', lowerTime:'2019-12-27',lower:'0'},
        {line:'北京秦皇岛5日游',people:'25', time:'2019/04/25 - 2019/04/25', addTime:'2019-12-27', lowerTime:'2019-12-27',lower:'1'}
    ];
    //点击查找---监听submit提交
    form.on("submit(addNews)",function(data){
        console.log(JSON.stringify(data.field));
        pageFlag = true;
        var userType = $(".layui-this").val();
        getCadreList('','',url,userType);
        $(".currency").show();
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "line": ''
            ,"lower": ''
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
                    {field: 'title',title: '线路', width: '25%'}
                    , {field: 'nowCount',title: '已报名人数',align:'center',width: '15%'}
                    , {title: '疗养日期',width: '25%',templet:function (e) {
                        return e.beginTime+ "-"+ e.endTime;
                    }}
                    , {field: 'createTime',title: '添加日期',width: '15%'}
                    , {field: 'nextTime',title: '下发时间',width: '10%'}
                    , {title: '操作',width: '10%',templet: function (d) {
                        if(d.lower=='1'){
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='details'><i class='layui-icon'>&#xe60a;</i>下发详情</a>";
                        }else if (d.lower=='0') {
                            return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='install'><i class='layui-icon'>&#xe620;</i>下发设置</a>";
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
    //分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data:res,num:res.pageSize,elem:'page'},function (obj, first) {
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
    getCadreList();
    //加载数据
    function getCadreList(pageNumber,pageSize,url,userType){
        var userType = userType ==undefined ? 2:userType;
        var type = $("[name='lower']").val();
        var title = $("[name='line']").val();
        $.ajax({
            url:"/preLine/findByConditions" ,
            type:"GET" ,
            data:{"userType":userType,"type":type,"title":title},
            success:function (res) {
                if(res.data != undefined) {
                    tablePlay(res.data.list);
                    laypageCurr(res.data);
                }else {
                    tablePlay([]);
                    laypageCurr([]);
                    layer.msg(res.message);
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
        // debugger;
        // laypageCurr(res);
        // tablePlay(personnel);
    }
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        console.log(obj.data);
        if(obj.event==='details'){//操作—下发详情
            window.location.href="route?name=personal/lowerDetails&preId="+obj.data.id+"&userType="+$(".layui-this").val();
        }else if(obj.event==='install'){//操作—下发设置
            window.location.href="route?name=personal/lowerInstall&preId="+obj.data.id+"&userType="+$(".layui-this").val();
        }
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});