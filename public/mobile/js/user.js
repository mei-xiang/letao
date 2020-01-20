$(function () {
  // 一进入页面，发送请求进行渲染
  $.ajax({
    type: 'get',
    url: '/user/queryUserMessage',
    dataType: 'json',
    success: function (res) {
      console.log(res)
      // 未登录
      if (res.error === 400) {
        location.href = "login.html";
      }
      // 登录成功
      // 进行模板渲染
      var htmlStr = template("userTpl", res);
      $(".mui-table-view").html(htmlStr);
    }
  })

  // 点击退出
  $(".btn-logout").on("click", function () {
    $.ajax({
      type: 'get',
      url: '/user/logout',
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if(res.success){
          location.href = "./login.html";
        }
      }
    })

  })

})