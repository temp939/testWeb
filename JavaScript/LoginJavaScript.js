//轮播图
//ready等待网页上的元素全部准备完毕
$(document).ready(function () {
    if ($.cookie("Phone") && $.cookie("Pwd")) {
        $("#ipt_phone").val($.cookie("Phone"));
        $("#ipt_pwd").val($.cookie("Pwd"));
        $(".remember").prop("checked", true);
    }

    var index = 0;
    function img() {
        var $img = document.querySelector(".img"); //获取.img元素
        var w = getComputedStyle($img).width; //获取.imgcenter的宽
        w = Number(w.slice(0, -2)); //计算
        $img.querySelector(".img-imgcenter").style.left = index * w * -1 + "px";
    }
    //获取.img-imgcenter下有多少子元素
    var imgnum = $(".img-imgcenter").children().length;
    //每隔4秒切换一次图片
    setInterval(function () {
        index++;
        if (index > imgnum - 1) {
            index = 0;
        }
        img();
    }, 4000);

});

//密码显示隐藏
$("#pwd_ico").on("click", function () {
    var $class = $(this).attr("class");
    $(this).removeClass($class).
        addClass($class == "glyphicon glyphicon-eye-close" ? "glyphicon glyphicon-eye-open" : "glyphicon glyphicon-eye-close")
    $(this).prev().attr("type", $class == "glyphicon glyphicon-eye-open" ? "password" : "text");
});


//点击登录按钮事件
$("#btn_login").on("click", function () {
    var phone = $("#ipt_phone").val();
    var pwd = $("#ipt_pwd").val();
    if (phone != "" && pwd != "") {
        $.post("/Ajax/UserHandler.ashx?type=login", {
            phone: phone,
            pwd: pwd
        }, function (res) {
            if (res.code == 1) {
                $.post("/Ajax/MenuHandler.ashx?type=GetMenuAut", function (res) {
                    if (res.code > 0) {
                        Remember(phone, pwd);
                        location.href = "/html页面/主框架/Index.html";
                    } else {
                        Warn(res.msg);
                    }
                })
            } else {
                Warn(res.msg);
            }
        });
    } else {
        Warn("输入框信息不能为空！");
    }
});


//光标聚焦输入框事件
$('#ipt_phone,#ipt_pwd').focus(function () {
    $("#div_warn").hide();
    $("#warn_text").text("");
});


//提示框
function Warn(text) {
    $("#div_warn").show();
    $("#warn_text").text(text);
}


//判断是否选中记住我
function Remember(phone, pwd) {
    if ($(".remember").is(":checked")) {
        $.cookie("Phone", phone, { expires: 1, path: "/" });
        $.cookie("Pwd", pwd, { expires: 1, path: "/" });
    } else {
        $.removeCookie("Phone", { path: "/" });
        $.removeCookie("Pwd", { path: "/" });
    }
}

//点击忘记密码
$("#a_pwd").on("click", function () {
    $("#myModal2").modal("show");
})

//设置密码的显示与隐藏
function PwdOrShowHide(that) {
    var labelClass = $(that).find("label").attr("class");
    $(that).find("label").removeClass(labelClass).
        addClass(labelClass == "glyphicon glyphicon-eye-close" ? "glyphicon glyphicon-eye-open" : "glyphicon glyphicon-eye-close");
    $(that).prev().attr("type", labelClass == "glyphicon glyphicon-eye-open" ? "password" : "text");
}

var numcode = 0;
var regex = /^1[3456789]\d{9}$/;
//更换电话号码 确认
$("#btn_verification2").on("click", function () {
    var phone = $("input[name=userphone]").val();
    var code = $("input[name=code]").val();
    if (phone != "" && code != "") {
        if (regex.test(phone)) {
            if (code == numcode) {
                Phones=phone;
                $("input[name=userphone]").val("");
                $("input[name=code]").val("");
                $("#myModal2").modal("hide");
                $("#myModal3").modal("show");
            } else {
                alert("验证码错误，请重新输入！");
            }
        } else {
            alert("请输入正确的手机号码！");
        }
    } else {
        alert("输入框的信息不能为空！");
    }
});

var Phones = "";
//获取验证码
$("#btn_code").on("click", function () {
    if ($(this).text() == "获取验证码") {
        if ($("input[name=userphone]").val() != "" && regex.test($("input[name=userphone]").val())) {

            $.post("/Ajax/UserHandler.ashx?type=SelPhone", { phone: $("input[name=userphone]").val()  }, function (res) {
                if (res.code != 0) {
                    numcode = Math.floor(Math.random() * 1000000);
                    while (numcode.toString().length < 6) {
                        numcode *= 10;
                    }
                    alert(numcode);
                    var second = 30;
                    var time = setInterval(function () {
                        if (second == 0) {
                            $("#btn_code").text("获取验证码");
                            clearTimeout(time);
                        } else {
                            $("#btn_code").text(second + "s");
                            second -= 1;
                        }
                    }, 1000);
                } else {
                    alert("当前输入的手机号码不存在账户，无法验证没有存在账户的手机号！");
                }
            });
        } else {
            alert("请输入正确的手机号码！");
        }
    }
});

//设置密码
$("#btn_verification").on("click", function () {
    var pwd = $("#text_newpwd").val();
    var pwd2 = $("#text_newpwd2").val();
    if (pwd != "" && pwd2 != "") {
        if (pwd == pwd2) {
            $.post("/Ajax/UserHandler.ashx?type=UpdPwd", { pwd: pwd2, phone: Phones }, function (res) {
                if (res.code>0) {
                    $("#myModal3").modal("hide");
                }
                alert(res.msg);
            });
        } else {
            alert("两次密码输入不一致！");
        }
    } else {
        alert("输入框的信息不能为空！");
    }
});