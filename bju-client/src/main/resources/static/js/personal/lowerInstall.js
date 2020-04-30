layui.config({
    base : "../../js/"
}).use(['form','jquery','layer','tree','transfer','hour','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,tree = layui.tree
        ,transfer = layui.transfer
        ,hour = layui.hour//自定义时间选择
        ,ajax = layui.ajax; //自定义请求数据

    var myTime ={};
    form.verify({
        pass: [
            // /^[\u4e00-\u9fffa-zA-Z]{1,25}$/
            /^.{1,25}$/
            , '标题不能为控且不可超过25个字'
        ],
        desc:[
            // /^[\u4e00-\u9fffa-zA-Z]{1,500}$/
            /^.{0,500}$/
            , '说明不可超过500个字'
        ],
        months:function (value) {
            var checkLenth = $("[name='month']:checked");
            if(checkLenth.length<=0){
                return "请选择月份";
            }
        },
        areas:function (value) {
            var are = tree.getChecked('district');
            if(are.length<=0){
                return "请选择疗养地区";
            }
        },
        enterPrise:function (value) {
            var ent = transfer.getData('authority');
            if(ent.length<=0){
                return "请选择企业查看权限";
            }
        },
        comparetime:function () {
            var start = $("[name=time_min]").val();
            var end = $("[name=time_max]").val();
            if(start>=end){
                return "开放报名时间必须小于报名结束时间";
            }
        },
        begintime:function (value) {
            var start = myTime.begintime;
            if(value<start){
                return "下发开始时间必须大于"+start;
            }
        },
        endtime:function (value) {
            var end = myTime.endtime;
            if(value>end){
                return "下发结束时间必须小于"+end;
            }
        }
    });

    var checkAreaEnterprise = {};

    //模拟数据
    var data = [
        // {"value": "1", "title": "企业名称"}
        // ,{"value": "2", "title": "企业名称"}
        // ,{"value": "3", "title": "企业名称"}
        // ,{"value": "4", "title": "企业名称"}
        // ,{"value": "5", "title": "企业名称"}
        // ,{"value": "6", "title": "企业名称"}
        // ,{"value": "7", "title": "企业名称"}
        // ,{"value": "8", "title": "企业名称"}
        // ,{"value": "9", "title": "企业名称"}
    ];
    var data1 = [
        {
            title: '全部'
            ,id: 1
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
    var preId = $("#preId").val();
    function getDataList(){
        $.ajax({
            url:"/preLine/findOrToLowerInstall" ,
            type:"POST" ,
            data:{"preId":preId},
            success:function (res) {
                myTime.begintime = res.data.preLine.beginTime;
                myTime.endtime = res.data.preLine.endTime;
                document.getElementById("preLineName").innerHTML = res.data.preLine.title;
                document.getElementById("describetion").innerHTML = res.data.preLine.describetion;
                data1[0].children = res.data.areasTreeDtos;
                for(var i=0;i<res.data.enterPriseTreeDtos.length;i++){
                    var param ={};
                    param.value = res.data.enterPriseTreeDtos[i].id;
                    param.title = res.data.enterPriseTreeDtos[i].title;
                    data.push(param);
                }
                var month = '';
                for(var i=0;i<res.data.preMonthAndNames.length;i++){
                    month +=  '<input type="checkbox" name="month" value="'+res.data.preMonthAndNames[i].id+'" lay-skin="primary" title="'+res.data.preMonthAndNames[i].name+'">'
                }
                $("#myMonths").html(month);
                form.render();
                //疗养地区---树结构
                tree.render({
                    elem: '#region'
                    ,data: data1
                    ,id: 'district'
                    ,showLine: false  //是否开启连接线
                    ,showCheckbox: true  //是否显示复选框
                    ,click: function(obj){
                        setTimeout(function () {
                            parent.tools.redefinition($(".childrenBody").height());
                        },200);
                    }
                });
                //企业查看权限---穿梭框
                transfer.render({
                    elem: '#power'
                    ,data: data
                    ,id: 'authority'
                    ,title: ['企业列表', '企业列表']
                    ,value: ["1", "3"] //初始右侧数据
                    ,width: 182
                    ,height: 240
                    ,onchange: function(obj, index){
                        var arr = ['左边', '右边'];
                    }
                });
            },
            dataType:"json"
        });
    }
    getDataList();


    //点击确定---监听submit提交
    form.on("submit(addNews)",function(data){
        $("[name=sureButton]").attr("disabled","disabled");
        var months = [];
        $("[name=month]:checked").each(function () {
            months.push($(this).val());
        });
        console.log(months);
        var areas = [];
        var checkedData = tree.getChecked('district'); //获取疗养地区选中节点的数据
            if(checkedData!=undefined && checkedData.length>0){
                if(checkedData[0].children != null && checkedData[0].children.length>0) {
                    for (var i = 0; i < checkedData[0].children.length; i++) {
                        areas.push(checkedData[0].children[i].id)
                        if (checkedData[0].children[i].children != null && checkedData[0].children[i].children.length > 0) {
                            for (var j = 0; j < checkedData[0].children[i].children.length; j++) {
                                areas.push(checkedData[0].children[i].children[j].id);
                            }
                        }
                    }
                }
        }
        console.log(areas);
        var enterPrises = [];
        var getData = transfer.getData('authority'); //获取企业查看权限右侧数据
        if(getData != undefined && getData.length>0){
            for(var i = 0; i<getData.length;i++){
                enterPrises.push(getData[i].value)
                if(getData[i].children != null && getData[i].children.length>0){
                    for(var j=0;j<getData[i].children.length;i++){
                        enterPrises.push(getData[i].children[i].value)
                    }
                }
            }
        }
        console.log(enterPrises);
        var setData = {
            data:data.field,
            checkedData:checkedData,
            getData:getData
        };
        console.log(setData);
        var title = $("#preLineName").text();
        var describetion = $("#describetion").text();
        if($("#addOrUpdate").val() == 1){  //修改
            $.ajax({
                url:"/preLine/doUpdateLower" ,
                type:"POST" ,
                data:{"id":preId,"startTime":data.field.time_min ,
                    "userType":$("#userType").val(),
                    "title":$("#preLineName").text(),
                    "describetion":$("#describetion").text(),
                    "overTime":data.field.time_max,"months":months,
                    "areas":areas,"enterPrises":enterPrises},
                success:function (data) {
                    if (data.code == 200) {
                        window.location.href="route?name=personal/lineLower";
                    }else {
                        $("[name=sureButton]").removeAttr("disabled");
                    }
                },
                dataType:"json"//设置接受到的响应数据的格式
            });
        }else {
            $.ajax({
                url:"/preLine/addLowerPreLine" ,
                type:"POST" ,
                data:{"id":preId,"startTime":data.field.time_min ,
                    "userType":$("#userType").val(),
                    "title":$("#preLineName").text(),
                    "describetion":$("#describetion").text(),
                    "overTime":data.field.time_max,"months":months,
                    "areas":areas,"enterPrises":enterPrises},
                success:function (data) {
                    window.location.href="route?name=personal/lineLower";
                },
                dataType:"json"//设置接受到的响应数据的格式
            });
        }
        //
        //
        //
        //
        // layer.msg('提交成功！！！');
        // window.location.href="route?name=personal/lineLower";

        //console.log(data.elem); //被执行事件的元素DOM对象，一般为button对象
        //console.log(data.form); //被执行提交的form对象，一般在存在form标签时才会返回
        //console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
        return false; //阻止表单跳转
    });

    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);


});