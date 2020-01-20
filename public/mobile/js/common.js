$(function () {
  // 轮播图初始化
  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
  });

  // 区域滚动初始化
  mui('.mui-scroll-wrapper').scroll({
    scrollY: true, //是否竖向滚动
    scrollX: false, //是否横向滚动
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
    bounce: true //是否启用回弹
  });
  
})

// 根据url地址解析得到对象  params: ?key=1&name=pp
function getObjByUrl() {
  var obj = {};
  var strUrl = decodeURI(location.search); //?key=1&name=pp
  strUrl = strUrl.slice(1); //key=1&name=pp
  var arr = strUrl.split("&"); //[key=1,name=pp]
  arr.forEach(function (v, i) {
    var key = v.split("=")[0];
    var value = v.split("=")[1];
    obj[key] = value;
  })
  return obj;
}