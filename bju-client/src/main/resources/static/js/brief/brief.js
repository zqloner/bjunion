layui.config({
    base : "../../js/"
}).use(['form','jquery','element','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,element = layui.element
        ,ajax = layui.ajax //自定义请求数据
        ,result = []
        ,url = "/sanatoriumBrief/list";
         //,url = "https://www.easy-mock.com/mock/5d70cd69173be2677010f36b/sanatorium/brief";


    var searchObj = new Object();

    //监听导航点击
    element.on('nav(demo)', function(elem){
        // searchObj.id = $(this).data("id");
        // journalism(result[$(this).data("id")]);
        getCadreList($(this).data("id"));
    });


    // 渲染页面
    function journalism(data) {


        $("#briefContent").html(data.content);
        //页面渲染完成后获取bady的高度赋值给iframe
        setTimeout(function () {
            $(".layui-nav").height($("#briefContent").height()+20);
            parent.tools.redefinition($(".childrenBody").height());
        },100);
    }

    //加载数据
    getCadreList();
    function getCadreList(myId){
        //数据加载中loading
        // parent.tools.load();
        // console.log("url:"+url)
        // ajax.request(url,'GET','',function(res){
        //     if(res.length!=0){
        //         debugger;
        //         result = res;
        //         journalism(res[0]);
        //     }
        //     //删除loding
        //     parent.tools.stop();
        // });
        // searchObj.id == undefined ? "1": searchObj.id;
        // console.log(searchObj.id);
        var params = new Object();
        params.id = myId == undefined ? "1":myId;
        $.ajax({
            url:"/sanatoriumBrief/getById",
            type:"GET" ,
            data:params,
            success:function (res) {
                if(res.code==200){
                    journalism(res.data)
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });

    }
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});