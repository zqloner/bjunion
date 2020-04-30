layui.config({
    base : "/js/"
}).use(['form','jquery','table','layer','element','ajax','pagination'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,element = layui.element
        ,ajax = layui.ajax //自定义请求数据
        ,pagination = layui.pagination//自定义分页
        ,typeId = 1 //职工类型
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/enterpriseUser/list";

    var searchObj = {};
    // $("#operation").show();//todo 测试用
    // $(".currency").show();//todo 测试用

    console.log(window.sessionStorage.getItem("modelStatus"));
    //没有劳模权限隐藏
    if(window.sessionStorage.getItem("modelStatus") == 0){
        $(".laomo").remove();
        form.render();
    }
    getCadreList();
    //todo 获取所有企业
    getEnterpriseList();
    function getEnterpriseList(){
        ajax.request("/enterpriseEnterprise/getList",'GET',"",function(res){
            var value = "<option value=''>请选择</option>";
            for(var i = 0;i < res.length;i++){
                value += "<option value="+ res[i].id +">"+ res[i].name +"</option>"
            }
            $("[name=enterpriseId]").html(value);
            form.render();
        });
    }

    //监听职工类型切换
    element.on('nav(role)', function(elem){
        typeId = $(this).data("id");
        //表单初始赋值
        form.val("queryForm", {
            "eId": ''
            ,"jobName": ''
            ,"name": ''
            ,"sex": ''
            ,"cardId": ''
            ,"phone": ''
            ,"IDCard": ''
        });
        // $("#operation").hide();
        $(".currency").hide();
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
        // $("#operation").show();
        $(".currency").show();
        getCadreList();
        return false; //阻止表单跳转
    });
    //点击重置
    $("#reset").click(function () {
        //表单初始赋值
        form.val("queryForm", {
            "eId": ''
            ,"jobName": ''
            ,"name": ''
            ,"sex": ''
            ,"cardId": ''
            ,"phone": ''
            ,"IDCard": ''
        });
        // $("#operation").hide();
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
                    {type: 'checkbox',width:'4%'}
                    , {field: 'cardId',title: '京卡卡号', width: '8%'}
                    , {field: 'name',title: '姓名', width: '6%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '8%'}
                    , {field: 'sex',title: '性别', width: '6%',templet: function (d) {
                    if (d.sex == "0") {return "女";
                    } else if (d.sex == "1") {return "男";}
                    else{
                        return "";
                    }
                }}
                    , {field: 'age',title: '年龄', width: '4%'}
                    , {field: 'nationName',title: '民族', width: '5%'}
                    , {field: 'health',title: '健康状况', width: '6%',templet: function (d) {
                    var health = d.health
                    if(health == 0){
                        return "健康";
                    }else if(health == 1){
                        return "一般";
                    }else if(health == 2){
                        return "有疾病";
                    }
                }}
                    , {field: 'idcard',title: '身份证号', width: '7%'}
                    , {field: 'phone',title: '联系方式', width: '7%'}
                    , {field: 'hobby',title: '爱好', width: '5%'}
                    , {field: 'job',title: '职务',width: '5%'}
                    , {field: 'honour',title: '所获荣誉',width: '8%'}
                    , {field: 'honourTime',title: '获得荣誉时间',width: '11%'}
                    , {title: '操作',align:'center',width: '10%',templet: function (d) {
                    return "<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='edit'>编辑</a>"
                        +"<a class='layui-btn layui-btn-xs layui-btn-primary' lay-event='del'>删除</a>";
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
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
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
            tablePlay(res.list);
            //去除loding
            // parent.tools.stop();
        });

        //前端测试代码——仅限开发环境使用，正式时请去除
    }
    //监听工具条操作
    table.on('tool(dataTable)', function(obj){
        var id = obj.data.id;
        if(obj.event==='edit'){//操作—编辑
            window.location.href="/enterpriseUser/singleAdd?id=" + id;
        }else if(obj.event==='del'){//操作—删除
            layer.confirm('确定删除该信息？',{icon:3, title:'提示信息',move: false,resize: false}, function(index){
                // /enterpriseUser/del/{id}
                ajax.request("/enterpriseUser/del/" + id,"DELETE",{"id":id},function(res){
                    layer.msg("操作成功!");
                    pageFlag = true;
                    getCadreList();
                });
                layer.close(index);
            });
        }
    });
    $('.layui-btn[data-type]').on('click', function () {
        var type = $(this).data('type');
        if(type=='singleAdd'){//单个添加
            window.location.href="/enterpriseUser/singleAdd";
        }else if(type=='batchAdd'){//批量添加
            window.location.href="route?name=personal/batchAdd";
        }else if(type=='export'){//列表导出
            layer.msg('列表导出');
            window.location.href="/enterpriseUser/downLoadUsersExcel"
        }else if(type=='del'){//删除
            var checkStatus = table.checkStatus("enquiry")
                ,data = checkStatus.data; //获取选中项
            if(data.length==0){
                layer.msg("请选择要删除的人");
                return false;
            }
            var arr = [];
            for(var i = 0; i < data.length;i++){
                arr.push(data[i].id);
            }
            ajax.request("/enterpriseUser/delIds","POST",{"ids":arr},function(res){
                layer.msg("操作成功!");
                pageFlag = true;
                getCadreList();
            });
        }
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});