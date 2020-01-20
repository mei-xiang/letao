$(function () {

  $(".btn-login").on("click", function () {
    var username = $('#username').val().trim();
    var password = $('#password').val().trim();
    if (!username) {
      mui.toast("请输入用户名");
      return;
    }
    if (!password) {
      mui.toast("请输入密码");
      return;
    }
    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function (res) {
        if (res.error === 403) {
          mui.toast("用户名或者密码错误");
        }
        if (res.success) {
          // 从购物车条过来的
          if (location.href.indexOf("retUrl") != -1){
            var retUrl = location.search;
            retUrl = retUrl.replace("?retUrl=","");
            location.href = retUrl;
          }else{
            location.href = "user.html";
          }
        }
      }
    })
  })
})