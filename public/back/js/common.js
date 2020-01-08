$(function () {
  // 发送ajax之前
  $(document).ajaxStart(function () {
    NProgress.start()
  })
  // ajax结束后
  $(document).ajaxStop(function () {
    NProgress.done()
  })

  // 登录拦截
  if (location.href.indexOf("login.html") === -1) {
    $.ajax({
      url: "/employee/checkRootLogin",
      type: "get",
      success: function (info) {
        console.log(info)
        if (info.success) {
          console.log("登陆了");
          // 啥也不用干
        }

        if (info.error === 400) {
          // 进行拦截, 拦截到登录页
          location.href = "login.html";
        }
      }
    })
  }

  // 1.点击分类管理，切换显示和隐藏
  $(".nav li:nth-child(2)").on("click", function () {
    $(".category").stop().slideToggle(500);
  })

  // 2.点击菜单按钮，侧柏男篮显示和隐藏
  $(".icon_menu").on("click", function () {
    $(".lt_aside").toggleClass("now");
    $(".topbar").toggleClass("now");
    $(".lt_main").toggleClass("now");
  })

  // 3.点击退出按钮，进行跳转登录页
  $('.icon_logout').click(function () {
    // 让模态框显示
    $('#logoutModal').modal("show");
  })

  // 4. 在外面注册 logoutBtn 退出按钮, 点击事件
  $('#logoutBtn').click(function () {

    // 访问退出接口, 进行退出
    $.ajax({
      url: "/employee/employeeLogout",
      type: "GET",
      dataType: "json",
      success: function (info) {

        if (info.success) {
          location.href = "login.html"
        }
      }
    })
  })
})