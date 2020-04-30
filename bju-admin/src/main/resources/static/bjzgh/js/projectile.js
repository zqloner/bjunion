//弹出层
layui.define(["jquery", "layer"], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        layer_floor = {
            //弹出框
            elastic: function (data, callback) {
                layer.open({
                    title: data.title,
                    type: 1,
                    closeBtn: 1,
                    id:"bb",
                    // zIndex:1989101699,
                    btnAlign: 'c',
                    shadeClose: true,//是否点击遮罩关闭
                    scrollbar: false,
                    offset: '42px',//坐标
                    fixed: true,
                    shade: 'transparent',//遮罩
                    move: false,//拖拽
                    area: data.area,
                    content: data.content,
                    success: callback,//层弹出后的成功回调方法
                    end: function () {// 层销毁后触发的回调
                    }
                });
            }
        };

    exports("projectile", layer_floor);
});