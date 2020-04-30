//todo 修改编辑器 *************************************
var editor;
// 初始化编辑器
var editorTool = {
    wangEditorTool:function wangEditorTool(data) {
        data = data == undefined ? {} : data;
        data.elem = data.elem == undefined ? '#editor' : data.elem;
        var E = window.wangEditor;
        editor = new E(data.elem);
        // 自定义字体
        editor.customConfig.fontNames = [
            '宋体',
            '微软雅黑',
            '仿宋',
            '隶书',
            '幼圆',
            'Arial',
            'Tahoma',
            'Verdana'
        ];
        // 自定义菜单配置
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'image',  // 插入图片
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ];
        // 关闭粘贴样式的过滤
        editor.customConfig.pasteFilterStyle = false;
        // 忽略粘贴内容中的图片
        // editor.customConfig.pasteIgnoreImg = true;
        editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;
        // 限制一次最多上传 5 张图片
        editor.customConfig.uploadImgMaxLength = 10;
        //自定义提示方法
        editor.customConfig.customAlert = function (info) {
            // info 是需要提示的内容
            layer.alert('提示：' + info)
        }
        editor.create();
    },
    getContent:function(){
        // 往编辑器里设置内容
        return editor.txt.html();
    },
    setContent:function(value){
        // 获取编辑器内容
        editor.txt.html(value)
    },
    wangEditorToolUploadFile:function(data){
        data = data == undefined ? {} : data;
        data.elem = data.elem == undefined ? '#editor' : data.elem;
        data.uploadUrl = data.uploadUrl == undefined ? '/uploadLayUI' : data.uploadUrl;
        data.towPath = data.towPath == undefined ? 'pic' : data.towPath;
        var E = window.wangEditor;
        editor = new E(data.elem);
        // 自定义字体
        editor.customConfig.fontNames = [
            '宋体',
            '微软雅黑',
            '仿宋',
            '隶书',
            '幼圆',
            'Arial',
            'Tahoma',
            'Verdana'
        ];
        //todo 上传图片
        editor.customConfig.uploadFileName = 'file'; //设置文件上传的参数名称
        editor.customConfig.uploadImgServer = data.uploadUrl;
        editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;
        // 限制一次最多上传 5 张图片
        editor.customConfig.uploadImgMaxLength = 1;
        // editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        editor.customConfig.uploadImgParams = {
            // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
            // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
            "towPath": data.towPath
        }
        //自定义提示方法
        editor.customConfig.customAlert = function (info) {
            layer.close(editorLoadIndex);
            // info 是需要提示的内容
            layer.alert('提示：' + info)
        }
        editor.customConfig.uploadImgHooks = {
            before: function (xhr, editor, files) {
                // 图片上传之前触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                // return {
                //     prevent: true,
                //     msg: '放弃上传'
                // }
                editorLoadIndex = layer.open({
                    type: 3,   //3 表示加载
                    fixed: false,    //取消固定定位，因为固定定位是相对body的
                    offset: ['50%', '50%'],   //相对定位
                    //time: 2000,   //定时关闭弹层
                    icon: 0,   //加载的icon类型
                    shade: 'background-color: rgba(0,0,0,.5)',
                    shadeClose: false,
                    success: function(layero,index){
                        layero.css("position","relative").append(layero);    //如果该父级原来没有设置相对定位，那么在追加该弹层之前需要设置
                    }
                });
            },
            success: function (xhr, editor, result) {
                layer.close(editorLoadIndex);
                // 图片上传并返回结果，图片插入成功之后触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            fail: function (xhr, editor, result) {
                // 图片上传并返回结果，但图片插入错误时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            error: function (xhr, editor) {
                // 图片上传出错时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            }
        }
        editor.create();
    }
}
