layui.define(['jquery', 'layer'], function (exports) {
    //声明使用
    var layer = layui.layer,
        $ = layui.jquery;

    $(function () {
        var zTreeObj, zTreeObj_1;
        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: false
            },
            edit: {
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: showRemoveBtn,
                showRenameBtn: showRenameBtn
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onRemove: onRemove,
                onRename: onRename,
                beforeRemove: zTreeBeforeRemove
            }
        };
        var setting1 = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: false
            },
            edit: {
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: showRemoveBtn,
                showRenameBtn: showRenameBtn
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onRemove: onRemove,
                onRename: onRename,
                beforeRemove: zTreeBeforeRemove
            }
        };
        var zNodes = [
            {id: 1, pId: 0, name: "组织结构", open: true},

            {id: 11, pId: 1, name: "测试教育局", open: true},
            {id: 101, pId: 11, name: "测试一组"},

            {id: 12, pId: 1, name: "中国教育局", open: true},
            {id: 201, pId: 12, name: "北京市教育局"}
        ];
        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);

        // 删除节点前的提示框
        function zTreeBeforeRemove(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            //采用layer的确认弹框
            layer.confirm("删除此层级将会删除所有的子层级，您确定要删除此层级吗？", {
                icon: 2,
                btn: ['确定', '取消']
            }, function (index) {
                zTree.removeNode(treeNode);
                layer.close(index);
            }, function (index) {
                layer.close(index);
            });
            return false;
        }

        function showRemoveBtn(treeId, treeNode) {
            if (treeNode.id != 1) {
                return treeNode;
            }
        }

        function showRenameBtn(treeId, treeNode) {
            if (treeNode.id != 1) {
                return treeNode;
            }
        }

        var newCount = 1;

        function addHoverDom(treeId, treeNode) {
            var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                + "' title='add node' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_" + treeNode.tId);
            if (btn) btn.bind("click", function () {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "添加" + (newCount++)});
                return false;
            });
        }

        function removeHoverDom(treeId, treeNode) {
            $("#addBtn_" + treeNode.tId).unbind().remove();

        }

        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
        }

        /*
         * 编辑节点回调函数
         * event js event 对象
         * treeId 对应 zTree 的 treeId，便于用户操控
         * treeNode 被修改名称的节点 JSON 数据对象
         * */
        function onRename(event, treeId, treeNode) {
            //console.log(treeNode.tId + ", " + treeNode.name);
        }

        /*
         *删除节点回调函数
         *treeNode 将要删除的节点 JSON 数据对象
         * */
        function onRemove(event, treeId, treeNode) {
            //debugger;
           // console.log(treeNode.tId + ", " + treeNode.name);
        }
    });

    exports("fileTree", function (option) {
        return hour.set(option);
    });
});
