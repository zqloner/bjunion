//弹出层
layui.define(["jquery","layer"],function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        layer_floor = {
            //提示
            tips: function(data,callback){
                layer.open({
                    title : ' ',
                    type: 1,
                    closeBtn: 1,
                    scrollbar: false,
                    offset: '200px',//坐标
                    fixed:true,
                    // shade: 0.6,//遮罩
                    shade: 'transparent',//遮罩
                    move: false,//拖拽
                    area: data.area,
                    content: data.content,
                    success: callback,//层弹出后的成功回调方法
                    end:function () {// 层销毁后触发的回调
                    }
                });
            },
            //弹出框
            elastic:function (data,callback) {
                layer.open({
                    title : data.title,
                    type: 1,
                    closeBtn: 1,
                    scrollbar: false,
                    offset: '40px',//坐标
                    fixed:true,
                    shade: 'transparent',//遮罩
                    move: false,//拖拽
                    area: data.area,
                    content: data.content,
                    success: callback,//层弹出后的成功回调方法
                    end:function () {// 层销毁后触发的回调
                    }
                });
            },
            record:function (data,callback) {
                layer.open({
                    title : ' ',
                    type: 1,
                    closeBtn: 1,
                    scrollbar: false,
                    offset: 'auto',//坐标
                    fixed:true,
                    shade: 0.6,//遮罩
                    move: false,//拖拽
                    area: data.area,
                    content: data.content,
                    success: callback,//层弹出后的成功回调方法
                    end:function () {// 层销毁后触发的回调
                    }
                });
            }
    };

    exports("projectile",layer_floor);
});