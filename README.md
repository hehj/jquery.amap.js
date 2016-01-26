# JQuqey Amap

@(Hehangjie)[互联网中尉 www.itlieutenant.com]

[TOC]


#### Summary
在Web项中使用到高德地图。于是基于Jquery插件的语法，封装高德地图为控件。

#### Demo

* 首先在页面（htm或jsp）上定义一个DIV

`<div id="your_div_id"></div>`

* 其次在<script>...</script>中实例化

`$("#your_div_id").amap();`

#### 地图插件中实现了

1. 地理位置的模糊查询
2. 标志地图，并获取经纬度

####想要获取经纬度，需要传入你接收的经纬度的input id

#####html 代码
``` html
<div id="which_tip">`

   LNG:<input type="text" id="yjcun_goods_lng" size=8/>`

   LAT:<input type="text" id="yjcun_goods_lat" size=8/>`

</div>
``` 
#####javascript 代码
``` javascript
$('#mapContainer').amap({
		width : '500px',
		height : '500px',
		lngInputId : "yjcun_goods_lng",
		latInputId : "yjcun_goods_lat",
});
``` 
width,height等是可以自定义的，还有很多参数可以。可以参看init方法里的
``` javascript
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
``` 

#### 交流与建议
hehangjie@gmail.com


