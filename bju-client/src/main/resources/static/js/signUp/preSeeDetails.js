layui.config({
    base : "../../js/"
}).use(['form','jquery','table','layer','pagination','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,pagination = layui.pagination//自定义分页
        ,ajax = layui.ajax //自定义请求数据
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "https://www.easy-mock.com/mock/5d70cd69173be2677010f36b/sanatorium/newsBulletin";

    function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    if(getQuery('closure')){
        $('.layui-btn').attr('data-type','sure').text('确定');
    }
    /*console.log(getQuery('id'));//活动id
    console.log(getQuery('closure'));//活动结束--查看
    console.log(getQuery('typeId'));//用来区分劳模报名、优秀员报名、普通职工报名*/

    var personnel = [
        // {place:'河北-秦皇岛',month:'一月', people:'25',id:1},
        // {place:'河北-秦皇岛',month:'七月', people:'25',id:2},
        // {place:'河北-秦皇岛',month:'四月', people:'25',id:3},
    ];

    //列表渲染
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
                    {type:'numbers',title: '序号', width: '10%'}
                    , {field: 'place',title: '选择报名地点', width: '35%'}
                    , {field: 'month',title: '选择报名月份',align:'center', width: '30%'}
                    , {field: 'people',title: '人数',align:'center', width: '25%'}
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
    //处理参数
    var userType = $("#userType").val();
    var preId = $("#preId").val();
    //加载数据
    getCadreList('','');
    function getCadreList(pageNumber,pageSize){
        //数据加载中loading
        var params = new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.preId = preId;
        userType == undefined ? 3:userType;
        params.userType = userType;
        $.ajax({
            url:"/preRegistration/findPreLineDetail" ,
            type:"GET" ,
            data:params,
            success:function (res) {
             if(res.code == 200){
                 console.log(res);
                 var dataList = res.data.list;
                 for(var i=0;i<dataList.length;i++){
                     var param = {};
                     // param.tempId = new Date().valueOf();
                     param.place = dataList[i].regionName;
                     param.month = dataList[i].month;
                     param.people = dataList[i].personCount;
                     personnel.push(param);
                     tablePlay(personnel);
                     laypageCurr(res.data);
                 }
                 document.getElementById("myPreLineName").innerHTML = res.data.list[0].title;
                 document.getElementById("myDescribetion").innerHTML = res.data.list[0].describetion;
             }
            },
            dataType:"json"//设置接受到的响应数据的格式
        });
        //前端测试代码——仅限开发环境使用，正式时请去除
        // var res = {count:8};
        // laypageCurr(res);
        // tablePlay(personnel);
    }
    //注册按钮事件
    $('.layui-btn[data-type]').on('click', function () {
        var type = $(this).data('type');
        if(type=='modify'){//修改----预报名查看修改
            // window.location.href="route?name=signUp/forecastName&id="+$(this).data("id")+"&typeId="+getQuery('typeId');
            window.location.href="route?name=signUp/forecastName&preId="+preId+"&userType="+userType;
        }else if(type=='sure'){
            window.location.href="route?name=signUp/registrationList";
        }
    });



});