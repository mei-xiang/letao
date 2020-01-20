$(function () {
  // 解析地址栏参数，获取id发送ajax请求进行页面渲染
  var obj = getObjByUrl();
  var id = obj.productId;
  $.ajax({
    type: 'get',
    url: '/product/queryProductDetail',
    dataType: 'json',
    data: {
      id: id
    },
    success: function (res) {
      console.log(res);
      // 拿到数据进行页面的渲染
      var htmlStr = template("productTpl", res);
      $(".mui-scroll").html(htmlStr);

      // 初始化轮播图
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 初始化增减组件
      mui(".mui-numbox").numbox();
    }
  })

  // 点击尺码高亮
  $(".lt_main").on("click", '.lt_size span', function () {
    $(this).addClass("current").siblings("span").removeClass("current");
  })

  // 点击添加购物车按钮，发送ajax存储信息
  $(".add_car").on("click", function () {
    // 产品id
    var productId = id;
    var size = $(".lt_size span.current").text();
    var num = $('[type="number"]').val();
    if (!size) {
      mui.toast("请选择尺码");
      return;
    }
    if (!num) {
      mui.toast("请选择数量");
      return;
    }
    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: productId,
        size: size,
        num: num
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.error === 400) {
          // 表示未登录
          location.href = "login.html?retUrl=" + location.href;
        }
        if (res.success) {
          location.href = "cart.html";
        }
      }
    })
  })
})