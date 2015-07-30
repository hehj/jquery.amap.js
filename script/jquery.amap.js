/**
 * imagebox - jQuery plugins
 * 
 * Copyright 2015 hehangjie [ hehangjie@hotmail.com ]
 * 
 * Dependencies: 高德地图 
 */
(function($) {
	//Enter 
	$.fn.amap = function(method) {
			
		var methods = {
			/**
			| 默认方法 $.fn.amap();
			*/
			init : function(properties) {

				var defaultPorperties = {
					lng : 116.397428,
					lat : 39.90923,
					width : '300px',
					height : '300px',
					top : 0,
					left : 0,
					right : 0,
					bottom : 0,
					tips : {
						size:30,
					}
				};

				var args = $.extend(defaultPorperties, $.fn.amap.defaults, properties);
				$.fn.amap.defaults.lngInputId = properties.lngInputId;
				$.fn.amap.defaults.latInputId = properties.latInputId;

				//地理位置模糊查询输入区域
				$(this).amap("tips",args.tips);

				//预建装载地图的DIV,ID=map_content
				$(this).append("<div id='map_content'></div>");

				$(this).css("position","absolute");
				//写入DIV样式
				_G('map_content').css("width", args.width);
				_G('map_content').css("height", args.height);
				_G('map_content').css("position", 'absolute');
				_G('map_content').css("z-index", 1);
				_G('map_content').css("top", args.top);
				_G('map_content').css("left", args.left);
				_G('map_content').css("right", args.right);
				_G('map_content').css("left", args.left);

				//创建地图到DIV
				var map = new AMap.Map('map_content', {
					resizeEnable: true,
					//二维地图显示视口
					view: new AMap.View2D({
						center:new AMap.LngLat(args.lng,args.lat),//地图中心点
						zoom:12 //地图显示的缩放级别
					})
				});

				//为地图注册click事件获取鼠标点击出的经纬度坐标
				var clickEventListener = AMap.event.addListener(map,'click',function(e){
					$.fn.amap.addmarker(0, e.lnglat.getLng(), e.lnglat.getLat());
				});

				//把私有的map开放到外部
				$.fn.amap.defaults.map = map;

			},
			/**
			| $.fn.amap("tips");
			| 
			| 地理位置模糊查询输入区域
			| 输入框长度size可调节
			*/
			tips : function(properties){

				var defaultPorperties = {
					size : 30,
					paddingTop : '10px',
					paddingLeft : '10px'
				};

				var args = $.extend(defaultPorperties, properties);

				var html = '<div id="map_tip">';
				html += '<input type="text" id="map_tip_keyword" name="keyword" size='+args.size+' onkeyup="$.fn.amap.keydown(event)"/>';
	   			html += '<div id="map_tip_temp" name="temp"></div>';
	    		html += '<div id="map_tip_result"></div>';
	    		html += '</div>';

	    		$(this).append(html);

				_G('map_tip').css("position", 'absolute');
				_G('map_tip').css("z-index", 2);
				_G('map_tip').css("padding-top", args.paddingTop);
				_G('map_tip').css("padding-left", args.paddingLeft);

				_G('map_tip_temp').css("background-color", "#fff");
			}

		};
		
		/**
		| 方法入口
		*/
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method + 'does not exist on juery.map');
		}

	};
	/**
	| 开放给外部的参数
	| lngInputId=外部接收lng的input id
	| latInputId=外部接收lat的input id
	*/
	$.fn.amap.defaults = {
		lngInputId : null,
		latInputId : null,
		map : {},
		marker : null,
	};

	/**
	| 开放给外部的function
	**/

	$.fn.amap.keydown = function (event){
		
	    var key = (event || window.event).keyCode;
	    var result = document.getElementById("map_tip_temp");
	    var cur = result.curSelect;
	   
	    autoSearch();
	}

	//鼠标移入时样式
	$.fn.amap.openMarkerTipById = function (pointid, thiss) {  
	    thiss.style.background = '#CAE1FF';
	}
	//鼠标移开后样式恢复
	$.fn.amap.onmouseout_MarkerStyle = function (pointid, thiss) {  
	    thiss.style.background = "";
	}
	//选择输入提示关键字
	$.fn.amap.selectResult = function (index) {
	    if (navigator.userAgent.indexOf("MSIE") > 0) {
	        $("#map_tip_keyword").onpropertychange = null;
	        $("#map_tip_keyword").onfocus = focus_callback;
	    }
	    //截取输入提示的关键字部分
	    var text_header = $("#divid" + (index + 1) +" span").html();
	 	var text = $("#divid" + (index + 1)).html().replace(/<[^>].*?>.*<\/[^>].*?>/g,"");
	 	//alert(text_header + "-" + text);
	    
	    $("#map_tip_keyword").val(text);
	    $("#map_tip_temp").css("display","none");
	    geocoder(text_header+text);
	}

	//在地图上标记位置
	$.fn.amap.addmarker = function (i, lngX, latY) {

	    var markerOption = {
	        map:$.fn.amap.defaults.map,  //将点添加到地图               
	        icon:"http://webapi.amap.com/images/"+(i)+".png",  
	        position:new AMap.LngLat(lngX, latY),
	        animation:"AMAP_ANIMATION_DROP" //AMAP_ANIMATION_NONE,AMAP_ANIMATION_DROP,AMAP_ANIMATION_BOUNCE
	    };         
	    $.fn.amap.defaults.map.clearMap();
	    $.fn.amap.defaults.marker = new AMap.Marker(markerOption);
	     $.fn.amap.defaults.map.setFitView();  
	    _G($.fn.amap.defaults.lngInputId).val(lngX);
	    _G($.fn.amap.defaults.latInputId).val(latY);
	}

	/**
	| 内部function
	*/
	//地理逆编码入口
	function geocoder(text) {
	    var MGeocoder;
	    //加载地理编码插件
	    AMap.service(["AMap.Geocoder"], function() {        
	        MGeocoder = new AMap.Geocoder({ 
	            city:""
	        });
	        //返回地理编码结果  
	        //地理编码
	        MGeocoder.getLocation(text, function(status, result){
	        	if(status === 'complete' && result.info === 'OK'){
	        		geocoder_CallBack(result);
	        	}
	        });
	    });
	}  

	function _G(id){
		return $("#"+id);
	}

	function autoSearch() {
	    var keywords = $("#map_tip_keyword").val();
	    var auto;
	    //加载输入提示插件
	        $.fn.amap.defaults.map.plugin(["AMap.Autocomplete"], function() {
	        var autoOptions = {
	            city: "" //城市，默认全国
	        };
	        auto = new AMap.Autocomplete(autoOptions);
	        //查询成功时返回查询结果
	        if ( keywords.length > 0) {
	            AMap.event.addListener(auto,"complete",autocomplete_CallBack);
	            auto.search(keywords);
	        }
	        else {
	            $("#map_tip_temp").css("display","none");
	        }
	    });
	}

	function autocomplete_CallBack(data) {
	    var resultStr = "";
	    var tipArr = data.tips;
	    //var len=tipArr.length;
	    if (tipArr&&tipArr.length>0) {                 
	        for (var i = 0; i < tipArr.length; i++) {
	            resultStr += "<div id='divid" + (i + 1) + "' onmouseover='$.fn.amap.openMarkerTipById(" + (i + 1)
	                        + ",this)' onclick='$.fn.amap.selectResult(" + i + ")' onmouseout='$.fn.amap.onmouseout_MarkerStyle(" + (i + 1)
	                        + ",this)' style=\"font-size: 13px;cursor:pointer;padding:5px 5px 5px 5px;\">" + tipArr[i].name + "<span style='color:#C1C1C1;'>"+ tipArr[i].district + "</span></div>";
	        }
	    }
	    else  {
	        resultStr = " π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字";
	    }
	
	    $("#map_tip_temp").attr("curSelect",-1);
	    $("#map_tip_temp").attr("tipArr",tipArr);
	    $("#map_tip_temp").html(resultStr);
	    $("#map_tip_temp").css("display","block");
	}
	  
	function focus_callback() {
	        if (navigator.userAgent.indexOf("MSIE") > 0) {
	        $("#map_tip_keyword").onpropertychange = autoSearch;
	    }
	}

	//地理编码返回结果展示   
	function geocoder_CallBack(data){ 
	    $.fn.amap.addmarker(0, data.geocodes[0].location.lng, data.geocodes[0].location.lat);
	}  

})(jQuery);