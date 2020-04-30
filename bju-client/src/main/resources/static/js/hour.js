//注册时间
layui.define(['jquery','laydate'],function(exports){
    //声明使用
    var laydate = layui.laydate,
        $ = layui.jquery;
    //注册时间
    //选择日期
    lay('.laydate').each(function(){
        laydate.render({
            elem: this
            ,trigger: 'click'
            ,theme:'#005CA7'
        });
    });
    //选择月份
    lay('.laymonth').each(function(){
        laydate.render({
            elem: this
            ,trigger: 'click'
            ,type: 'month'
            ,theme:'#005CA7'
        });
    });
    //选择时间
    lay('.layDatetime').each(function(){
        laydate.render({
            elem: this
            ,trigger: 'click'
            ,type: 'datetime'
            ,theme:'#005CA7'
        });
    });
    exports("hour");
});