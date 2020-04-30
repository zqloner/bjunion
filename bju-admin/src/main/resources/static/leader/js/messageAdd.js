/**
 * Created by zhuxq on 2019/9/6.
 */
layui.config({
    base: "../../js/"
}).use(['jquery', 'table', 'layer', 'form', 'fileUpload', 'pagination'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , pageFlag = true
        , pagination = layui.pagination //自定义分页
        , fileUpload = layui.fileUpload;//自定义文件上传

    // 监听提交
    form.on('submit(submitData)', function (data) {
        // 前端测试代码，正式删掉。
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        }, function () {
            layer.closeAll(); //关闭所有层
            window.location.href = "message.html";
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    // 选择职工
    $("#choose").click(function () {
        var choose = layer.open({
            type: 1 //此处以iframe举例
            , title: '选择职工'
            , area: ['590px', '460px']
            , shade: 0
            , maxmin: true
            , content: $('#deContent')
            , zIndex: layer.zIndex
            , success: function (layero) {
            }
        });
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function () {
            layui.layer.full(choose);
        });
        layui.layer.full(choose);
        // 列表渲染
        function tablePlayDe(data) {
            table.render({
                id: "de",
                elem: "#deTable",
                data: data.data,
                // 设置表头参数
                cols: [
                    [
                        {type: 'checkbox', width: '8%'}
                        , {field: 'id', title: '序号', width: '8%'}
                        , {field: 'guideCard', title: '京卡卡号', width: '12%'}
                        , {field: 'realName', title: '姓名', width: '10%'}
                        , {field: 'company', title: '所属单位', width: '10%'}
                        , {
                        field: 'sex', title: '性别', width: '8%', templet: function (d) {
                            if (d.sex == '0') {
                                return '男';
                            } else if (d.sex == '1') {
                                return '女';
                            }
                        }
                    }
                        , {field: 'age', title: '年龄', width: '10%'}
                        , {field: 'idCard', title: '身份证号', width: '12%'}
                        , {field: 'tel', title: '联系方式', width: '12%'}
                        , {field: 'permission', title: '职务', width: '10%'}
                    ]
                ]
            });
            table.resize('de');
        }
        // 分页渲染
        function laypageCurrDe(res) {
            var nums = 10;
            if (pageFlag) {
                pagination.paging({data: res, num: nums}, function (obj, first) {
                    // obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); // 得到每页显示的条数
                    if (!first) {
                        pageFlag = false;
                        getCadreListDe(obj.curr, obj.limit)
                    }
                });
            }
        }
        // 加载数据
        function getCadreListDe(pageNumber, pageSize) {
            // 数据加载中loading
            // parent.tools.load();
            var params = new Object();
            params.pageNumber = pageNumber;
            params.pageSize = pageSize;
            $.ajax({
                url: "../../json/worker.json",
                type: "GET",
                data: params,
                dataType: "json",
                success: function (res) {
                    if (res.state == "200") {
                        tablePlayDe(res.result); //列表渲染
                        laypageCurrDe(res.result); //分页渲染
                    } else {
                        layer.msg(res.data.msg);
                    }
                }
            });
        }
        // 初始化加载
        getCadreListDe();
    });
    // 监听提交
    form.on('submit(search)', function (data) {
        // 前端测试代码，正式删掉。
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        }, function () {
            layer.closeAll(); //关闭所有层
        });
        return false; // 阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});