//分页
layui.define(["jquery", "laypage"], function (exports) {
    var $ = layui.jquery,
        laypage = layui.laypage,
        pagination = {
            paging: function (data, callback) {
                laypage.render({
                    elem: 'page'
                    , count: data.data.total //数据总数，从服务端得到
                    , pages: Math.ceil(data.data.total / data.num)
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.num  //默认显示几条数据
                    , limits: [5, 10, 20, 30, 40]
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , first: '首页'
                    , last: '尾页'
                    , prev: '上一页'
                    , next: '下一页'
                    , jump: callback
                });
                laypage.render({
                    elem: 'popPage'
                    , count: data.data.total //数据总数，从服务端得到
                    , pages: Math.ceil(data.data.total / data.num)
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.num  //默认显示几条数据
                    , limits: [5, 10, 20, 30, 40]
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , first: '首页'
                    , last: '尾页'
                    , prev: '上一页'
                    , next: '下一页'
                    , jump: callback
                });
                laypage.render({
                    elem: 'finePage'
                    , count: data.data.total //数据总数，从服务端得到
                    , pages: Math.ceil(data.data.total / data.num)
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.num  //默认显示几条数据
                    , limits: [5, 10, 20, 30, 40]
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , first: '首页'
                    , last: '尾页'
                    , prev: '上一页'
                    , next: '下一页'
                    , jump: callback
                });
                laypage.render({
                    elem: 'generalPage'
                    , count: data.total //数据总数，从服务端得到
                    , pages: Math.ceil(data.data.total / data.num)
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.num  //默认显示几条数据
                    , limits: [5, 10, 20, 30, 40]
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , first: '首页'
                    , last: '尾页'
                    , prev: '上一页'
                    , next: '下一页'
                    , jump: callback
                });
                laypage.render({
                    elem: 'addPage'
                    , count: data.data.total //数据总数，从服务端得到
                    , pages: Math.ceil(data.data.total / data.num)
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.num  //默认显示几条数据
                    , limits: [5, 10, 20, 30, 40]
                    , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                    , first: '首页'
                    , last: '尾页'
                    , prev: '上一页'
                    , next: '下一页'
                    , jump: callback
                });
                laypage.render({
                    elem: 'dePage'
                    , count: data.data.total //数据总数，从服务端得到
                    , pages: Math.ceil(data.data.total / data.num)
                    , theme: '#009688' //自定义颜色
                    , limit: data.data.num  //默认显示几条数据
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