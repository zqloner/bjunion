layui.config({
    base : "../../js/"
}).use(['form','jquery','table','layer','ajax','pagination'],function(){
    var form = layui.form,
        $ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,ajax = layui.ajax //自定义请求数据
        ,pagination = layui.pagination//自定义分页
        ,limitNumber = 10
        ,pageFlag = true
        ,url = "/sanatoriumOrder/info";

    //表格渲染
    function tablePlay(data) {
        table.render({
            id: "enquiry",
            elem: '#table',
            data: data,
            loading: true,
            skin: 'line',
            limit:limitNumber,
            cols: [//设置表头参数
                [
                    {field: 'name',title: '疗养人姓名', width: '10%'}
                    , {field: 'enterpriseName',title: '所属单位', width: '15%'}
                    , {field: 'cardId',title: '京卡号', width: '15%'}
                    , {field: 'idcard',title: '身份证号', width: '15%'}
                    , {field: 'phone',title: '联系电话', width: '13%'}
                    , {field: 'lyfy',title: '疗养总费用',align:'center', width: '10%'}
                    , {field: 'jtfy',title: '交通费用',align:'center', width: '10%'}
                    , {field: 'ldfy',title: '领队上报费用',align:'center', width: '12%'}
                ]
            ],
            done: function(res, curr, count){
                setTimeout(function () {
                    parent.tools.redefinition($(".childrenBody").height());
                },200);
            }
        });
    }
    //分页渲染
    function laypageCurr(res) {
        if (pageFlag) {
            pagination.paging({data:res,num:limitNumber,elem:'page'},function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
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
        var params = {};
        params.pageNum = pageNumber;
        params.pageSize = pageSize;
        ajax.request(url + "/" + id,'GET',params,function(res){
            laypageCurr(res);
            tablePlay(res.list);
            //去除loding
            // parent.tools.stop();
        });
    }
    //页面渲染完成后获取bady的高度赋值给iframe
    setTimeout(function () {
        parent.tools.redefinition($(".childrenBody").height());
    },200);
});