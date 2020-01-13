$(function () {
  var currentPage = 1;
  var picArr = [];
  // 1.进入页面发送ajax请求，进行数据渲染
  render(currentPage);
  function render(currentPage) {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage || 1,
        pageSize: 2
      },
      dataType: 'json',
      success: function (res) {
        console.log(res);
        // 进行模板引擎渲染
        var htmlStr = template("productTpl", res);
        $('tbody').html(htmlStr);

        // 分页组件的渲染
        $("#page").bootstrapPaginator({
          // 分页结构对应的bootstrap的版本
          bootstrapMajorVersion: 3,
          // 分页总数
          totalPages: Math.ceil(res.total / res.size),
          // 当前页数
          currentPage: currentPage,
          // 点击分页按钮的事件
          onPageClicked: function (event, originEvent, type, page) {
            // 分页的渲染
            currentPage = page;
            render(currentPage);
          }
        })
      }
    })
  }

  // 2.点击添加商品按钮，弹出模态框，并发送ajax请求获取一级分类
  $(".btn-product").on("click", function () {
    $("#productModal").modal("show");
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (res) {
        console.log(res);
        // 模板引擎渲染数据
        var htmlStr = template("firstCategoryTpl", res);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  // 3.点击选择列表内容，将值赋值给下拉列表，并将一级分类id赋给隐藏文本域
  $(".dropdown-menu").on("click", "a", function () {
    // 获取选中文本框的值
    var txt = $(this).text();
    var id = $(this).data("id");
    $(".selectText").text(txt);
    // 将一级分类赋值给隐藏文本域
    $("[name='brandId']").val(id);

    // 隐藏域不能监听状态的变化需要手动设置
    $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  })

  // 4.使用fileUpload插件进行文件上传（URL.creatObjectURL与fileReader兼容性比较大）
  $("#fileupload").fileupload({
    dataType: 'json',
    // 上传完成的回调函数
    // 每上传一次都会执行该回调函数
    done: function (e, data) {
      // data.result 为返回的信息
      // 将图片对象存储在数组的最前面 shift push  pop unshift
      picArr.unshift(data.result);
      // 将返回的值赋给图片，进行图片预览
      $(".imgBox").prepend('<img src="' + data.result.picAddr + '" alt="" width="100">');
      // 图片需要上传3张，所以需要将返回的图片信息，存储在数组当中进行判断。如果大于3张删除最后一张，并将数组最后一个元素删除
      if (picArr.length > 3) {
        picArr.pop();
        $(".imgBox").children("img:last-of-type").remove();
      }
      // 如果上传了3张图片就进行手动更新状态
      if (picArr.length === 3) {
        $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
      console.log(picArr)
    }
  })

  // 5.进行表单校验
  $("#form").bootstrapValidator({
    // 1.排除的表单校验项（默认禁用和隐藏域不校验）
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 3.校验字段
    fields: {
      // 二级分类id, 归属品牌
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 商品描述
      // 商品库存
      // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
      // 数字: \d
      // + 表示一个或多个
      // * 表示零个或多个
      // ? 表示零个或1个
      // {n} 表示出现 n 次
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      // 商品价格
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 标记图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  })

  // 6.注册表单校验完成事件
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();
    var params = $("#form").serialize();
    params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: params,
      dataType: 'json',
      success: function (res) {
        console.log(res);
        // 关闭模态框
        $("#productModal").modal("hide");
        // 数据重新渲染
        currentPage = 1;
        render(currentPage);
        // 重置表单内容和状态
        $("#form").data("bootstrapValidator").resetForm(true);
        // 清空文本框
        $(".selectText").val("请选择二级分类");
        // 清空图片和数组
        $(".imgBox").find("img").remove();
        picArr = [];
      }
    })
  })

})