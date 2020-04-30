/*
 @Author: 请叫我马哥
 @Time: 2017-04
 @Tittle: tab
 @Description: 点击对应按钮添加新窗口
 */
var tabFilter,menu=[],liIndex,curNav,delMenu;
layui.define(["element","jquery"],function(exports){
	var element = layui.element,
		$ = layui.jquery,
		layId,
		Tab = function(){
			this.tabConfig = {
				//closed : true,
				//openTabNum : 10,
				tabFilter : "bodyTab"
			}
		};

	//生成左侧菜单
	Tab.prototype.navBar = function(strData){
		var data;
		if(typeof(strData) == "string"){
			data = JSON.parse(strData); //部分用户解析出来的是字符串，转换一下
		}else{
			data = strData;
		}
		var ulHtml = '';
		for(var i=0;i<data.length;i++){
			if(data[i].spread || data[i].spread == undefined){
			 ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
			 }else{
			 ulHtml += '<li class="layui-nav-item">';
			 }
			//ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
			if(data[i].children != undefined && data[i].children.length > 0){
				ulHtml += '<a>';
				if(data[i].icon != undefined && data[i].icon != ''){
					if(data[i].icon.indexOf("icon-") != -1){
						ulHtml += '<i class="seraph '+data[i].icon+'" data-icon="'+data[i].icon+'"></i>';
					}else{
						ulHtml += '<i class="layui-icon" data-icon="'+data[i].icon+'">'+data[i].icon+'</i>';
					}
				}
				ulHtml += '<cite>'+data[i].title+'</cite>';
				ulHtml += '<span class="layui-nav-more"></span>';
				ulHtml += '</a>';
				ulHtml += '<dl class="layui-nav-child">';
				for(var j=0;j<data[i].children.length;j++){
					if(data[i].children[j].spread){
						ulHtml += '<dd class="layui-this" data-href="'+data[i].children[j].href+'"><a data-url="'+data[i].children[j].href+'">';
					}else{
						ulHtml += '<dd data-href="'+data[i].children[j].href+'"><a data-url="'+data[i].children[j].href+'">';
					}
					if(data[i].children[j].icon != undefined && data[i].children[j].icon != ''){
						if(data[i].children[j].icon.indexOf("icon-") != -1){
							ulHtml += '<i class="seraph '+data[i].children[j].icon+'" data-icon="'+data[i].children[j].icon+'"></i>';
						}else{
							ulHtml += '<i class="layui-icon" data-icon="'+data[i].children[j].icon+'">'+data[i].children[j].icon+'</i>';
						}
					}
					ulHtml += '<cite>'+data[i].children[j].title+'</cite></a></dd>';
				}
				ulHtml += "</dl>";
			}else{
				if(data[i].target == "_blank"){
					ulHtml += '<a data-url="'+data[i].href+'" target="'+data[i].target+'">';
				}else{
					ulHtml += '<a data-url="'+data[i].href+'">';
				}
				if(data[i].icon != undefined && data[i].icon != ''){
					if(data[i].icon.indexOf("icon-") != -1){
						ulHtml += '<i class="seraph '+data[i].icon+'" data-icon="'+data[i].icon+'"></i>';
					}else{
						ulHtml += '<i class="layui-icon" data-icon="'+data[i].icon+'">'+data[i].icon+'</i>';
					}
				}
				ulHtml += '<cite>'+data[i].title+'</cite></a>';
			}
			ulHtml += '</li>';
		}
		return ulHtml;
	};

	//获取二级菜单数据
	Tab.prototype.render = function() {
		//显示左侧菜单
		var _this = this;
		$(".navBar ul").html(_this.navBar(dataStr)).height($(window).height()-105);
		element.init();  //初始化页面元素
		$(window).resize(function(){
			$(".navBar").height($(window).height()-100);
		})
	};
	//点击窗口切换刷新页面
	Tab.prototype.changeRegresh = function(index){
		$(".clildFrame .layui-tab-item").eq(index).find("iframe")[0].contentWindow.location.reload();
	};
	$("body").on("click","#navBar .layui-nav li:first-child",function () {
		$(".layui-tab-title li:first-child ").show();
	});

	//显示左侧菜单
	//if($(".navBar").html() == ''){
	//	var _this = this;
	//	$(".navBar").html(navBar(navs)).height($(window).height()-230);
	//	element.init();  //初始化页面元素
	//	$(window).resize(function(){
	//		$(".navBar").height($(window).height()-230);
	//	})
	//}

	//参数设置
	Tab.prototype.set = function(option) {
		var _this = this;
		$.extend(true, _this.tabConfig, option);
		return _this;
	};

	//通过title获取lay-id
	Tab.prototype.getLayId = function(title){
		$(".layui-tab-title.top_tab li").each(function(){
			if($(this).find("cite").text() == title){
				layId = $(this).attr("lay-id");
			}
		})
		return layId;
	}
	//通过title判断tab是否存在
	Tab.prototype.hasTab = function(title){
		var tabIndex = -1;
		$(".layui-tab-title.top_tab li").each(function(){
			if($(this).find("cite").text() == title){
				tabIndex = 1;
			}
		})
		return tabIndex;
	}

	//右侧内容tab操作
	var tabIdIndex = 0;
	Tab.prototype.tabAdd = function(_this){
		var that = this;
		var tabFilter = that.tabConfig.tabFilter;
		if(_this.attr("target") == "_blank"){
			window.open(_this.attr("data-url"));
		}else if(_this.attr("data-url") != undefined){
			var title = '';
			if(_this.find("i.seraph,i.layui-icon").attr("data-icon") != undefined){
				if(_this.find("i.seraph").attr("data-icon") != undefined){
					title += '<i class="seraph '+_this.find("i.seraph").attr("data-icon")+'"></i>';
				}else{
					title += '<i class="layui-icon">'+_this.find("i.layui-icon").attr("data-icon")+'</i>';
				}
			}
			//已打开的窗口中不存在
			if(that.hasTab(_this.find("cite").text()) == -1 && _this.siblings("dl.layui-nav-child").length == 0){
				tabIdIndex++;
				title += '<cite>'+_this.find("cite").text()+'</cite>';
				title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="'+tabIdIndex+'">&#x1006;</i>';
				element.tabAdd(tabFilter, {
					title : title,
					content :"<iframe src='"+_this.attr("data-url")+"' data-id='"+tabIdIndex+"'></frame>",
					id : new Date().getTime()
				});
				element.tabChange(tabFilter, that.getLayId(_this.find("cite").text()));
			}else{
				//当前窗口内容
				that.changeRegresh(_this.parent('.layui-nav-item').index());
				element.tabChange(tabFilter, that.getLayId(_this.find("cite").text()));
			}
		}
	};
	var bodyTab = new Tab();

	exports("bodyTab",function(option){
		return bodyTab.set(option);
	});
	//var tabIdIndex = 0;
	//Tab.prototype.tabAdd = function(_this){
	//	if(window.sessionStorage.getItem("menu")){
	//		menu = JSON.parse(window.sessionStorage.getItem("menu"));
	//	}
	//	var that = this;
	//	var closed = that.tabConfig.closed,
	//		openTabNum = that.tabConfig.openTabNum;
	//	tabFilter = that.tabConfig.tabFilter;
	//	// $(".layui-nav .layui-nav-item a").on("click",function(){
	//	if(_this.find("i.iconfont,i.layui-icon").attr("data-icon") != undefined){
	//		var title = '';
	//		if(that.hasTab(_this.find("cite").text()) == -1 && _this.siblings("dl.layui-nav-child").length == 0){
	//			if($(".layui-tab-title.top_tab li").length == openTabNum){
	//				layer.msg('只能同时打开'+openTabNum+'个选项卡哦。不然系统会卡的！');
	//				return;
	//			}
	//			tabIdIndex++;
	//			if(_this.find("i.iconfont").attr("data-icon") != undefined){
	//				title += '<i class="iconfont '+_this.find("i.iconfont").attr("data-icon")+'"></i>';
	//			}else{
	//				title += '<i class="layui-icon">'+_this.find("i.layui-icon").attr("data-icon")+'</i>';
	//			}
	//			title += '<cite>'+_this.find("cite").text()+'</cite>';
	//			title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="'+tabIdIndex+'">&#x1006;</i>';
	//			element.tabAdd(tabFilter, {
	//				title : title,
	//				content :"<iframe src='"+_this.attr("data-url")+"' data-id='"+tabIdIndex+"'></frame>",
	//				id : new Date().getTime()
	//			})
    //
	//			//当前窗口内容
	//			var curmenu = {
	//				"icon" : _this.find("i.iconfont").attr("data-icon")!=undefined ? _this.find("i.iconfont").attr("data-icon") : _this.find("i.layui-icon").attr("data-icon"),
	//				"title" : _this.find("cite").text(),
	//				"href" : _this.attr("data-url"),
	//				"layId" : new Date().getTime()
	//			}
	//			menu.push(curmenu);
	//			window.sessionStorage.setItem("menu",JSON.stringify(menu)); //打开的窗口
	//			window.sessionStorage.setItem("curmenu",JSON.stringify(curmenu));  //当前的窗口
	//			element.tabChange(tabFilter, that.getLayId(_this.find("cite").text()));
	//		}else{
	//			//当前窗口内容
	//			var curmenu = {
	//				"icon" : _this.find("i.iconfont").attr("data-icon")!=undefined ? _this.find("i.iconfont").attr("data-icon") : _this.find("i.layui-icon").attr("data-icon"),
	//				"title" : _this.find("cite").text(),
	//				"href" : _this.attr("data-url"),
	//				"layId" : new Date().getTime()
	//			}
	//			window.sessionStorage.setItem("curmenu",JSON.stringify(curmenu));  //当前的窗口
	//			element.tabChange(tabFilter, that.getLayId(_this.find("cite").text()));
	//		}
	//	}
	//	// })
	//}
	//$("body").on("click",".top_tab li",function(){
	//	//切换后获取当前窗口的内容
	//	var curmenu = '';
	//	var menu = JSON.parse(window.sessionStorage.getItem("menu"));
	//	curmenu = menu[$(this).index()-1];
	//	if($(this).index() == 0){
	//		window.sessionStorage.setItem("curmenu",'');
	//	}else{
	//		window.sessionStorage.setItem("curmenu",JSON.stringify(curmenu));
	//		if(window.sessionStorage.getItem("curmenu") == "undefined"){
	//			//如果删除的不是当前选中的tab,则将curmenu设置成当前选中的tab
	//			if(curNav != JSON.stringify(delMenu)){
	//				window.sessionStorage.setItem("curmenu",curNav);
	//			}else{
	//				window.sessionStorage.setItem("curmenu",JSON.stringify(menu[liIndex-1]));
	//			}
	//		}
	//	}
	//	element.tabChange(tabFilter,$(this).attr("lay-id")).init();
	//})
    //
	////删除tab
	//$("body").on("click",".top_tab li i.layui-tab-close",function(){
	//	//删除tab后重置session中的menu和curmenu
	//	liIndex = $(this).parent("li").index();
	//	var menu = JSON.parse(window.sessionStorage.getItem("menu"));
	//	//获取被删除元素
	//	delMenu = menu[liIndex-1];
	//	var curmenu = window.sessionStorage.getItem("curmenu")=="undefined" ? "undefined" : window.sessionStorage.getItem("curmenu")=="" ? '' : JSON.parse(window.sessionStorage.getItem("curmenu"));
	//	if(JSON.stringify(curmenu) != JSON.stringify(menu[liIndex-1])){  //如果删除的不是当前选中的tab
	//		// window.sessionStorage.setItem("curmenu",JSON.stringify(curmenu));
	//		curNav = JSON.stringify(curmenu);
	//	}else{
	//		if($(this).parent("li").length > liIndex){
	//			window.sessionStorage.setItem("curmenu",curmenu);
	//			curNav = curmenu;
	//		}else{
	//			window.sessionStorage.setItem("curmenu",JSON.stringify(menu[liIndex-1]));
	//			curNav = JSON.stringify(menu[liIndex-1]);
	//		}
	//	}
	//	menu.splice((liIndex-1), 1);
	//	window.sessionStorage.setItem("menu",JSON.stringify(menu));
	//	element.tabDelete("bodyTab",$(this).parent("li").attr("lay-id")).init();
	//})
    //
	//var bodyTab = new Tab();
	//exports("bodyTab",function(option){
	//	return bodyTab.set(option);
	//});
});