/**
 * Created by zhuxq on 2019/9/12.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , projectile = layui.projectile; //自定义弹窗

    //统计不同类型的人数
    function getCountByUserType() {
        $.ajax({
            url:"/statistics/getCountByUserType" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                $("#laomoCount").html(res.data[2].num+"个");
                    $("#youxiuCount").html(res.data[1].num+"个");
                    $("#putongCount").html( res.data[0].num+"个");
                    // for(var i=0;i<res.data.length;i++){
                    //     var item ={};
                    //     item.value = res.data[i].num;
                    //     item.name = res.data[i].name;
                    //     numZX.push(item);
                    // }
                    // echartZX.successZX(numZX);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    getCountByUserType();

    //企业数量
    function getEnterprisesCount() {
        $.ajax({
            url:"/statistics/getEnterprisesCount" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    $("#enterpriseCount").html(res.data.num+"个");
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    getEnterprisesCount();

    // //服务疗养疗养职工总人数
    // function getAllUsersCount() {
    //     $.ajax({
    //         url:"/statistics/getAllUsersCount" ,
    //         type:"GET" ,
    //         success:function (res) {
    //             if(res.code==200){
    //                 $("#allUserCount").html(res.data+"个");
    //                 form.render();
    //             }else {
    //                 layer.alert(res.message);
    //             }
    //         } ,
    //         dataType:"json"
    //     });
    // }
    // getAllUsersCount();
    //
    //
    // //参与疗养总费用
    // function getAllCostCount() {
    //     $.ajax({
    //         url:"/statistics/getAllCostCount" ,
    //         type:"GET" ,
    //         success:function (res) {
    //             if(res.code==200){
    //                 $("#allCostCount").html(res.data.price+"元");
    //                 form.render();
    //             }else {
    //                 layer.alert(res.message);
    //             }
    //         } ,
    //         dataType:"json"
    //     });
    // }
    // getAllCostCount();

    // 加载数据
    function getCadreGroupList() {
        $.ajax({
            url: "/statistics/getCostInfoListNoPages",
            type: "GET",
            success: function (res) {
                if (res.code == "200") {
                    //总费用
                    var allPrice = 0;
                    //总人数
                    var allUser = res.data.list.length;
                    //普通职工
                    var putongCount = 0;
                    //优秀员工
                    var youxiuCount = 0;
                    //劳模员工
                    var laomoCount = 0;
                    //比例数组
                    var perCentArray = [];
                    var myData = res.data.list;
                    for(var i=0;i<myData.length;i++){
                        allPrice += parseInt(myData[i].allfy);
                        if(myData[i].userType==1){
                            putongCount += 1;
                        }else if(myData[i].userType==2){
                            youxiuCount += 1;
                        }else if(myData[i].userType==3){
                            laomoCount += 1;
                        }
                    }
                    var param = {value:laomoCount,name:'劳模职工'};
                    var param1 = {value:putongCount,name:'普通职工'};
                    var param2 = {value:youxiuCount,name:'优秀职工'};
                    perCentArray.push(param);
                    perCentArray.push(param1);
                    perCentArray.push(param2);
                    //总人数
                    $("#allUserCount").html(allUser+"个");
                    //总费用
                    $("#allCostCount").html(allPrice+"元");
                    //饼状图数据渲染
                    echartZX.successZX(perCentArray);

                   form.render();
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }

    // 初始化加载
    getCadreGroupList();
    // 服务群体所占比例
    var numZX = [
        // {value: '20', name: '劳模职工'},
        // {value: '30', name: '优秀职工'},
        // {value: '50', name: '普通职工'}
    ];
    var echartZX =  {
        successZX: function (data) {
            var myChart = echarts.init(document.getElementById('fwqtszbl'));
            var num = data.length, Arr = [];
            for (var i = 0; i < num; i++) {
                Arr.push(data[i].name);
            }
            var option = {
                title: {
                    text: '服务群体所占比例',
                    //y: 'bottom',
                    x:'center',
                    textStyle:{
                        fontSize:'14',
                        fontWeight:'100',
                        color:'#333333'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}% "
                },
                legend: {//配置legend，这里的data，要对应type为‘bar’的series数据项的‘name’名称，作为图例的说明
                    data: ['劳模职工', '优秀职工', '普通职工'],
                    orient: 'vertical',
                    icon:'circle',
                    x:'right',
                    itemWidth:10, // 设置宽度
                    itemGap: 26, // 设置间距
                    top: 120
                },
                series: [
                    {
                        name: '服务群体所占比例',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        detail: {formatter: '{value}'},
                        minAngle: 5,
                        avoidLabelOverlap: true,   //是否启用防止标签重叠策略
                        data: data,//获取数据
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                label:{
                                    show:false
                                },
                                color:function(params){
                                    // 自定义颜色
                                    var colorList=[
                                        '#f47d7d','#67b0f4','#81da56'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };
    echartZX.successZX(numZX);

    //  疗养院接待量排名 TOP10
    function getAllSanatoriumCount() {
        $.ajax({
            url:"/statistics/getAllSanatoriumCount" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    var myList = res.data.list;
                    var numLd = [
                    ];
                    if(myList !=null && myList.length>0){
                        for(var i=0;i<myList.length;i++){
                            var item = {};
                            item.value = myList[i].usersCount;
                            item.name = myList[i].sname;
                            numLd.push(item);
                        }
                    }
                    echartTOP.successTOP(numLd);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    getAllSanatoriumCount();

    //
    // var numTOP = [
    //     {value: '500', name: '北京市龙脉温泉度假村'},
    //     {value: '450', name: '北京市龙脉温泉度假村'},
    //     {value: '400', name: '北京市龙脉温泉度假村'},
    //     {value: '350', name: '北京市龙脉温泉度假村'},
    //     {value: '300', name: '北京市龙脉温泉度假村'},
    //     {value: '250', name: '北京市龙脉温泉度假村'},
    //     {value: '200', name: '北京市龙脉温泉度假村'},
    //     {value: '150', name: '北京市龙脉温泉度假村'},
    //     {value: '100', name: '北京市龙脉温泉度假村'},
    //     {value: '50', name: '北京市龙脉温泉度假村'}
    // ];
    var echartTOP = {
        successTOP: function (data) {
            var myChart = echarts.init(document.getElementById('lyyjdl'));
            var num = data.length, Arr = [];
            for (var i = 0; i < num; i++) {
                Arr.push(data[i].name);
            }
            var option = {
                title: {
                    text: '疗养院接待量排名 TOP10',
                    x: 'center',
                    textStyle:{
                        fontSize:'14',
                        fontWeight:'100',
                        color:'#333333'
                    }
                },
                //legend: {//配置legend，这里的data，要对应type为‘bar’的series数据项的‘name’名称，作为图例的说明
                //    data: [],
                //    orient: 'horizontal',
                //    top: 30,
                //},
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b} : {c} ",
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        data : Arr,
                        axisTick: {
                            alignWithLabel: true
                        },
                        nameTextStyle: {   // 坐标轴名称样式
                            color: '#666666'
                        },
                        axisLabel: {
                            interval:0,
                            rotate:"20"  // 设置轴标签旋转角度
                        }
                    }
                ],
                yAxis : [
                    {
                        show:true,
                        name:'接待人数（个）',
                        type : 'value',
                        nameTextStyle: {    // 坐标轴名称样式
                            color: '#666666',
                            padding: [0, 0, 10, 17]  // 坐标轴名称相对位置
                        },
                        axisLine: {    // 坐标轴 轴线
                            show: false  // 是否显示
                        },
                        axisLabel : {
                            formatter: '{value}',
                            textStyle: { //改变刻度字体样式
                                color: '#666666'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '疗养院接待量排名 TOP10',
                        type: 'bar',
                        barWidth: 24, // 柱图宽度
                        detail: {formatter: '{value}'},
                        data: data,//获取数据
                        itemStyle:{
                            normal:{
                                label:{
                                    show:true,
                                    position:'top',
                                    color:'rgba(0,0,0,0.35)'
                                },
                                color:'#5c89ff'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };

    // 使用各类交通工具人数  和成本
    // 加载数据
    function getCadreTrafficList() {
        $.ajax({
            url: "/statistics/getTrafficInfoListNoPage",
            type: "GET",
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    debugger;
                    var myList = res.data;
                    var numLd = [];
                    var numLd1 = [];
                    if(myList !=null && myList.length>0){
                        for(var i=0;i<myList.length;i++){
                            var item = {};
                            var item1 = {};
                            item.value = myList[i].usersCount;
                            item1.value = myList[i].price;
                            if(myList[i].type==1){
                                item.name = "火车";
                                item1.name = "火车";
                            }
                            if(myList[i].type==2){
                                item.name = "飞机";
                                item1.name = "飞机";
                            }
                            if(myList[i].type==3){
                                item.name = "大巴";
                                item1.name = "大巴";
                            }
                            numLd.push(item);
                            numLd1.push(item1);
                        }
                    }
                    echartSum.successSum(numLd);
                    echartFee.successFee(numLd1);
                    form.render();
                }else {
            layer.alert(res.message);
                }
            }
        });
    }
    // 初始化加载
    getCadreTrafficList();

    // function getTraffic() {
    //     $.ajax({
    //         url:"/statistics/getTraffic" ,
    //         type:"GET" ,
    //         success:function (res) {
    //             if(res.code==200){
    //                 var myList = res.data;
    //                 var numLd = [];
    //                 var numLd1 = [];
    //                 if(myList !=null && myList.length>0){
    //                     for(var i=0;i<myList.length;i++){
    //                         var item = {};
    //                         var item1 = {};
    //                         item.value = myList[i].num;
    //                         item1.value = myList[i].price;
    //                         if(myList[i].type==1){
    //                             item.name = "火车";
    //                             item1.name = "火车";
    //                         }
    //                         if(myList[i].type==2){
    //                             item.name = "飞机";
    //                             item1.name = "飞机";
    //                         }
    //                         if(myList[i].type==3){
    //                             item.name = "大巴";
    //                             item1.name = "大巴";
    //                         }
    //                         numLd.push(item);
    //                         numLd1.push(item1);
    //                     }
    //                 }
    //                 echartSum.successSum(numLd);
    //                 echartFee.successFee(numLd1);
    //                 form.render();
    //             }else {
    //                 layer.alert(res.message);
    //             }
    //         } ,
    //         dataType:"json"
    //     });
    // }
    // getTraffic();
    var numSum = [
        {value: '20', name: '火车'},
        {value: '30', name: '飞机'},
        {value: '50', name: '大巴'}
    ];
    var echartSum =  {
        successSum: function (data) {
            var myChart = echarts.init(document.getElementById('sygljtgjrs'));
            var num = data.length, Arr = [];
            for (var i = 0; i < num; i++) {
                Arr.push(data[i].name);
            }
            var option = {
                title: {
                    text: '使用各类交通工具人数',
                    //y: 'bottom',
                    x:'center',
                    textStyle:{
                        fontSize:'14',
                        fontWeight:'100',
                        color:'#333333'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} "
                },
                legend: {//配置legend，这里的data，要对应type为‘bar’的series数据项的‘name’名称，作为图例的说明
                    data: ['火车', '飞机', '大巴'],
                    orient: 'vertical',
                    icon:'circle',
                    x:'right',
                    itemWidth:10, // 设置宽度
                    itemGap: 26, // 设置间距
                    top: 120
                },
                series: [
                    {
                        name: '使用各类交通工具人数',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        detail: {formatter: '{value}'},
                        minAngle: 5,
                        avoidLabelOverlap: true,   //是否启用防止标签重叠策略
                        data: data,//获取数据
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                label:{
                                    show:false
                                },
                                color:function(params){
                                    // 自定义颜色
                                    var colorList=[
                                        '#5c89ff','#7c6af2','#c95ff2'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };

    // 使用各类交通工具的总成本
    var numFee = [
        {value: '20', name: '火车'},
        {value: '30', name: '飞机'},
        {value: '50', name: '巴士'}
    ];
    var echartFee =  {
        successFee: function (data) {
            var myChart = echarts.init(document.getElementById('sygljtgjzcb'));
            var num = data.length, Arr = [];
            for (var i = 0; i < num; i++) {
                Arr.push(data[i].name);
            }
            console.log(Arr);
            var option = {
                color:['#5c89ff','#7c6af2','#c95ff2'],
                title: {
                    text: '使用各类交通工具费用',
                    //y: 'bottom',
                    x:'center',
                    textStyle:{
                        fontSize:'14',
                        fontWeight:'100',
                        color:'#333333'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} "
                },
                legend: {//配置legend，这里的data，要对应type为‘bar’的series数据项的‘name’名称，作为图例的说明
                    data: ['火车', '飞机', '大巴'],
                    orient: 'vertical',
                    icon:'circle',
                    x:'right',
                    itemWidth:10, // 设置宽度
                    itemGap: 26, // 设置间距
                    top: 120
                },
                series: [
                    {
                        name: '使用各类交通工具费用',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        detail: {formatter: '{value}'},
                        minAngle: 5,
                        avoidLabelOverlap: true,   //是否启用防止标签重叠策略
                        data: data,//获取数据
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                label:{
                                    show:false
                                },
                                /*color:function(params){
                                    // 自定义颜色
                                    var colorList=[
                                        '#5c89ff','#7c6af2','#c95ff2'
                                    ];
                                    return colorList[params.dataIndex]
                                }*/
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };

    //  领队接待能力排名 TOP10
    function getLeaderList() {
        $.ajax({
            url:"/statistics/getLeaderList" ,
            type:"GET" ,
            success:function (res) {
                if(res.code==200){
                    var myList = res.data.list;
                    var numLd = [
                        // {value: '500', name: '肖战'},
                        // {value: '450', name: '翟潇闻'},
                        // {value: '400', name: '朴灿烈'},
                        // {value: '350', name: '边伯贤'},
                        // {value: '300', name: '王一博'},
                        // {value: '250', name: '魏无羡'},
                        // {value: '200', name: '蓝忘机'},
                        // {value: '150', name: '温宁'},
                        // {value: '100', name: '都暻秀'},
                        // {value: '50', name: '吴世勋'}
                    ];
                    if(myList !=null && myList.length>0){
                        for(var i=0;i<myList.length;i++){
                            var item = {};
                            item.value = myList[i].userCount;
                            item.name = myList[i].name;
                            numLd.push(item);
                        }
                    }
                    echartLd.successLd(numLd);
                    form.render();
                }else {
                    layer.alert(res.message);
                }
            } ,
            dataType:"json"
        });
    }
    getLeaderList();

    var echartLd = {
        successLd: function (data) {
            var myChart = echarts.init(document.getElementById('ldjdnl'));
            var num = data.length, Arr = [];
            for (var i = 0; i < num; i++) {
                Arr.push(data[i].name);
            }
            var option = {
                title: {
                    text: '领队接待能力排名 TOP10',
                    x: 'center',
                    textStyle:{
                        fontSize:'14',
                        fontWeight:'100',
                        color:'#333333'
                    }
                },
                //legend: {//配置legend，这里的data，要对应type为‘bar’的series数据项的‘name’名称，作为图例的说明
                //    data: [],
                //    orient: 'horizontal',
                //    top: 30,
                //},
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b} : {c} ",
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        data : Arr,
                        axisTick: {
                            alignWithLabel: true
                        },
                        nameTextStyle: {   // 坐标轴名称样式
                            color: '#666666'
                        },
                        axisLabel: {
                            interval:0
                            //rotate:"20"  // 设置轴标签旋转角度
                        }
                    }
                ],
                yAxis : [
                    {
                        show:true,
                        type : 'value',
                        nameTextStyle: {    // 坐标轴名称样式
                            color: '#666666',
                            padding: [0, 0, 10, 17]  // 坐标轴名称相对位置
                        },
                        axisLine: {    // 坐标轴 轴线
                            show: false  // 是否显示
                        },
                        axisLabel : {
                            formatter: '{value}',
                            textStyle: { //改变刻度字体样式
                                color: '#666666'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '领队接待能力排名 TOP10',
                        type: 'bar',
                        barWidth: 24, // 柱图宽度
                        detail: {formatter: '{value}'},
                        data: data,//获取数据
                        itemStyle:{
                            normal:{
                                label:{
                                    show:true,
                                    position:'top',
                                    color:'rgba(0,0,0,0.35)'
                                },
                                color:'#5c89ff'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };
});