//准备视图对象
window.viewObj = {
    tbData: [
        // {
        //     tempId: new Date().valueOf(),
        //     xuhao:'',
        //     place: '2',
        //     month: '',
        //     number: 0
        // }
    ],
    kindData: [
        {id: 0, name: '请选择'},
        {id: 1, name: '团体消费'},
        {id: 2, name: '个人消费'}
    ],
    costinfo: [
        {id: 0, name: '请选择'}
    ],
    perData:[
        {id: 0, name: '请选择'},
        {id: -1, name: '所有人'}
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
    base: "/leader/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour','fileUpload'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , hour = layui.hour //自定义时间选择器
        , fileUpload = layui.fileUpload //自定义时间选择器
        ,layTableId = "add"
        , pageFlag = true

        ,tableIns;
       // ,totalmoney = 0;
       // , url = "../../json/cost.json";
// 列表渲染
    function tablePlayAdd(data) {
        tableIns = table.render({
            id: "add",
            elem: "#addTable",
            toolbar: '#toolbarDemo',
            data: data,
            // 设置表头参数
            cols: [
                [
                    {type: 'checkbox', width: '10%'}
                    , {field: 'xuhao',title: '序号', edit: 'text', width: '10%', type: 'numbers'}
                    , {field: 'kind', title: '费用类型', width: '15%',  templet: function (d) {
                        var options = viewObj.renderSelectOptions(viewObj.kindData, {valueField: "id", textField: "name", selectedValue: d.kind});
                        return '<a lay-event="kind"></a><select name="kind"  lay-filter="kind">' + options + '</select>';
                    }
                }
                    , {field: 'detail', title: '费用明细', width: '15%', templet: function (d) {
                        var options2 = viewObj.renderSelectOptions(viewObj.costinfo, {valueField: "id", textField: "name", selectedValue: d.detail});
                        return '<a lay-event="detail"></a><select name="detail" lay-filter="detail">' + options2 + '</select>';
                    }
                }
                    , {field: 'name', title: '消费人', width: '15%', templet: function (d) {
                        var options1 = viewObj.renderSelectOptions(viewObj.perData, {valueField: "id", textField: "name", selectedValue: d.name});
                        return '<a lay-event="username"></a><select name="name" lay-filter="username">' + options1 + '</select>';
                    }
                }
                    , {field: 'num', title: '消费总额(元)', edit: 'text',width: '10%' }
                    , {field: 'ps', title: '备注',edit: 'text', width: '25%'}
                ]
            ],
            done: function(res, curr, count){
                //如果是异步请求数据方式，res即为你接口返回的信息。
                //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                //console.log(res);

                //得到当前页码
                //console.log(curr);

                //得到数据总量
                //console.log(count);
            }
        });
    }
    // 加载数据
    function getCadreListAdd() {
        //获取所有人员列表
        var formalid = $("#formalid").val();
        var params = new Object();
        params.formalid = formalid;
        $.ajax({
            url: "/formalLine/getFormalLineUserList",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (res) {
                var perlist = res.data.list;
                for(var i=0;i<perlist.length;i++){
                    var param = {};
                    param.id = perlist[i].user_id;
                    param.name = perlist[i].card_id+"-"+perlist[i].username;
                    viewObj.perData.push(param);
                }
                tablePlayAdd(viewObj.tbData);
                /*if (res.code == "200") {
                    tablePlayAdd(res.data.list); //列表渲染
                    //laypageCurrAdd(res.result); //分页渲染
                } else {
                    layer.msg(res.data.message);
                }*/
            }
        });
    }
function getCostInfos() {
    //获取费用明细
    $.ajax({
        url: "/sysDict/leaderCost",
        type: "GET",
        data: null,
        dataType: "json",
        success: function (res) {
            var perlist = res.data;
            for(var i=0;i<perlist.length;i++){
                var param = {};
                param.id = perlist[i].id;
                param.name = perlist[i].value;
                viewObj.costinfo.push(param);
            }
        }
    });
}
    //定义事件集合
    var active = {
        addRow: function(){	//添加一行
            var oldData = table.cache[layTableId];
            console.log(oldData);
            var newRow = {tempId: new Date().getTime(),xuhao: '', kind: '', detail:'', name: '', num: 0, ps: ""};
            oldData.push(newRow);
            tableIns.reload({
                data : oldData
            });
        },
        updateRow: function(obj){
            var oldData = table.cache[layTableId];
            for(var i=0, row; i < oldData.length; i++){
                row = oldData[i];
                if(row.tempId == obj.tempId){
                    $.extend(oldData[i], obj);
                    return;
                }
            }
            console.log(oldData);
            tableIns.reload({
                data : oldData
            });
        },
        delRow: function(){
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
            var Data2 = table.cache[layTableId];
            var totalmoney = 0;
            for (var j = 0; j < Data2.length; j++) {
                var theje = Data2[j].num;
                totalmoney = totalmoney + parseFloat(theje);
            }
            $("#totalmoney").html(totalmoney);
            tableIns.reload({
                data : oldData
            });
        }
    };
    //监听select下拉选中事件
    form.on('select(kind)', function(data){
        var elem = data.elem; //得到select原始DOM对象
        $(elem).prev("a[lay-event='kind']").trigger("click");
    });
    form.on('select(detail)', function(data){
        var elem = data.elem; //得到select原始DOM对象
        $(elem).prev("a[lay-event='detail']").trigger("click");
    });
    form.on('select(username)', function(data){
        var elem = data.elem; //得到select原始DOM对象
        $(elem).prev("a[lay-event='username']").trigger("click");
    });
    //监听顶部工具条
    table.on('toolbar(add)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        // console.log(data);
        switch(event){
            case "addRow":
                active.addRow();
                break;
            case "delRow":
                active.delRow();
                break;
        }

    });
    //监听表格中下拉
    table.on('tool(add)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        switch(event){
            case "kind":
                var kind = tr.find("select[name='kind']");
                if(kind){
                    var selectedVal = kind.val();
                    if(!selectedVal){
                        layer.tips("请选择", kind.next('.layui-form-select'), { tips: [3, '#FF5722'] }); //吸附提示
                    }
                    $.extend(obj.data, {'kind': selectedVal});
                    active.updateRow(obj.data);	//更新行记录对象
                }
                break;
            case "username":
                var username = tr.find("select[name='name']");
                if(username){
                    var selectedVal = username.val();
                    if(!selectedVal){
                        layer.tips("请选择", username.next('.layui-form-select'), { tips: [3, '#FF5722'] }); //吸附提示
                    }
                    $.extend(obj.data, {'name': selectedVal});
                    console.log(obj.data);
                    active.updateRow(obj.data);	//更新行记录对象
                }
                break;
            case "detail":
                var detail = tr.find("select[name='detail']");
                if(detail){
                    var selectedVal = detail.val();
                    if(!selectedVal){
                        layer.tips("请选择", detail.next('.layui-form-select'), { tips: [3, '#FF5722'] }); //吸附提示
                    }
                    $.extend(obj.data, {'detail': selectedVal});
                    console.log(obj.data);
                    active.updateRow(obj.data);	//更新行记录对象
                }
                break; //detail
        }
    });
    // 初始化加载
    getCostInfos();
    getCadreListAdd();

    table.on('edit(add)', function(obj){ //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        console.log(obj.value); //得到修改后的值
        console.log(obj.field); //当前编辑的字段名
        console.log(obj.data); //所在行的所有相关数据
        if (obj.field == 'num') {
            var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
            var xfje = obj.value;
            if(!reg.test(xfje)){
                alert("请重新消费金额！(小数位不超过2位的数字)");
            }else {
                var Data = table.cache["add"];
                var totalmoney = 0;
                for (var j = 0; j < Data.length; j++) {
                    var theje = Data[j].num;
                    if (theje==""){
                        theje = "0";
                    }
                    totalmoney = totalmoney + parseFloat(theje);
                }
                $("#totalmoney").html(totalmoney);
            }

        }
    });

    //定义附件
    var preview = [];
