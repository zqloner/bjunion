layui.config({
    base : "../../js/"
}).use(['form','jquery','element','laytpl','pagination','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,element = layui.element
        ,laytpl = layui.laytpl
        ,pagination = layui.pagination//自定义分页
        ,ajax = layui.ajax //自定义请求数据
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/sysNews/list"
        // ,url1 = "https://www.easy-mock.com/mock/5d70cd69173be2677010f36b/sanatorium/newsBulletin1";

    var currentTime = sessionStorage.getItem("currentTime");
    var type = "";
    //监听导航点击
    element.on('nav(demo)', function(elem){
        pageFlag = true;
         type = $(this).data("id");
        getCadreList();
        // pageFlag = true;
        // console.log(elem);
        // console.log($(this).data("id"));
        // layer.msg(elem.text());
        // if($(this).data("id")==0){
        //     getCadreList('','',url);
        // }else if($(this).data("id")==1){
        //     getCadreList('','',url1);
        // }else if($(this).data("id")==2){
        //     getCadreList('','',url);
        // }
    });


    // 新闻公告
    function journalism(data) {
        var getTpl = newsBulletin.innerHTML
            ,view = document.getElementById('newsList');
        laytpl(getTpl).render(data, function(html){
            view.innerHTML = html;
        });
        //页面渲染完成后获取bady的高度赋值给iframe
        setTimeout(function () {
            parent.tools.redefinition($(".childrenBody").height());
        },200);
    }
    //分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data:res,num:res,elem:'page'},function (obj, first) {
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
        params.type = type=="" ? 5:type;
        ajax.request('/sysNews/list','GET',params,function(res){
            if(res.list.length!=0){
                for(var i=0;i<res.list.length;i++){
                    new Date(currentTime).getTime();
                    new Date(res.list[i].createTime).getTime();
                    if(new Date(currentTime).getTime()-new Date(res.list[i].createTime).getTime()>680400*1000){
                        res.list[i].isNew = false;
                    }else {
                        res.list[i].isNew = true;
                    }
                }
                laypageCurr(res);
                console.log(res.list);
                journalism(res.list);
            }
            //去除loding
            // parent.tools.stop();
        });
    }

    //到新闻公告详情页
    $("#newsList").on('click','.notice_li',function () {
        console.log($(this).data("id"));
        window.location.href="route?name=newsBulletin/newsDetails&newsId="+$(this).data("id");
    });
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});