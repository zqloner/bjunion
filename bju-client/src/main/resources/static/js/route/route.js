layui.config({
    base : "../../js/"
}).use(['form','jquery','laytpl','pagination','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,laytpl = layui.laytpl
        ,pagination = layui.pagination//自定义分页
        ,ajax = layui.ajax //自定义请求数据
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "";

    var searchObj = new Object();
      searchObj.userType = 3;

    //监听搜索
    form.on("submit(search)",function(data){
        getCadreList();
        // var upload = data.field;
        // //前端测试代码——仅限开发环境使用，正式时请去除
        // layer.alert(JSON.stringify(upload), {
        //     title: '最终的提交信息'
        // },function () {
        //     layer.closeAll(); //关闭所有层
        //     layer.msg('提交成功！！！');
        // });
        //console.log(data.elem); //被执行事件的元素DOM对象，一般为button对象
        //console.log(data.form); //被执行提交的form对象，一般在存在form标签时才会返回
        //console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
        return false; //阻止表单跳转
    });

    // 疗休养点
    function journalism(data) {
        var getBase = base.innerHTML
            ,baseView = document.getElementById('baseView');
        laytpl(getBase).render(data, function(html){
            baseView.innerHTML = html;
        });
        //页面渲染完成后获取bady的高度赋值给iframe
        parent.tools.redefinition($(".childrenBody").height());
    }
    //分页渲染
    function laypageCurr(res,elem) {
        if (pageFlag) {
            pagination.paging({data:res,elem:elem,limits:[6]},function (obj, first) {
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
    getCadreList();
    function getCadreList(pageNumber,pageSize){
        //数据加载中loading
        // parent.tools.load();
        var params =new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        params.name = $("[name=route]").val();
        $.ajax({
            url:"/lineLine/list" ,
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    laypageCurr(res.data,'page');
                    var getBase = base.innerHTML
                        ,baseView = document.getElementById('baseView');
                    laytpl(getBase).render(res.data.list, function(html){
                        baseView.innerHTML = html;
                    });
                    $("#count").html(res.data.total);
                    //页面渲染完成后获取bady的高度赋值给iframe
                    parent.tools.redefinition($(".childrenBody").height());
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
        return false;
    }
    //到疗养路线详情页
    $("#baseView").on('click','.base_li',function () {
        console.log($(this).data("id"));
        window.location.href="route?name=route/routeDetails&id="+$(this).data("id");
    })
});