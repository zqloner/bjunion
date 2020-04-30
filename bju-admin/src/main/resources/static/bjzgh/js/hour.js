//注册时间
layui.define(['jquery','laydate'],function(exports){
    //声明使用
    var laydate = layui.laydate,
        $ = layui.jquery;

    //注册时间-单个时间
    lay('.laydate').each(function(){
        laydate.render({
            elem: this
            ,trigger: 'click'
            ,theme:'#1890ff'
        });
        function  formatminutes(date) {
            var aa = $(".laydate-time-list li ol")[1];
            var showtime = $($(".laydate-time-list li ol")[1]).find("li");
            for (var i = 0; i < showtime.length; i++) {
                var t00 = showtime[i].innerText;
                if (t00 != "00" && t00 != "20" && t00 != "30" && t00 != "40" && t00 != "50") {
                    showtime[i].remove()
                }
            }
            $($(".laydate-time-list li ol")[2]).find("li").remove();
        }
    });
    /*$("input[name='laydate']").each(function(){
        laydate.render({
            elem : this
        });
    });*/
    //注册时间-范围选择
    lay('.range').each(function(){
        laydate.render({
            elem : this,
            trigger: 'click',
            type: 'datetime',
            theme:'#1890ff'
        });
    });
    //注册时间-年月选择
    lay('.month').each(function(){
        laydate.render({
            elem : this,
            trigger: 'click',
            type: 'month',
            theme:'#1890ff'
        });
    });
    //注册时间-范围选择,当前日期
    lay('.range_now').each(function(){
        laydate.render({
            elem : this,
            trigger: 'click',
            type: 'datetime',
            theme:'#1890ff',
            min: 0 // 今天
        });
        function  formatminutes(date) {
            var aa = $(".laydate-time-list li ol")[1];
            var showtime = $($(".laydate-time-list li ol")[1]).find("li");
            for (var i = 0; i < showtime.length; i++) {
                var t00 = showtime[i].innerText;
                if (t00 != "00" && t00 != "20" && t00 != "30" && t00 != "40" && t00 != "50") {
                    showtime[i].remove()
                }
            }
            $($(".laydate-time-list li ol")[2]).find("li").remove();
        }
    });
    /*$("input[name='range']").each(function(){
        laydate.render({
            elem : this,
            type: 'datetime',
            range: true
        });
    });*/
//限定可选日期
    var laydate_hour = {
        optional_data : function (data) {
            var min = data.min,
                max = data.max;
            $("input[name='testLimit_1']").each(function(){
                laydate.render({
                    elem: this
                    ,min: min
                    ,max: max
                    ,ready: function(){
                        ins22.hint('日期可选值设定在 <br> '+min+'到 2080-10-14'+max);
                    }
                    ,change: function(value, date, endDate){
                        console.log(value); //得到日期生成的值，如：2017-08-18
                        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    }
                    ,done: function(value, date, endDate){
                        console.log(value); //得到日期生成的值，如：2017-08-18
                        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    }
                });
            });
        },
        //限定可选时间
        optional_time:function (data) {
            var min = data.min,
                max = data.max;
            $("input[name='testLimit_2']").each(function(){
                laydate.render({
                    elem: this
                    ,min: min
                    ,max: max
                    ,btns: ['clear', 'confirm']
                    ,ready: function(){
                        ins22.hint('时间可选值设定在 <br> '+min+'到 2080-10-14'+max);
                    }
                    ,change: function(value, date, endDate){
                        console.log(value); //得到日期生成的值，如：2017-08-18
                        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    }
                    ,done: function(value, date, endDate){
                        console.log(value); //得到日期生成的值，如：2017-08-18
                        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    }
                });
            });
        },
        //前后若干天可选
        around_day:function (data) {
            var min = data.min,
                max = data.max;
            $("input[name='testLimit_3']").each(function () {
                laydate.render({
                    elem:this
                    ,min: min
                    ,max: max
                    ,ready: function(date){
                        console.log(date); //得到初始的日期时间对象
                        ins22.hint('时间可选值设定在 <br> 前'+min+'后'+max+'可选');
                    }
                    ,change: function(value, date, endDate){
                        console.log(value); //得到日期生成的值，如：2017-08-18
                        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    }
                    ,done: function(value, date, endDate){
                        console.log(value); //得到日期生成的值，如：2017-08-18
                        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                    }
                });
            })
        }

    };
    exports("hour",laydate_hour);
});