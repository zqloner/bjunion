/**
 * Created by zhuxq on 2019/9/10.
 */
layui.config({
    base: "/bjzgh/js/"
}).use(['jquery', 'table', 'layer', 'form', 'transfer', 'layedit', 'hour', 'pagination', 'projectile'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , transfer = layui.transfer
        , layedit = layui.layedit
        , hour = layui.hour
        , pagination = layui.pagination //自定义分页
        , projectile = layui.projectile; //自定义弹窗

//
// <div class="layui-col-xs6" name="contractCode"><span class="deName">服务合同编号：</span>19921127</div>
//     <div class="layui-col-xs6" name="contractName"><span class="deName">服务合同名称：</span>合同名称</div>
//     <div class="layui-col-xs6" name="time"><span class="deName">合同起止时间：</span>2019.08.23 08:00:00——2019.09.23 08:00:00</div>
//     <div class="layui-col-xs6" name="type"><span class="deName">业务类型：</span>疗养服务</div>
//     <div class="layui-col-xs6" name="person"><span class="deName">业务负责人：</span>肖战</div>
//     <div class="layui-col-xs6" name="phone"><span class="deName">负责人联系方式：</span>19911005</div>
//     <div class="layui-col-xs6" name="partyaName"><span class="deName">甲方名称：</span>哇唧唧哇</div>
//     <div class="layui-col-xs6" name="partyaNameLegal"><span class="deName">甲方法务实体名称：</span>哇唧唧哇</div>
//     <div class="layui-col-xs6" name="partyaPerson"><span class="deName">甲方联系人：</span>翟潇闻</div>
//     <div class="layui-col-xs6" name="partyaPhone"><span class="deName">甲方联系人手机号：</span>19990528</div>
//     <div class="layui-col-xs6" name="partyaTel"><span class="deName">甲方固定电话：</span>19990528</div>
//     <div class="layui-col-xs6" name="partyaAddress"><span class="deName">甲方地址：</span>北京市</div>
//     <div class="layui-col-xs6" name="partybPerson"><span class="deName">乙方联系人：</span>朴灿烈</div>
//     <div class="layui-col-xs6" name="partybPhone"><span class="deName">乙方联系人手机号：</span>19921127</div>
//     <div class="layui-col-xs6" name="partybTel"><span class="deName">乙方固定电话：</span>19921127</div>
//     <div class="layui-col-xs6" name="partyAddress"><span class="deName">乙方地址：</span>首尔</div>

    function getInfo(){
        $.ajax({
            url:"/contractContract/toUpdateOrSeeDetail" ,
            type:"GET" ,
            data:{"contractId":$("#contractId").val()},
            success:function (res) {
               console.log(res);
               $("[name='contractCode']").html("<span class=\"deName\">服务合同编号：</span>"+res.data.contractCode);
                $("[name='contractName']").html("<span class=\"deName\">服务合同名称：</span>"+res.data.contractName);
                $("[name='time']").html("<span class=\"deName\">合同起止时间：</span>"+res.data.contractBeginTime+'--'+res.data.contractEndTime);
                if(res.data.type == 0){
                    $("[name='type']").html("<span class=\"deName\">业务类型：</span>"+ '疗养合同');
                }
                if(res.data.type == 1){
                    $("[name='type']").html("<span class=\"deName\">业务类型：</span>"+'服务企业合同');
                }
                $("[name='person']").html("<span class=\"deName\">业务负责人：</span>"+res.data.person);
                $("[name='phone']").html("<span class=\"deName\">负责人联系方式：</span>"+res.data.phone);
                $("[name='partyaName']").html("<span class=\"deName\">甲方名称：</span>"+res.data.partyaName);
                $("[name='partyaNameLegal']").html("<span class=\"deName\">甲方法务实体名称：</span>"+res.data.partyaNameLegal);
                $("[name='partyaPerson']").html("<span class=\"deName\">甲方联系人：</span>"+res.data.partyaPerson);
                $("[name='partyaPhone']").html("<span class=\"deName\">甲方联系人手机号：</span>"+res.data.partyaPhone);
                $("[name='partyaTel']").html("<span class=\"deName\">甲方固定电话：</span>"+res.data.partyaTel);
                $("[name='partyaAddress']").html("<span class=\"deName\">甲方地址：</span>"+res.data.partyaAddress);
                $("[name='partybPerson']").html("<span class=\"deName\">乙方联系人：</span>"+res.data.partybPerson);
                $("[name='partybPhone']").html("<span class=\"deName\">乙方联系人手机号：</span>"+res.data.partybPhone);
                $("[name='partybTel']").html("<span class=\"deName\">乙方固定电话：</span>"+res.data.partybTel);
                $("[name='partyAddress']").html("<span class=\"deName\">乙方地址：</span>"+res.data.partyAddress);
            },
            dataType:"json"
        });
    }
    getInfo();
});