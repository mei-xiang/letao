$(function () {

  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: {
        proName: $(".search input").val(),
        page: 1,
        pageSize: 100
      },
      beforeSend: function () {
        $('.lt_product ul').html('<div class="loading"></div>');
        $('.loading').show();
      },
      success: function (res) {
        setTimeout(function () {
          console.log(res);
          var htmlStr = template("productTpl", res);
          $(".lt_product ul").html(htmlStr);
          $(".loading").hide();
        }, 500)
      }
    })
  }
  // 1.已进入页面,解析地址栏的键值,将值赋值给文本框,并发送请求进行页面渲染
  var obj = getObjByUrl();
  $(".search input").val(obj.key);
  // 发送ajax请求得到数据,进行页面渲染
  render();

  // 2.点击搜索,根据文本框的值,发送ajax得到数据进行页面数据渲染
  $(".search_right").on("click", function () {
    var txt = $(".search input").val().trim();
    if (!txt) {
      mui.toast("请输入关键字");
      return;
    }
    // 根据输入的值发送ajax
    render();
    // 将值存储到本地存储当中
    var histortStr = localStorage.getItem("search_list");
    var histortArr = JSON.parse(histortStr);
    // 如果输入的值与本地存储有重复,将重复的删掉,然后添加都最前面
    var index = histortArr.indexOf(txt);
    if (index != -1) {
      histortArr.splice(index, 1);
    }
    // 如果大于10条,将最后一条删除
    if (histortArr.length >= 10) {
      histortArr.pop();
    }
    histortArr.unshift(txt);
    localStorage.setItem("search_list", JSON.stringify(histortArr));
  })

  // 3.根据高亮和箭头的指向,判断谁做排序,发送ajax请求进行页面渲染
  // 高亮的元素做排序,箭头的指向做升序或者降序
  $(".lt_sort a").on("click", function () {
    // 判断是否有高亮这个类,有的话切换箭头指向;没有高亮这个类,当前高亮其他的移除
    if ($(this).hasClass('current')) {
      if ($(this).find('i').hasClass("fa fa-angle-down")) {
        $(this).find('i').removeClass("fa fa-angle-down").addClass("fa fa-angle-up");
      } else {
        $(this).find('i').removeClass("fa fa-angle-up").addClass("fa fa-angle-down")
      }
    } else {
      $(this).addClass("current").siblings('a').removeClass("current");
    }
    // 找到对应高亮的元素是谁--做排序
    var sort = $(".lt_sort a.current").data("sort");
    // console.log(sort);
    // 根据对应高亮元素的箭头指向找到是升序还是降序  1--升序   2--降序
    var order = $(".lt_sort a.current").find('i').hasClass("fa-angle-down") ? 2 : 1;
    // console.log(order);
    var params = {};
    params.proName = $(".search input").val();
    params.page = 1;
    params.pageSize = 100;
    params[sort] = order;
    console.log(params);
    // 发送ajax获取数据进行渲染
    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: params,
      beforeSend: function () {
        // 发送请求前做动画
        $('.lt_product ul').html('<div class="loading"></div>');
        $('.loading').show();
      },
      success: function (res) {
        setTimeout(function () {
          console.log(res);
          var htmlStr = template("productTpl", res);
          $(".lt_product ul").html(htmlStr);
          // 请求完成动画结束
          $(".loading").hide();
        },500)
      }
    })
  })

})