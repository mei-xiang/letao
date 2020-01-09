$(function () {

  var currentPage = 1;
  // 1.已进入页面发送ajax获取数据进行页面渲染，分页组件的渲染
  render(currentPage);
  function render(currentPage) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage || 1,
        pageSize: 2
      },
      dataType: 'json',
      success: function (res) {
        console.log(res);
        // 模板与数据进行渲染
        var htmlStr = template("twoTpl", res);
        $("tbody").html(htmlStr);

        // 分页组件的渲染
        $("#page").bootstrapPaginator({
          bootstrapMajorVersion: 3, //分页结构对应的bootstrap版本
          currentPage: currentPage, //当前页
          totalPages: Math.ceil(res.total / res.size), //总页数
          onPageClicked: function (event, originalEvent, type, page) {
            currentPage = page;
            render(currentPage);
          }
        })
      }
    })
  }

  // 2.点击添加按钮，弹出模态框，一级分类进行渲染
  $(".add-btn").on("click", function () {
    $("#addCategory").modal("show");
    // 发送ajax请求进行一级分类的渲染
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (res) {
        // 进行模板数据渲染
        var htmlStr = template("oneCategoryTpl", res);
        $(".firstCategory").html(htmlStr);
      }
    })
  })

  // 3.给每个一级分类注册点击事件,将值赋值给按钮,并且将值页赋值给隐藏文本域 
  $(".firstCategory").on("click", "li", function () {
    $(".dropdownText").text($(this).text());

    var id = $(this).data("id");
    console.log(id)
    // 将值复制给隐藏文本域
    $('[name="categoryId"]').val(id);
    // 因为文本域不能监听状态,需要手动设置
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })

  // 4.图片上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
    }
  });
  $("#fileupload").fileupload({
    dataType: 'json',
    // e: 事件对象
    // data: 图片上传后返回的对象
    done: function (e, data) {
      console.log(data);
      $(".uploadImg").attr("src", data.result.picAddr);

      // 将文件路径赋值给隐藏文本域
      $('[name="brandLogo"]').val(data.result.picAddr);

      // 因为表单校验中,隐藏于不能监听状态的变化,需要手动修改
      $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  })

  // 5.表单校验
  // 注意隐藏域表单和禁用的表单等 不能够监听状态的变化,需要手动设置 $("").data("bootstrapValidator").updateStatus("字段名","校验状态","校验规则")
  $("#form").bootstrapValidator({
    // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    // 配置校验字段
    fields: {
      // 品牌名称
      brandName: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      // 一级分类的id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      // 图片的地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })

  // 6.校验完成,触发校验成功事件
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();

    // 发送ajax请求,进行数据的持久化
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $("#form").serialize(),
      dataType: 'json',
      success: function (res) {
        if (res.success) {
          // 关闭模态框
          $("#addCategory").modal("hide");

          // 进行表单的重置
          $("#form").data("bootstrapValidator").resetForm(true);

          // 页面重新渲染
          currentPage = 1;
          render(currentPage);

          // 文本内容和图片重置
          $('#dropdownText').text("请选择1级分类");
          $('.uploadImg').attr("src", "images/none.png")
        }
      }
    })


  })

})