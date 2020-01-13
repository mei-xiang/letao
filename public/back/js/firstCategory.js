$(function () {
  var currentPage = 1;
  // 1.页面第一次加载发送请求，进行数据的渲染
  render(currentPage);
  function render(currentPage) {
    $.ajax({
      type: "get",
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage || 1,
        pageSize: 2
      },
      dataType: "json",
      success: function (res) {
        // console.log(res)
        // 获取数据后，进行模板引擎的渲染
        var htmlStr = template("tpl", res);
        $("tbody").html(htmlStr);

        // 2.进行分页的初始化
        $("#mypage").bootstrapPaginator({
          bootstrapMajorVersion: 3, //对应bootstrap的版本
          currentPage: currentPage, //当前页
          totalPages: Math.ceil(res.total / res.size), //总页数
          numberOfPages: 5, //每页按钮的个数
          onPageClicked: function (event, originalEvent, type, page) {
            // console.log(page);
            currentPage = page;
            render(currentPage);
          }
        })
      }
    })
  }

  // 3.点击添加数据按钮，弹出模态框
  $(".btn-add").on("click", function () {
    $("#addModal").modal("show");
  })

  // 4.表单校验
  $("#addForm").bootstrapValidator({
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    // 配置校验字段和规则
    fields: {
      categoryName: {
        // 校验规则
        validators: {
          // 不能为空
          notEmpty: {
            message: "请输入一级分类名称"
          },
          // 字符长度
          stringLength: {
            min: 2,
            max: 6,
            message: "分类名长度必须是2-6位"
          }
          // ,正则
          // regexp: {

          // }
        }
      }
    }
  })

  // 5.校验成功后，触发校验成功事件
  $('#addForm').on('success.form.bv', function (e) {
    e.preventDefault(); // 阻止默认的提交
    // 6.发送ajax进行数据的请求和渲染
    $.ajax({
      type: "post",
      url: '/category/addTopCategory',
      data: $("#addForm").serialize(),
      dataType: 'json',
      success: function(res){
        //数据进行重新渲染
        render(currentPage); 
        // 关闭模态框
        $("#addModal").modal("hide");
        // 表单数据重置
        $("#addForm").data("bootstrapValidator").resetForm(true);
      }
    })
  })

  // 6.点击取消按钮进行表单数据重置
  $(".btn-reset").on("click",function(){
    $("#addForm").data("bootstrapValidator").resetForm(true);
  })

})
