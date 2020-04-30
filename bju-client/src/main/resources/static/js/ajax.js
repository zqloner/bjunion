layui.define(["layer","jquery"],function(exports){
    var $ = layui.$,
        layer = layui.layer,
        promise = {
            request : (url, type, data , collBack,errorBack) => {
                $.ajax({
                    url: url,
                    type:type,
                    data:data,//额外参数
                    // dataType:"json",
                    success: function (res) {
                        if (res.code == "200") {
                            var data = res.data;
                            collBack(data);
                        }else {
                            if(errorBack != undefined){
                                errorBack(res);
                            }else{
                                layer.msg(res.message,{icon: 5});
                            }
                        }
                        //删除loding
                        // parent.tools.stop();
                    },
                    error:function () {
                        //删除loding
                        // parent.tools.stop();
                        layer.msg('请求异常！');
                    },complete:function(XMLHttpRequest,textStatus){
                        if(textStatus!="success"){
                            layer.msg('登陆超时！请重新登陆！', {
                                icon: 5,//提示的样式
                                time: 2000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                                end:function(){
                                    window.location.href = '/';
                                }
                            });
                        }
                    }
                });
            }
        };

    exports("ajax",promise);
});