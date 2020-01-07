$(function () {

  // 表单校验初始化
  $("#form").bootstrapValidator({
    // 1.配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    // 2.校验字段
    fields: {
      username: {
        // 校验规则
        validators: {
          // 不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          // 字符长度
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名必须是2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        // 校验规则
        validators: {
          // 不能为空
          notEmpty: {
            message: "密码不能为空"
          },
          // 字符长度
          stringLength: {
            min: 6,
            max: 12,
            message: "密码必须是6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();

    $.ajax({
      url: "/employee/employeeLogin",
      type: "post",
      dataType: "json",
      data: $("#form").serialize(),
      success: function (res) {
        if (res.success) {
          // 登录成功，跳到首页
          window.location.href = "index.html"
        }
        if (res.error === 1000){
          // 调用表单校验插件的实例方法
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
        if(res.error === 1001){
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })
  });
})