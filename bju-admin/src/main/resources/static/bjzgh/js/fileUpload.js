// 图片上传
layui.define(['jquery','upload'],function(exports){
    //声明使用
    var upload = layui.upload,
        $ = layui.jquery,
        fileUpload = {
            picture:function (data,callback) {
                upload.render({
                    elem: data.elem //容器选择器
                    ,url: data.url  //上传接口
                    ,method:"POST" //上传接口的 HTTP 类型
                    ,data:data.obj  //额外参数
                    ,accept:data.accept //允许上传的文件类型images
                    // ,acceptMime: 'image/*'//规定打开文件选择框时，筛选出的文件类型
                    ,size: data.size //最大允许上传的文件大小
                    // ,choose: callback
                    ,choose: function(obj){  //选择文件后的回调函数
                        console.log(obj);
                        //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                        obj.preview(function(index, file, result){
                            // console.log(index); //得到文件索引
                            // console.log(file); //得到文件对象
                            // console.log(result); //得到文件base64编码，比如图片
                            /*if(data.accept=="image"){
                                $("input[name='picture']").val(file.name);
                                $("#preview").attr('src',result);
                            }else if(data.accept=="video"){
                                $("input[name='video']").val(file.name);
                            }else if(data.accept=="audio"){
                                $("input[name='audio']").val(file.name);
                            }else */
                            if(data.accept=="file"){
                                $("input[name='showfile']").val(file.name);
                            }
                            //$("input[name='showfile']").val(file.name);
                            //这里还可以做一些 append 文件列表 DOM 的操作
                            //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                            //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                        });
                    }
                    ,before: function(obj){   //文件提交上传前的回调
                        //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                        layer.load(0, {shade: [0.2,'#000']})
                    }
                    ,done: callback == undefined ? function(res, index, upload){  //执行上传请求后的回调
                        $(".addBtn").css("display","none");
                        layer.closeAll('loading'); //关闭loading
                        layer.msg("上传成功！");
                    } : callback
                    ,error: function(index, upload){   //执行上传请求出现异常的回调
                        $(".addBtn").css("display","block");
                        layer.closeAll('loading'); //关闭loading
                        layer.msg("上传失败！");
                    }
                });
            }
        };
    exports("fileUpload",fileUpload);
});