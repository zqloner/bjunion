//分页
layui.define(["jquery", "laypage"], function (exports) {
    var $ = layui.jquery,
        laypage = layui.laypage,
        pagination = {
            paging: function (data, callback) {
                laypage.render({
                    elem: data.data.elem == undefined ? 'page': data.data.elem
                    , count: data.data.total //数据总数，从服务端得到
                    , pages: data.data.totalPage
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.pageSize  //默认显示几条数据
                    , limits: [5, 10, 20, 30, 40]
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , first: '首页'
                    , last: '尾页'
                    , prev: '上一页'
                    , next: '下一页'
                    , jump: callback
                });

            }
        };
    exports("pagination", pagination);
});