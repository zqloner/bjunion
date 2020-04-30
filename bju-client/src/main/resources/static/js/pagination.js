//分页
layui.define(["jquery","laypage"],function(exports){
    var $ = layui.jquery,
        laypage = layui.laypage,
        pagination = {
            paging:function (data,callback) {
                laypage.render({
                    elem: data.elem
                    , count: data.data.total//数据总数，从服务端得到
                    , pages: data.data.totalPage
                    , theme: '#005CA7'//自定义颜色
                    , limit: data.data.pageSize //默认显示几条数据
                    , limits: data.limits == undefined ? [5, 10, 20, 30, 40]:data.limits
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , prev: '<em class="layui-icon">&#xe603;</em>'
                    , next: '<em class="layui-icon">&#xe602;</em>'
                    , jump: callback
                });
            },
        };
    exports("pagination",pagination);
});