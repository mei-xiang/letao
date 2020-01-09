$(function () {
  var currentPage = 1;
  var id;
  var isDelete;

  // 页面加载时发送请求获取数据
  render(currentPage);
  function render() {
    $.ajax({
      type: "get",
      url: '/user/queryUser',
      data: {
        page: currentPage || 1,
        pageSize: 5
      },
      dataType: "json",
      success: function (res) {
        console.log(res);
        // 拿到数据进行页面的渲染
        var htmlStr = template("tpl", res);
        // console.log(htmlStr);
        $("tbody").html(htmlStr);

        //分页组件的渲染
        $("#page").bootstrapPaginator({
          bootstrapMajorVersion: 3, //对应的bootstrap版本
          currentPage: currentPage, //当前页数
          totalPages: Math.ceil(res.total / res.size), //总页数
          shouldShowPage: true,//是否显示该按钮
          // useBootstrapTooltip: true,
          //点击事件
          onPageClicked: function (event, originalEvent, type, page) {
            currentPage = page;
            // 业务处理
            render(currentPage);
          }
        });

      }
    })
  }

  // 点击按钮，弹出模态框
  $("tbody").on("click", ".btn", function () {
    $("#statusModal").modal("show");
    id = $(this).parent("td").data("id");
    isDelete = $(this).hasClass("btn-danger") ? "0" : "1";
    console.log(id,isDelete);
  })

  // 点击确认按钮，发送ajax请求修改状态数据,关闭模态框，重新渲染数据
  $("#statusBtn").on("click", function () {
    $.ajax({
      url: "/user/updateUser",
      type: "post",
      data: {
        id: id,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (res) {
        console.log(res);
        $("#statusModal").modal("hide");
        render(currentPage);
      }
    })
  })
})