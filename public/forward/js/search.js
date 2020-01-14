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

  // 1.一进入页面，获取本地存储localStorage中的serch_list的数据
  var historyStr = localStorage.getItem("search_list") || '[]';
  // 将获取的数据转成数组
  var historyArr = JSON.parse(historyStr);
  // 通过模板引擎进行渲染
  var htmlStr = template("searchTpl", { arr: historyArr });
  $(".history").html(htmlStr);

  // 2.点击搜索按钮将数据存储在localStorage中，并且重新渲染数据
  $(".search_right").on("click", function () {
    // 获取文本框的值
    var value = $(".search_left").val().trim()
    if (!value) return;
    // 要求1：要是文本框的值与记录的值有相同的，将记录中删除，然后添加到最前面
    var index = historyArr.indexOf(value);
    if (index !== -1) {
      // 表示找到了相同的值
      historyArr.splice(index, 1);
    }
    // 要求2：要是记录的值大于10条，多余的删除
    if (historyArr.length >= 10) {
      historyArr.pop();
    }

    // 将获取的值存在数组中
    historyArr.unshift(value);
    // 将数据存在localStorage中
    localStorage.setItem('search_list', JSON.stringify(historyArr));
    // 通过模板引擎进行数据渲染
    var htmlStr = template("searchTpl", { arr: historyArr });
    $(".history").html(htmlStr);
    $(".search_left").val("");
  })

  // 3.点击删除按钮删除单条数据
  $(".history").on("click", '.clear', function () {
    // 删除存储的那一项，在进行页面渲染
    historyArr.splice($(this).data('index'), 1);
    localStorage.setItem('search_list', JSON.stringify(historyArr));
    var htmlStr = template("searchTpl", { arr: historyArr });
    $(".history").html(htmlStr);
  })

  // 4.点击清空记录，删除全部数据
  $(".history").on("click", '.clear_all', function () {
    historyArr = [];
    localStorage.removeItem("search_list");
    var htmlStr = template("searchTpl", { arr: historyArr });
    $(".history").html(htmlStr);
  })

})