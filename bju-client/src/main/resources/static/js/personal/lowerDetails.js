layui.config({
    base : "../../js/"
}).use(['form','jquery','layer','tree','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,tree = layui.tree
        ,ajax = layui.ajax; //自定义请求数据

    var data1 = [
        {
            title: '全部'
            ,id: -1
            ,spread: true
            ,children: [
                // {
                //     title: '江西'
                //     ,id: 1
                //     ,spread: true
                //     ,children: [{title: '南昌',id: 1}, {title: '九江',id: 3}, {title: '赣州',id: 3}]
                // },
                // {
                //     title: '广西'
                //     ,id: 2
                //     ,spread: true
                //     ,children: [{title: '南宁',id: 1},{title: '桂林',id: 2}]
                // },
                // {
                //     title: '陕西'
                //     ,id: 3
                //     ,spread: true
                //     ,children: [{title: '西安',id: 1}, {title: '延安',id: 2}]
                // }
            ]
        }
    ];
    //下发详情或者下发设置
    var preId = $("[name=preId]").val();
    function toLowerDetail(){
        $.ajax({
            url:"/preLine/findOrToLowerDetail" ,
            type:"POST" ,
            data:{"preId":preId},
            success:function (res) {
                if(res.code == 200) {
                    document.getElementById("preLineName").innerHTML = res.data.preLine.title;
                    document.getElementById("describetion").innerHTML = res.data.preLine.describetion;
                    data1[0].children = res.data.areasTreeDtos;
                    var months = '';
                    for (var i = 0; i < res.data.preMonthAndNames.length; i++) {
                        months += '<div class="layui-form-mid">' + res.data.preMonthAndNames[i].name + '</div>'
                    }
                    var enterPrise = '';
                    for (var i = 0; i < res.data.enterPriseTreeDtos.length; i++) {
                        enterPrise += '<div class="layui-form-mid">' + res.data.enterPriseTreeDtos[i].title + '</div>'
                    }
                    $("#myMonths").html(months);
                    $("#myEnterPrise").html(enterPrise);
                    tree.render({
                        elem: '#region'
                        , data: data1
                        , showLine: false
                        , click: function (obj) {
                            //console.log(obj.data); //得到当前点击的节点数据
                            //console.log(obj.state); //得到当前节点的展开状态：open、close、normal
                            //console.log(obj.elem); //得到当前节点元素
                            //console.log(obj.data.children); //当前节点下是否有子节点
                            setTimeout(function () {
                                parent.tools.redefinition($(".childrenBody").height());
                            }, 200);
                        }
                    });
                }
            },
            dataType:"json"
        });
    }
    toLowerDetail();
    //疗养地区---树结构
    tree.render({
        elem: '#region'
        ,data: data1
        ,showLine: false
        ,click: function(obj){
            //console.log(obj.data); //得到当前点击的节点数据
            //console.log(obj.state); //得到当前节点的展开状态：open、close、normal
            //console.log(obj.elem); //得到当前节点元素
            //console.log(obj.data.children); //当前节点下是否有子节点
            setTimeout(function () {
                parent.tools.redefinition($(".childrenBody").height());
            },200);
        }
    });

    //点击修改
    $("#modify").click(function () {
        window.location.href="route?name=personal/lowerInstall&preId="+$("[name=preId]").val()+"&addOrUpdate=1";
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});