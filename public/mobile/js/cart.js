$(function () {
  // var currentPage = 1;
  // var size = 2;

  // 1.一进入页面发送请求，进行渲染
  render(function (res) {
    var htmlStr = template("cartTpl", {
      item: res
    });
    $(".cart_box").html(htmlStr);
  });
  function render(callback) {
    $.ajax({
      type: 'get',
      url: '/cart/queryCart',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        if (res.error === 400) {
          // 未登录，跳到登录页
          location.href = "login.html?retUrl=" + location.href;
        } else {
          // 登录成功
          // 结核模板引擎进行数据渲染
          callback && callback(res);
        }
      }
    })
  }
  // 2.下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50,//可选,默认50.触发下拉刷新拖动距离,
        auto: false,//可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: function () {
          render(function (res) {
            var htmlStr = template("cartTpl", {
              item: res
            });
            $(".cart_box").html(htmlStr);
            // 数据拿到后，结束下拉刷新
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
          });
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
      // ,up : { // 下拉加载是当前页+1，并且是在原数据是追加append。这里接口灭有分页实现不了上拉加载
      //   height:50,//可选.默认50.触发上拉加载拖动距离
      //   auto:false,//可选,默认false.自动上拉加载一次
      //   contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
      //   contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
      //   callback :function(){

      //   } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      // }
    }
  });

  // 3.点击删除按钮，发送请求删除数据，重新渲染
  $(".lt_main").on("tap", '.btn_del', function () {
    var id = $(this).data('id');
    $.ajax({
      type: 'get',
      url: '/cart/deleteCart',
      data: {
        id: id
      },
      dataType: 'json',
      success: function (res) {
        if (res.success) {
          render(function (res) {
            var htmlStr = template("cartTpl", {
              item: res
            });
            $(".cart_box").html(htmlStr);
          });
        }
      }
    })
  })

  // 4.点击修改按钮,进行尺码和数量的渲染，发送请求，重新渲染数据
  $(".lt_main").on("tap", '.btn_edit', function () {
    // 使用H5提供的获取自定义属性  对象.dataset 可以获取对象
    var obj = this.dataset;
    console.log(obj);
    var htmlStr = template("editTpl", obj);
    // mui框架在使用模板时会自动将/n转成br，需要手动清除
    htmlStr = htmlStr.replace(/\n/g, "");
    mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function (e) {
      if (e.index === 0) {
        // alert("确认");
        // 获取id size num 发送ajax请求修改数据，页面重新渲染
        var id = $(this).data('id');
        var size = $(".lt_size span.current").text();
        var num = $(".lt_num .mui-numbox-input").val();
        $.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: "json",
          success: function(res){
            console.log(res);
            if(res.success){
              render(function(res){
                var htmlStr = template("cartTpl", {
                  item: res
                });
                $(".cart_box").html(htmlStr);
              });
            }
          }
        })
      }
      if (e.index === 1) {
        // alert("取消");
      }
    }.bind(this));
    // 初始化数字输入框组件
    mui(".mui-numbox").numbox();
  })

  // 5.注册span的点击事件
  $("body").on("click",".lt_size span",function(){
    $(this).addClass("current").siblings().removeClass("current");
  })
})