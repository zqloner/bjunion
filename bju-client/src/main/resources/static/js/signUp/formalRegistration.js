layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','pagination','projectile','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,pagination = layui.pagination//自定义分页
        ,projectile = layui.projectile//自定义弹框
        ,ajax = layui.ajax //自定义请求数据
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "";

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
    /*console.log(getQuery('id'));//活动id
    console.log(getQuery('typeId'));//用来区分劳模报名、优秀员报名、普通职工报名*/

    var personnel = [
        // {cardNum:'sdfgvb565x4',name:'张**',company:'企业名称企业名称企业名称企业发企业名称企业名称企业名称',
        //     sex:'1',age:'25',nation:'汉族',IDCard:'1112229993093292912',phone:'17613153127',post:'局长',id:1},
        // {cardNum:'sdfgvb565x4',name:'张**',company:'企业名称企业名称企业名称企业发企业名称企业名称企业名称',
        //     sex:'0',age:'25',nation:'汉族',IDCard:'1112229993093292912',phone:'17613153127',post:'局长',id:2},
        // {cardNum:'sdfgvb565x4',name:'张**',company:'企业名称企业名称企业名称企业发企业名称企业名称企业名称',
        //     sex:'1',age:'25',nation:'汉族',IDCard:'1112229993093292912',phone:'17613153127',post:'局长',id:3},
    ];
    var personne2 = [
        // {cardNum:'sdfgvb565x4',name:'张**',company:'企业名称企业名称企业名称企业发企业名称企业名称企业名称',
        //     sex:'1',age:'25',nation:'汉族',IDCard:'1112229993093292912',phone:'17613153127',post:'局长',id:1},
        // {cardNum:'sdfgvb565x4',name:'张**',company:'企业名称企业名称企业名称企业发企业名称企业名称企业名称',
        //     sex:'0',age:'25',nation:'汉族',IDCard:'1112229993093292912',phone:'17613153127',post:'局长',id:2},
        // {cardNum:'sdfgvb565x4',name:'张**',company:'企业名称企业名称企业名称企业发企业名称企业名称企业名称',
        //     sex:'1',age:'25',nation:'汉族',IDCard:'1112229993093292912',phone:'17613153127',post:'局长',id:3},
    ];
    var myPage = new Object();

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
                    {type: 'checkbox',width:'5%'}
                    ,{type:'numbers',title: '序号', width: '5%'}
                    , {field: 'cardId',title: '京卡卡号', width: '10%'}
                    , {field: 'name',title: '姓名', width: '8%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '15%'}
                    , {field: 'sex',title: '性别', width: '8%',templet: function (d) {
                        if (d.sex == "0") {return "女";
                        } else if (d.sex == "1") {return "男";}
                    }}
                    , {field: 'age',title: '年龄', width: '8%'}
                    , {field: 'nationName',title: '民族', width: '8%'}
                    , {field: 'idcard',title: '身份证号', width: '15%'}
                    , {field: 'phone',title: '联系方式', width: '10%'}
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
    //列表渲染
    function tablePlay1(data) {
        table.render({
            id: "enquiry1",
            elem: '#table1',
            data: data,
            loading: true,
            skin: 'line',
            limit:data.length,
            cols: [//设置表头参数
                [
                    {type: 'checkbox',width:'5%'}
                    ,{type:'numbers',title: '序号', width: '5%'}
                    , {field: 'cardId',title: '京卡卡号', width: '10%'}
                    , {field: 'name',title: '姓名', width: '8%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '15%'}
                    , {field: 'sex',title: '性别', width: '8%',templet: function (d) {
                        if (d.sex == "0") {return "女";
                        } else if (d.sex == "1") {return "男";}
                    }}
                    , {field: 'age',title: '年龄', width: '8%'}
                    , {field: 'nationName',title: '民族', width: '8%'}
                    , {field: 'idcard',title: '身份证号', width: '15%'}
                    , {field: 'phone',title: '联系方式', width: '10%'}
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
    //分页渲染
    function laypageCurr1(res) {
        if (pageFlag) {
            pagination.paging({data:res,num:res.pageSize,elem:'page'},function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList1(obj.curr, obj.limit)
                }
            });
        }
    }
    //加载数据
    getCadreList();
    function getCadreList(pageNumber,pageSize){
        var params =new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.formalLineId = myParams.formalLineId;
        params.userType = myParams.userType;
        $.ajax({
            url:"/formalLineUser/regList" ,
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    personnel = res.data;
                    myPage = res.data;
                    // laypageCurr(myPage);
                    tablePlay(personnel);
                    if(personnel.length==0){
                        myParams.saveOrUpdate = 0 ;
                        $(".item_btn").hide();
                        $("#submit").hide();
                        $("#addRow").show();
                    }else {
                        $("#addRow").hide();
                        $(".item_btn").show();
                        $("#submit").show();
                    }
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });

        //前端测试代码——仅限开发环境使用，正式时请去除
        // var res = {count:8};
    }


    function getEnterPrise() {
        $.ajax({
            url:"/enterpriseEnterprise/getLowLevelEnterpriseNotIsLaoMo" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    var strstr = '<option value="">请选择</option>';
                   for(var i = 0;i<res.data.length;i++){
                       strstr += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>'
                   }
                    $("[name=lowerEnterePrise]").html(strstr);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }

    getEnterPrise();


    //两个集合的差集
    function array_diff(a, b) {
        for (var i = 0; i < b.length; i++) {
            for (var j = 0; j < a.length; j++) {
                if (a[j].id == b[i].id) {
                    a.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        return a;
    }
    //加载数据
    function getCadreList1(pageNumber,pageSize){
        var params =new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.userType = myParams.userType;
        params.cardId = myParams.cardId;
        params.name = myParams.username;
        params.sex =  myParams.sex;
        params.payPhone = myParams.payPhone;
        params.IDCard = myParams.IDCard;
        params.enterpriseId = myParams.eid;
        $.ajax({
            // getEnterPriseUserLis
            // url:"/enterpriseUser/list" ,
            type:"GET",
            url:"/enterpriseUser/getEnterPriseUserList" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    personne2 = res.data.list;
                    myPage = res.data;
                    personne2 = array_diff(personne2,personnel);
                    tablePlay1(personne2);
                    if(personne2.length==0){
                        $(".item_btn").hide();
                        $("#submit").hide();
                        $("#addRow").show();
                    }else {
                        $("#addRow").hide();
                        $(".item_btn").show();
                        $("#submit").show();
                    }
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });

        //前端测试代码——仅限开发环境使用，正式时请去除
        // var res = {count:8};

    }
    //注册按钮事件
    $('.layui-btn[data-type]').on('click', function () {
        var type = $(this).data('type');
        if(type=='addRow'){//添加
            if(myParams.lineStatus >= 3){
                layer.confirm("线路已成团，不能修改");
            }else {
                projectile.elastic({title: '选择要添加疗养的职工', content: $("#people"), area: ['95%', '80%']}, function () {
                    limitNumber = 10;
                    pageFlag = true;
                    getCadreList1();
                });
            }
        }else if(type=='del'){//删除
            var checkStatus = table.checkStatus("enquiry")
                ,data = checkStatus.data; //获取选中项
            if(data.length==0){
                layer.msg("请选择要删除的人");
                return false;
            }
            for (var i=0; i<personnel.length; i++) {
                for (var j=0; j<data.length; j++) {
                    if (personnel[i].id == data[j].id) {
                        personnel.splice(i, 1);    //删除一项
                    }
                }
            }
            tablePlay(personnel);
        }else if(type=='submit'){//提交

            if(myParams.saveOrUpdate == 0){
                url ="/formalLineUser/add";
            }else {
                url ="/formalLineUser/update";
            }
            var pars = [];   //封装参数
            for (var i=0;i<personnel.length;i++){
                var par = {};
                par.userId = personnel[i].id;
                par.formalLineId = myParams.formalLineId;
                pars.push(par);
            }
            var param = {};
            var users = [];
            for(var i=0;i<pars.length;i++){
                users.push(pars[i])
            }
            param.users = users;
            param.forId = myParams.formalLineId;
            $.ajax({
                url:url ,
                type:"POST" ,
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(param),
                success:function (res) {
                    if(res.code==200){
                        window.location.href="route?name=signUp/seeDetails&formalLineId="+ myParams.formalLineId;
                    }else {
                        layer.alert(res.message);
                    }
                } ,
                dataType:"json"
            });
            // return false;
            // window.location.href="registrationList.html";
        }
    });
    //点击查找---监听submit提交
    form.on("submit(addNews)",function(data){
        console.log(JSON.stringify(data.field));
        myParams.cardId = data.field.cardNum;
        myParams.username = data.field.username;
        myParams.sex = data.field.sex;
        myParams.payPhone = data.field.phone;
        myParams.IDCard = data.field.IDCard;
        myParams.eid = data.field.lowerEnterePrise;
        pageFlag = true;
        getCadreList1();
        //console.log(data.elem); //被执行事件的元素DOM对象，一般为button对象
        //console.log(data.form); //被执行提交的form对象，一般在存在form标签时才会返回
        //console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "username": ''
            ,"cardNum": ''
            ,"sex": ''
            ,"age": ''
            ,"phone": ''
            ,"IDCard": ''
        });
    });
    //弹框---点击取消
    $("#cancel").click(function () {
        layer.closeAll();
    });

    function unique(arr){
        for(var i=0; i<arr.length; i++){
            for(var j=i+1; j<arr.length; j++){
                if(arr[i].id==arr[j].id){         //第一个等同于第二个，splice方法删除第二个
                    arr.splice(j,1);
                    j--;
                }
            }
        }
        return arr;
    }
    //弹框---点击确定
    $("#define").click(function () {
        var checkStatus = table.checkStatus("enquiry1")
            ,data = checkStatus.data; //获取选中项
        if(data.length==0){
            layer.msg("请选择要添加疗养的职工");
            return false;
        }else {
            console.log(data);
            console.log(personnel);
            for(var i=0;i<data.length;i++){
                personnel.push(data[i]);
            }
            personnel = unique(personnel);
            limitNumber = personnel.length ;
            layer.closeAll();
            tablePlay(personnel);
            $("#addRow").hide();
            $(".item_btn").show();
            $("#submit").show();
        }
    });
});