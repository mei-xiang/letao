$(function () {
  // cookie与localStorage和sessionStorage的区别
  // cookie:
  // 1.在本地存储，最多为4kb
  // 2.为会话级别的，浏览器关闭数据销毁，可以设置过期时间
  // 3.同一个浏览器下的cookie可以进行数共享
  // 4.不同浏览器之间的cookie不能进行数据共享
  // 5.请求时，请求头会携带cookie
  // 6.不能直接操作cookie。在请求时，请求头会携带cookie。响应时响应头中设置set-cookie为sessionid
  // localStorage:
  // 1.数据最多可以存储5MB
  // 2.浏览器关闭数据不会删除，除非手动删除
  // 3.多个页面下数据可以共享
  // sessionStorage:
  // 1.数据最多可以存储5MB
  // 2.浏览器关闭数据删除
  // 3.多个页面下数据不可以共享

  // 1.一进入页面，获取本地存储的数据进行数据渲染
  var historyStr = localStorage.getItem('search_list') || '[]';
  //将数据解析成数组
  var historyArr = JSON.parse(historyStr);
  // 通过模板引擎进行数据渲染
  var htmlStr = template("historyTpl", {
    arr: historyArr
  });
  $(".history").html(htmlStr);

  // 2.点击搜索按钮，将文本框的值添加到本地存储中，进行数据渲染
  $(".search_right").on("click", function () {
    // 获取文本框的值
    var value = $(".search_left").val().trim();
    if (!value) {
      mui.toast("请输入关键字");
      return;
    }
    // 将数据存到本地储存当中
    // 如果文本框的值与本地存储相同，需要把线添加的删掉然后加到最前面
    var index = historyArr.indexOf(value);
    if (index != -1) {
      historyArr.splice(index, 1);
    }
    // 如果存储的数据超过了十个，需要把最后一个删掉
    if (historyArr.length >= 10) {
      historyArr.pop();
    }
    historyArr.unshift(value);
    localStorage.setItem("search_list", JSON.stringify(historyArr));
    var htmlStr = template("historyTpl", { arr: historyArr });
    $(".history").html(htmlStr);
    $(".search_left").val('');

    // 跳到列表页
    location.href = "searchList.html?key=" + value;
  })

  // 3.点击删除图标,删除对应的本地存储数据,进行模板渲染
  $(".history").on("click", 'i', function () {
    historyArr.splice($(this).data('index'), 1);
    localStorage.setItem("search_list", JSON.stringify(historyArr));
    var htmlStr = template("historyTpl", { arr: historyArr });
    $(".history").html(htmlStr);
  })

  // 4.点击按钮,清空数据,进行渲染
  $(".clear_all").on("click", function () {
    var historyArr = [];
    localStorage.removeItem("search_list");
    var htmlStr = template("historyTpl", { arr: historyArr });
    $(".history").html(htmlStr);
  })

})