//准备视图对象
window.viewObj = {
    tbData: [
        // {
    //     tempId: new Date().valueOf(),
    //     place: '2',
    //     month: '',
    //     number: 0
    // }
    ],
    typeData: [
        // {id: 1, name: '分类一'},
        // {id: 2, name: '分类二'},
        // {id: 3, name: '分类三'},
        // {id: 4, name: '分类四'}
    ],
    monthData:[
        // {id: 1, name: '一月'}, {id: 2, name: '二月'}, {id: 3, name: '三月'}, {id: 4, name: '四月'}, {id: 5, name: '五月'}, {id: 6, name: '六月'},
        // {id: 7, name: '七月'}, {id: 8, name: '八月'}, {id: 9, name: '九月'}, {id: 10, name: '十月'}, {id: 3, name: '十一月'}, {id: 4, name: '十二月'}
    ],
    renderSelectOptions: function(data, settings){
        settings =  settings || {};
        var valueField = settings.valueField || 'value',
            textField = settings.textField || 'text',
            selectedValue = settings.selectedValue || "";
        var html = [];
        for(var i=0, item; i < data.length; i++){
            item = data[i];
            html.push('<option value="');
            html.push(item[valueField]);
            html.push('"');
            if(selectedValue && item[valueField] == selectedValue ){
                html.push(' selected="selected"');
            }
            html.push('>');
            html.push(item[textField]);
            html.push('</option>');
        }
        return html.join('');
    }
};
layui.config({
    base : "../../js/"
}).use(['form','jquery','layer','laytpl','table','ajax'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,layer = layui.layer
        ,laytpl = layui.laytpl
        ,table = layui.table
        ,ajax = layui.ajax //自定义请求数据
        ,tableIns
        ,url = "https://www.easy-mock.com/mock/5d70cd69173be2677010f36b/sanatorium/route";
    //数据表格实例化
   /*var tableIns = table.render(
       {
        elem: '#dataTable',
        id: layTableId,
        data: viewObj.tbData,
        loading: true,
        skin: 'line',
        even: false, //不开启隔行背景
        cols: [[
            {type:'checkbox'},
            {title: '序号', type: 'numbers'},
            {field: 'place', title: '选择报名地点', templet: function(d){
                    var options = viewObj.renderSelectOptions(viewObj.typeData, {valueField: "id", textField: "name", selectedValue: d.place});
                    return '<a lay-event="place"></a><select name="place" lay-filter="place"><option value="">选择报名地点</option>' + options + '</select>';
                }},
            {field: 'month', title: '选择报名月份', templet: function(d){
                    var options1 = viewObj.renderSelectOptions(viewObj.monthData, {valueField: "id", textField: "name", selectedValue: d.month});
                    return '<a lay-event="month"></a><select name="month" lay-filter="month"><option value="">选择报名月份</option>' + options1 + '</select>';
                }},
            {field: 'number', title: '人数', edit: 'text',width:'20%'}
        ]],
        done: function(res, curr, count){
            viewObj.tbData = res.data;
            setTimeout(function () {
                parent.tools.redefinition($(".childrenBody").height());
            },200);
        }
    }
    );*/

   //加载数据
    var layTableId = "layTable";
    var preId = $("#preId").val();
    var userType = $("#userType").val();
    console.log(preId);
    function getAreaMonthArea(){
        userType == undefined ? 3:userType;
        $.ajax({
            url:"/preRegistration/findAreaEnterpriseMonth" ,
            type:"GET" ,
            data:{"preId":preId,"userType":userType},
            success:function (res) {
                console.log(res);
                viewObj.typeData = res.data.preAreaAndNames;
                viewObj.monthData = res.data.preMonthAndNames;
                var preRegistrationStatisticsDtos = res.data.preRegistrationStatisticsDtos;
                document.getElementById("myDescribetion").innerHTML = res.data.describetion;
                console.log(res.data.title);
                document.getElementById("myPreLineName").innerHTML = res.data.title;
                for(var i=0;i<preRegistrationStatisticsDtos.length;i++){
                    var param = {};
                    param.tempId = preRegistrationStatisticsDtos[i].preStaticId;
                    param.place = preRegistrationStatisticsDtos[i].areaId;
                    param.month = preRegistrationStatisticsDtos[i].monthId;
                    param.number = preRegistrationStatisticsDtos[i].personCount;
                    viewObj.tbData.push(param);
                }
                tableIns =  table.render({
                    elem: '#dataTable',
                    id: layTableId,
                    data: viewObj.tbData,
                    loading: true,
                    skin: 'line',
                    even: false, //不开启隔行背景
                    cols: [[
                        {type:'checkbox'},
                        {title: '序号', type: 'numbers'},
                        {field: 'place', title: '选择报名地点', templet: function(d){
                                var options = viewObj.renderSelectOptions(viewObj.typeData, {valueField: "id", textField: "name", selectedValue: d.place});
                                return '<a lay-event="place"></a><select name="place" lay-filter="place" lay-search><option value="">选择报名地点</option>' + options + '</select>';
                            }},
                        {field: 'month', title: '选择报名月份', templet: function(d){
                                var options1 = viewObj.renderSelectOptions(viewObj.monthData, {valueField: "id", textField: "name", selectedValue: d.month});
                                return '<a lay-event="month"></a><select name="month" lay-filter="month"><option value="">选择报名月份</option>' + options1 + '</select>';
                            }},
                        {field: 'number', title: '人数', edit: 'text',width:'20%'}
                    ]],
                    done: function(res, curr, count){
                        viewObj.tbData = res.data;
                        setTimeout(function () {
                            parent.tools.redefinition($(".childrenBody").height());
                        },200);
                    }
                });
            },
            dataType:"json"
        });
    }
    getAreaMonthArea();
    //定义事件集合
    var active = {
        addRow: function(){	//添加一行
            var oldData = table.cache[layTableId];
            console.log(oldData);
            var newRow = {tempId: new Date().valueOf(), place: '', month: '', number: 0};
            oldData.push(newRow);
            tableIns.reload({
                data : oldData
            });
        },
        updateRow: function(obj){
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            for(var i=0, row; i < oldData.length; i++){
                row = oldData[i];
                if(row.tempId == obj.tempId){
                    $.extend(oldData[i], obj);
                    return;
                }
            }
            tableIns.reload({
                data : oldData
            });
        },
        del: function(){
            var checkStatus = table.checkStatus(layTableId)
                ,data = checkStatus.data; //获取选中项
            var oldData = table.cache[layTableId];
            if(data.length==0){
                layer.msg("请选择要删除的列");
                return false;
            }
            for (var i=0; i<oldData.length; i++) {
                for (var j=0; j<data.length; j++) {
                    if (oldData[i].tempId == data[j].tempId) {
                        oldData.splice(i, 1);    //删除一项
                    }
                }
            }
            tableIns.reload({
                data : oldData
            });
        },
        save: function(){
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            for(var i=0, row; i < oldData.length; i++){
                row = oldData[i];
                if(row.place==''){
                    layer.msg("检查每一行，请选择报名地点！", { icon: 5 }); //提示
                    return;
                }
                if(row.month==''){
                    layer.msg("检查每一行，请选择报名月份！", { icon: 5 }); //提示
                    return;
                }
                if(row.number<0){
                    layer.msg("检查每一行，人数不能为负数！", { icon: 5 }); //提示
                    return;
                }
            }
            //报名修改    张奇
            var preLineStatistics = [];
            for(var i=0;i<oldData.length;i++){
                var preLineStatistic ={};
                preLineStatistic.userType = userType;
                preLineStatistic.preId = preId;
                preLineStatistic.personCount = oldData[i].number;
                preLineStatistic.month = oldData[i].month;
                preLineStatistic.cityId = oldData[i].place;
                preLineStatistics.push(preLineStatistic);
            }
            console.log(JSON.stringify(preLineStatistics));
            console.log({"preLineStatistics":JSON.stringify(preLineStatistics)});
            $.ajax({
                url:"/preRegistration/updateRegistration" ,
                type:"POST" ,
                data:JSON.stringify(preLineStatistics),
                contentType : 'application/json;charset=utf-8', //设置请求头信息
                success:function (res) {
                    layer.msg(res.message);
                    // window.location.href="route?name=personal/preEntryRecord"
                    window.location.href="route?name=signUp/preSeeDetails&preId=" + $("#preId").val() + "&userType=" + $("#userType").val() + "&myBtn=" + 0
                }
            });
        }
    };

    //激活事件
    var activeByType = function (type, arg) {
        if(arguments.length === 2){
            active[type] ? active[type].call(this, arg) : '';
        }else{
            active[type] ? active[type].call(this) : '';
        }
    };

    //注册按钮事件
    $('.layui-btn[data-type]').on('click', function () {
        var type = $(this).data('type');
        activeByType(type);
    });

    //监听select下拉选中事件
    form.on('select(place)', function(data){
        var elem = data.elem; //得到select原始DOM对象
        $(elem).prev("a[lay-event='place']").trigger("click");
    });
    form.on('select(month)', function(data){
        var elem = data.elem; //得到select原始DOM对象
        $(elem).prev("a[lay-event='month']").trigger("click");
    });
    //监听工具条
    table.on('tool(dataTable)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        // console.log(data);
        switch(event){
            case "place":
                var place = tr.find("select[name='place']");
                if(place){
                    var selectedVal = place.val();
                    if(!selectedVal){
                        layer.tips("请选择地点", place.next('.layui-form-select'), { tips: [3, '#FF5722'] }); //吸附提示
                    }
                    $.extend(obj.data, {'place': selectedVal});
                    activeByType('updateRow', obj.data);	//更新行记录对象
                }
                break;
            case "month":
                var month = tr.find("select[name='month']");
                if(month){
                    var selectedVal = month.val();
                    if(!selectedVal){
                        layer.tips("请选择月份", month.next('.layui-form-select'), { tips: [3, '#FF5722'] }); //吸附提示
                    }
                    $.extend(obj.data, {'month': selectedVal});
                    activeByType('updateRow', obj.data);	//更新行记录对象
                }
                break;
        }
    });


    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});