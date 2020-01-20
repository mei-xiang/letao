$(function () {

  var currentPage = 1;
  var pageSize = 2;
  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: {
        proName: $(".search input").val(),
        page: currentPage,
        pageSize: pageSize
      },
      beforeSend: function () {
        // $('.lt_product ul').html('<div class="loading"></div>');
      },
      success: function (res) {
        setTimeout(function () {
          console.log(res);
          var htmlStr = template("productTpl", res);
          $(".lt_product ul").html(htmlStr);
          // $(".loading").hide();
        }, 500)
      }
    })
  }

  // 4.下拉刷新和上拉加载
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
          // 发送请求拿到数据进行页面渲染
          currentPage = 1;
          $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: {
              proName: $(".search input").val(),
              page: currentPage,
              pageSize: pageSize
            },
            success: function (res) {
              console.log(res);
              var htmlStr = template("productTpl", res);
              $(".lt_product ul").html(htmlStr);
              // 数据渲染完毕，结束下拉刷新
              mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

              // 第一页数据被重新加载之后, 又有数据可以进行上拉加载了, 需要启用上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh(true);
            }
          })
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up: {
        callback: function () {
          // 下拉一次当前页+1，发送请求获取数据，进行渲染
          currentPage++;
          var sort = $(".lt_sort a.current").data("sort");
          // console.log(sort);
          // 根据对应高亮元素的箭头指向找到是升序还是降序  1--升序   2--降序
          var order = $(".lt_sort a.current").find('i').hasClass("fa-angle-down") ? 2 : 1;
          var params = {};
          params.proName = $(".search input").val();
          params.page = currentPage;
          params.pageSize = pageSize;
          params[sort] = order;
          console.log(params);
          // 发送ajax获取数据进行渲染
          $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: params,
            success: function (res) {
              console.log(res);
              var htmlStr = template("productTpl", res);
              $(".lt_product ul").append(htmlStr);
              if (res.data.length === 0) {
                // 没有更多数据了, 显示提示语句
                mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
              }
              else {
                // 还有数据, 正常结束上拉加载
                mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(false);
              }
            }
          })
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

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
    currentPage = 1;
    render();
    // 当页面上拉时出现没有更多数据了，上拉功能会被禁用。需要手动添加插件重置/启用方法
    mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
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
  $(".lt_sort a").on("tap", function () {
    currentPage = 1;
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
    params.page = currentPage;
    params.pageSize = pageSize;
    params[sort] = order;
    console.log(params);
    // 发送ajax获取数据进行渲染
    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: params,
      beforeSend: function () {
        // 发送请求前做动画
        // $('.lt_product ul').html('<div class="loading"></div>');
      },
      success: function (res) {
        setTimeout(function () {
          console.log(res);
          var htmlStr = template("productTpl", res);
          $(".lt_product ul").html(htmlStr);
          // 当数据到了最后一页，会显示没有更多数据，上拉加载方法会被禁用。需要手动重置/启用插件的上拉加载方法。或者直接点击排序直接调用mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();下拉刷新方法
          mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
          // 请求完成动画结束
          // $(".loading").hide();
        }, 500)
      }
    })
  })

  // 5.点击a标签，跳到商品详情页

})