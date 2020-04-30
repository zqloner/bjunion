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
        ,pListUrl = "/sysArea/pList"
        ,cListUrl = "/sysArea/cList"
        ,url = "/sanatoriumSanatorium/lsit";
        // ,url = "https://www.easy-mock.com/mock/5d70cd69173be2677010f36b/sanatorium/base";
    //获取省份
    getPList();

    //省份
    var provinceLi = [{regionName:'不限',id:""}];
    //城市
    var cityLi = [];
    function getPList() {
        ajax.request(pListUrl,'GET',"",function(res){
            if(res.length!=0){
                provinceLi = provinceLi.concat(res);
                //渲染省份
                var getProvince = province.innerHTML
                    ,provinceList = document.getElementById('provinceList');
                laytpl(getProvince).render(provinceLi, function(html){
                    provinceList.innerHTML = html;
                });
            }
        });
    }


    //渲染城市
    cityLiFun(7460);
    function cityLiFun(data) {
        var params = {};
        params.pid= data;
        ajax.request(cListUrl,'GET',params,function(res){
            if(res.length!=0){
                cityLi = [{regionName:'不限',id:""}];
                cityLi = cityLi.concat(res);
                var getCity= city.innerHTML
                    ,cityList = document.getElementById('cityList');
                laytpl(getCity).render(cityLi, function(html){
                    cityList.innerHTML = html;
                });
            }
        });
    }
    //点击省份
    $("#provinceList").on('click','.text',function () {
        clearSearchName();
        $(".provinceLi .text").removeClass("active");
        $(this).addClass('active');
        if($("#provinceList .active").attr("value") == "") return false;
        if($("#provinceList .active").attr("value") == 7460){
            cityLiFun($("#provinceList .active").attr("value"));
        }else{
            cityLiFun($("#provinceList .active").attr("value"));
        }
        searchBase($("#provinceList .active").attr("value"),"","");
    });
    //点击城市
    $("#cityList").on('click','.text',function () {
        clearSearchName();
        $(".cityLi .text").removeClass("active");
        $(this).addClass('active');
        console.log("c:"+$(this).data("id"));
        searchBase($("#provinceList .active").attr("value"),$(this).attr("value"),"");
    });

    //监听搜索
    form.on("submit(search)",function(data){
        searchBase("","",data.field.base);
        //重置显示到不限
        $(".cityLi .text").removeClass("active");
        $(".cityLi span:first").addClass('active');
        $(".provinceLi .text").removeClass("active");
        $(".provinceLi span:first").addClass('active');
        cityLi = [{regionName:'不限',id:""}];
        var getCity= city.innerHTML
            ,cityList = document.getElementById('cityList');
        laytpl(getCity).render(cityLi, function(html){
            cityList.innerHTML = html;
        });
        return false; //阻止表单跳转
    });
    function searchBase(pId,cId,name){
        var params = new Object();
        if (pId != undefined && pId != ""){
            params.pId = pId;
        }
        if (cId != undefined && cId != ""){
            params.cId = cId;
        }
        if(name != undefined && name != ""){
            params.name = name;
        }
        ajax.request(url,'GET',params,function(res){
            if(res.length!=0){
                laypageCurr(res,'page');
                journalism(res.list);
            }
            //删除loding
            // parent.tools.stop();
        });
    }

    // 疗休养点
    function journalism(data) {
        var getRoute = route.innerHTML
            ,routeView = document.getElementById('routeView');
        laytpl(getRoute).render(data, function(html){
            routeView.innerHTML = html;
        });
        //页面渲染完成后获取bady的高度赋值给iframe
        parent.tools.redefinition($(".childrenBody").height());
    }
    //分页渲染
    function laypageCurr(res,elem) {
        if (pageFlag) {
            pagination.paging({data:res,elem:elem,limits:[4,8,12,16,20]},function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                limitNumber = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
            $("#total").text(res.total);
        }
    }
    //加载数据
    getCadreList('','');
    function getCadreList(pageNumber,pageSize){
        //数据加载中loading
        // parent.tools.load();
        var params =new Object();
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        ajax.request(url,'GET',params,function(res){
            if(res.length!=0){
                laypageCurr(res,'page');
                journalism(res.list);
            }
            //删除loding
            // parent.tools.stop();
        });
    }
    //到休养基地详情页
    $("#routeView").on('click','.route_li',function () {
        console.log($(this).data("id"));
        window.location.href="route?name=/base/baseDetails&id="+$(this).data("id");
    })
    function clearSearchName(){
        $("input[name='base']").val("");
    }
});