$(function () {
  // 1.一进入发送ajax请求进行渲染一级分类，和第一个一级分类下的二级分类数据
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    dataType: 'json',
    success: function (res) {
      console.log(res);
      // 根据获取的数据进行页面渲染
      var htmlStr = template("firstCagegoryTpl", res);
      $(".content_left ul").html(htmlStr);
      // 显示第一个一级分类下的二级数据
      var id = res.rows[0].id;
      renderTwoCategoryById(id);
    }
  })

  function renderTwoCategoryById(id) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        var htmlStr = template("twoCategory", res);
        $(".content_right ul").html(htmlStr);
        if (res.rows.length === 0){
          $(".content_right ul").append("<p style='padding-top:5px;padding-left:5px'>没有更多分类信息了</p>")
        }
      }
    })
  }

  // 2.点击一级分类根据一级分类id渲染二级分类
  $(".content_left ul").on("click", 'a', function () {
    $(this).addClass("current");
    $(this).parent('li').siblings('li').find('a').removeClass('current');
    var id = $(this).data('id');
    renderTwoCategoryById(id);

  })
})