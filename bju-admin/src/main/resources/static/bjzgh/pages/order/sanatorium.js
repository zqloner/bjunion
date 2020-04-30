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
    costinfo: [
        {name: '请选择'},
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'},
        {id: 4, name: '4'},
        {id: 5, name: '5'}
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
/**
 * Created by zhuxq on 2019/9/11.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'element', 'pagination', 'projectile', 'hour','fileUpload'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , element = layui.element
        , projectile = layui.projectile //自定义弹窗
        , pagination = layui.pagination //自定义分页
        , fileUpload = layui.fileUpload //自定义时间选择器
        , hour = layui.hour //自定义分页
        , pageFlag = true
        ,layTableId = "add"
        ,tableIns
        ,appendix          //附件
        ,currentId
        , costDetailMap = {}
        //, url = "../../json/company.json";
        , searchObj = {}//查询参数
        , nums = 10;//每页条数

    //定义事件集合
    var active = {
        addRow: function(){	//添加一行
            var oldData = table.cache[layTableId];
            var newRow = {tempId: new Date().getTime(),costInfo: '', price: 0, remarks:''};
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
                var theje = Data2[j].price;
                totalmoney = totalmoney + Number(theje);
            }
            $("#totalmoney").html(totalmoney);
            tableIns.reload({
                data : oldData
            });
        }
    };



    table.on('edit(add)', function(obj){ //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        if (obj.field == 'price') {
            var reg = /^[0-9]+(.[0-9]{1,2})?$/;
            var data = table.cache["add"];
            if(!reg.test(obj.value)){
                layer.msg("请输入正确的消费金额");
                return;
            }
            var totalmoney = 0;
            for (var j = 0; j < data.length; j++) {
                var price = data[j].price;
                if(reg.test(price)){
                    totalmoney = totalmoney + Number(price);
                }
            }
            $("#totalmoney").html(totalmoney);
        }
    });

    //定义附件
    var preview = [];
// 添加附件弹窗
    $("#addMore").click(function(){
        appendix = layer.open({
            title: "上传附件",
            type: 1,
            closeBtn: 1,
            shadeClose: true,//是否点击遮罩关闭
            scrollbar: false,
            offset: '42px',//坐标
            fixed: true,
            shade: 'transparent',//遮罩
            move: false,//拖拽
            area: ['650px', '250px'],
            content: $("#popup"),
            success: function(){

            },//层弹出后的成功回调方法
            end: function () {// 层销毁后触发的回调
            }
        });
    });
    //上传
    fileUpload.picture({
        elem:"#upload",
        url:"/upload",//上传接口
        obj: {"towPath":"append/cost"},//额外参数
        accept:"file",
        size:1024
    },function(res){//上传完成后的方法
        var fjname = $("#showfile").val();
        var fjurl = res.data;
        $("#preview").append('<p class="deP">' +
            '<span>附件： '+fjname+'</span> <a class="deA delete"  value="'+ (preview.length) +'" data-name="'+fjname+'">删除</a>' +
            '</p>');

        preview.push(
            {name:fjname,url:fjurl,tmpId:preview.length}
        );
        layer.close(appendix); //关闭loading
        layer.closeAll('loading'); //关闭loading
        $("#showfile").val("");
        layer.msg("上传成功！");
    });

    //删除附件
    $("body").on("click",".delete",function(){
        $(this).closest('p').remove();
        var value = $(this).attr("value");
        preview = preview.filter(item => item.tmpId != value);
    });


    //点击确定
    $("#determine").click(function () {
        $("#determine").attr("disabled",true);
        //获取表格中的数据tableIns
        var oldData = table.cache[layTableId];
        //var oldData = table.cache[tableIns];
        //获取附件
        if(oldData.length==0){
            layer.msg("请填写费用详情以后再进行确定！");
            $("#determine").attr("disabled",false);
            return false;
        }
        var infolist =  new Array();
        var reg = /^[0-9]+(.[0-9]{1,2})?$/;
        for(var i=0;i<oldData.length;i++){
            var obj = oldData[i];
            var detail = obj.detail == undefined ? "" : obj.detail;
            var price = obj.price;
            obj.costInfoId = detail;
            if(detail.trim().length == 0){
                layer.msg("请完善费用明细");
                $("#determine").attr("disabled",false);
                return false;
            }
            if(!reg.test(price)){
                layer.msg("请输入正确的消费金额");
                $("#determine").attr("disabled",false);
                return false;
            }
            obj.costInfo = costDetailMap[detail].value;
            obj.costType = 1;
            infolist.push(obj);
        }
        /*if(preview.length == 0){
            layer.msg("请添加附件！");
            $("#determine").attr("disabled",false);
            return false;
        }*/
        var params={};
        params.costs = infolist;
        params.appends = preview;
        params.id = currentId;
        /*params.id = currentId;
        params.costs = infolist;
        params.appends = preview;*/
        $.ajax({
            type: "post",
            url: "/formalCost/add",
            dataType: "json",
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify(params),
            success:function(res){
                if(res.code == 200){
                    layer.msg("添加成功");
                    window.location.href="/changePage?page=order/sanatorium";
                }else{
                    layer.msg(res.message);
                }
                $("#determine").attr("disabled",false);
            }
        });
    });

    // 表单查询
    form.on('submit(submitData)', function (data) {
        pageFlag = true;
        var field = data.field;
        for(var key in field){
            if(field[key].trim().length == 0){
                delete field[key];
            }
        }
        searchObj = field;
        getCadreList();
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 列表渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: "#table",
            data: data,
            limit:nums,
            // 设置表头参数
            cols: [
                [
                    {field: 'lineName', title: '线路', width: '25%'}
                    , {field: 'timeSum', title: '疗养日期', width: '20%', templet: function (d) {
                    return d.sbenginTime + "-" + d.sendTime;
                }
                }
                    , {field: 'nowCount', title: '疗养人数', width: '12%'}
                    , {field: 'leaderName', title: '领队', width: '13%'}
                    , {
                    field: 'examineStatus', title: '状态', width: '15%', templet: function (d) {
                        var id = d.id;
                        if (id != undefined) {
                            return '<span class="layui-badge-dot layui-bg-green"></span> 已添加';
                        } else {
                            return '<span class="layui-badge-dot layui-bg-gray"></span> 未添加';
                        }
                    }
                }
                    , {title: '操作', width: '15%', templet: function (d) {
                    var id = d.id;
                        if (id != undefined) {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="detail">查看详情</a>';
                        }else {
                            return '<a class="layui-btn layui-btn-primary layui-btn-xs table-btn" lay-event="add">费用添加</a>';
                        }
                    }
                }
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                nums = obj.limit;
                if (!first) {
                    pageFlag = false;
                    getCadreList(obj.curr, obj.limit)
                }
            });
        }
    }
    // 加载数据
    function getCadreList(pageNumber, pageSize) {
        // 数据加载中loading
        var params = searchObj;
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: '/formalCost/list',
            type: "GET",
            data: params,
            // dataType:"json",
            success: function (res) {
                if (res.code == "200") {
                    tablePlay(res.data.list); //列表渲染
                    laypageCurr(res.data); //分页渲染
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    // 初始化加载
    getCadreList();

    // 监听表格操作按钮点击
    table.on('tool(test)', function (obj) {
        var formalId = obj.data.formalId;
        if (obj.event === 'detail') { // 查看详情
            var detail = layer.open({
                type: 1 //此处以iframe举例
                , title: '详情'
                , area: ['900px', '460px']
                , shade: 0
                , maxmin: true
                , content: $('#deContent')
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero); //层置顶
                    getDetailById(formalId);
                }
            });
            //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
            $(window).resize(function () {
                layui.layer.full(detail);
            });
            layui.layer.full(detail);
        } else if (obj.event === 'add') { // 费用添加
            adminCost();
            currentId = formalId;
            var add = layer.open({
                type: 1 //此处以iframe举例
                ,id:'aaaaaa'
                , title: '费用添加'
                , area: ['100%', '100%']
                , shade: 0
                // , maxmin: true
                , content: $('#preContent')
                , zIndex: 11111
                /*, success: function (layero) {
                    layer.setTop(layero); //层置顶
                }*/
            });
            getDetailById(formalId);
            //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
            /*$(window).resize(function () {
                layui.layer.full(add);
            });
            layui.layer.full(add);*/
        }
    });
    // 列表渲染
    // tablePlayGeneral();
    function tablePlayGeneral(data) {
        tableIns = table.render({
            id: "add",
            elem: "#addTable",
            toolbar: '#toolbarDemo',
            data: [],
            // 设置表头参数
            cols: [
                [
                    {type:'checkbox', width: '10%'}
                    , {field: 'costInfo', title: '费用明细', width: '30%',templet: function (d) {
                        var options2 = viewObj.renderSelectOptions(viewObj.costinfo, {valueField: "id", textField: "value", selectedValue: d.detail});
                        return '<a lay-event="detail"></a><select name="detail" lay-filter="detail">' + options2 + '</select>';
                    }}
                    , {field: 'price', title: '消费总额', width: '30%',edit:'text'}
                    , {field: 'remarks', title: '备注', width: '30%',edit:'text'}
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurrGeneral(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                if (!first) {
                    pageFlag = false;
                    getCadreListGeneral(obj.curr, obj.limit)
                }
            });
        }
    }
    // 加载数据
    function getCadreListGeneral(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: "/bjzgh/json/cost.json",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (res) {
                if (res.state == "200") {
                    tablePlayGeneral(res.result); //列表渲染
                    laypageCurrGeneral(res.result); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }
    // 初始化加载
    // getCadreListGeneral();
    //监听顶部工具条
    table.on('toolbar(add)', function (obj) {
        //获取选中行的数据
        /*var checkStatus = table.checkStatus(obj.config.id);
        var data = checkStatus.data;
        console.log(JSON.stringify(data));*/
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

    form.on('select(detail)', function(data){
        var elem = data.elem; //得到select原始DOM对象
        $(elem).prev("a[lay-event='detail']").trigger("click");
    });
    //监听表格中下拉
    table.on('tool(add)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        switch(event){
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


    function getDetailById(id) {
        $.ajax({
            url: '/formalCost/getById/',
            type: "GET",
            data: {"id":id},
            // dataType:"json",
            success: function (res) {
                if (res.code == 200) {
                    var currentObj = res.data;
                    if(currentObj != null && currentObj != undefined) {
                        $("[name=lineName]").html(currentObj.lineName);
                        $("[name=price]").html(currentObj.price == undefined ? 0 : currentObj.price);
                        $("[name=nowCount]").html(currentObj.nowCount);
                        $("[name=sanatorName]").html(currentObj.sanatorName);
                        $("[name=time]").html(currentObj.sbenginTime + "-" + currentObj.sendTime);
                        tablePlayFine(currentObj.infos);
                        dealEnclosure(currentObj.appends);
                    }
                } else {
                    layer.msg(res.message);
                }
            }
        });
    }
    function dealEnclosure(data){
        var value = "";
        for(var i = 0;i < data.length;i++) {
            value += '<p class="deP">'+
                '            '+ data[i].name +' <a class="deA" target="_blank" href="'+ data[i].url +'">在线预览</a> <a class="deA" href="'+ data[i].url +'" download="">下载</a>'+
                '        </p>';
        }
        $("#enclosure").after(value);
    }
    // 列表渲染
    function tablePlayFine(data) {
        table.render({
            id: "fine",
            elem: "#fineTable",
            data: data,
            // 设置表头参数
            cols: [
                [
                    {field: 'costInfo', title: '费用明细', width: '20%'}
                    , {field: 'price', title: '消费总额', width: '20%'}
                    , {field: 'remarks', title: '备注', width: '20%'}
                ]
            ]
        });
    }
    // 分页渲染
    function laypageCurrFine(res) {
        var nums = 10;
        if (pageFlag) {
            pagination.paging({data: res, num: nums}, function (obj, first) {
                if (!first) {
                    pageFlag = false;
                    getCadreListFine(obj.curr, obj.limit)
                }
            });
        }
    }
    // 加载数据
    function getCadreListFine(pageNumber, pageSize) {
        // 数据加载中loading
        // parent.tools.load();
        var params = new Object();
        params.pageNumber = pageNumber;
        params.pageSize = pageSize;
        $.ajax({
            url: "../../json/cost.json",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (res) {
                if (res.state == "200") {
                    tablePlayFine(res.result); //列表渲染
                    laypageCurrFine(res.result); //分页渲染
                } else {
                    layer.msg(res.data.msg);
                }
            }
        });
    }

    function adminCost() {
        $.ajax({
            type: "GET",
            url: "/sysDict/adminCost",
            data: "",
            success:function(res){
                if(res.code == 200){
                    var arr = [{"name":"请选择"}];
                    viewObj.costinfo = arr.concat(res.data);
                    var data = res.data;
                    for(var i = 0;i < data.length;i++){
                        costDetailMap[data[i].id] = data[i];
                    }
                    tablePlayGeneral();
                }else{
                    layer.msg(res.message);
                }
            }
        });
    }
});