// 添加附件弹窗
    $("#addMore").click(function(){
        projectile.elastic({title: "上传附件", content: $("#popup"), area: ['650px', '250px']}, function () {
        });
    });
    //上传
    var paramdata={};
    paramdata.towPath = "leadermoney";
    fileUpload.picture({
        elem:"#upload",
        url:"/upload",//上传接口
        data: paramdata,//额外参数
        accept:"file",

    },function(res){//上传完成后的方法
        var fjname = $("#showfile").val();
        var fjurl = res.data;
        $("#preview").append('<p class="deP">' +
            '<span>附件： '+fjname+'</span> <a class="deA delete" href="javascript:;" data-href="'+fjurl+'" data-name="'+fjname+'">删除</a>' +
            '</p>');
        preview.push(
            {name:fjname,url:fjurl}
        );
        layer.closeAll(); //关闭loading
        $("#showfile").val("");
        layer.msg("上传成功！");
    });
    /* 以下 wj 新增 */
    getTuanDetail();//线路基本信息
    function getTuanDetail() {
        var formalid = $("#formalid").val();
        var params={};
        params.formalid = formalid;
        $.ajax({
            type: "get",
            url: "/formalLine/getFormalSanatoriumInfo",
            dataType: "json",
            data: params,
            success:function(response){
                var result = response.data;

                var tuanname = result[0].tuanname; //线路名称
                $("#tuanname").html(tuanname);

                var bengintime = result[0].bengintime; //开始日期
                var endtime = result[0].endtime; //结束日期

                $("#lydate").html(bengintime+"～"+endtime);

                var percount = result[0].percount; //人数
                if(percount!=undefined){
                    $("#percount").html(percount+"人");
                }else {
                    $("#percount").html("0 人");
                }

                var hname = "";
                for(var i=0;i<result.length;i++){
                    var lhname = result[i].hname; //疗养院名称
                    hname = hname + "、"+lhname
                }
                $("#hname").html(hname.substring(1));
            }
        });
    }
    //删除附件
    $(".delete").click(function () {
        $(this).closest('p').remove();
        var href = $(this).data("url");
        preview = preview.filter(item => item.url == url);
    });

    //点击确定
    $("#determine").click(function () {
        //获取表格中的数据tableIns
        var oldData = table.cache[layTableId];
        //var oldData = table.cache[tableIns];
        console.log(oldData);
        //获取附件
        console.log(preview);
        if(oldData.length==0){
            alert("请填写费用详情以后再进行确定！");
            return false;
        }
        var totalmoney = $("#totalmoney").text();
        var costid = "";
        var infolist =  new Array();
        for(var i=0;i<oldData.length;i++){
            var xuhao = oldData[i].LAY_TABLE_INDEX +1;
            var kind = oldData[i].kind;
            var detail = oldData[i].detail;
            var name = oldData[i].name;
            var num = oldData[i].num;
            var ps = oldData[i].ps;
            if(kind==0){
                alert("第"+xuhao+"行，请选择消费类型！");
                return false;
            }
            if(detail==0||detail==""){
                alert("第"+xuhao+"行，请选择消费明细！");
                return false;
            }
            if(name==0){
                alert("第"+xuhao+"行，请选择消费人！");
                return false;
            }
            if(kind==1&&name!=-1){
                alert("第"+xuhao+"行，团体消费类型时，消费人请选择所有人！");
                return false;
            }
            if(kind==2&&name==-1){
                alert("第"+xuhao+"行，个人消费类型时，消费人请选择具体消费人！");
                return false;
            }
            var info = {};
            info.costType = kind;
            info.costInfoid = detail;

            if(name==0||name==-1){
                info.userId = "";
            }else {
                info.userId = name;
            }
            info.price = num;
            info.remarks = ps;
            infolist.push(info);
        }
        var params={};

        var formalid = $("#formalid").val();
        var lineid = $("#lineid").val();
        var pagedata = $("#pagedata").val();

        params.formalid = formalid;
        params.lineid = lineid;
        params.totalmoney = totalmoney;
        params.costid = costid;
        params.infolist = JSON.stringify(infolist);
        params.appendlist = JSON.stringify(preview);
        $.ajax({
            type: "post",
            url: "/formalCost/saveCostInfoList",
            dataType: "json",
            data: params,
            success:function(response){
                window.location.href="/formalCost/tovestMoney?pagedata="+pagedata;
            }
        });
    });
});