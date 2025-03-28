//每隔1000毫秒刷新当前获取的时间
setInterval(function () {
    //获取系统当前时间
    var time = new Date();
    //将时间格式化
    var formattime = time.toLocaleString();
    //将时间赋值给控件text
    $("#a_date").text(formattime);
}, 1000);

$("#img_user").on("click", function () {
    $("#myModal3").modal("show");
});

//判断是否登录
setInterval(function () {
    $.post("/Ajax/UserHandler.ashx?type=info", function (res) {
        if (res.code == 1) {
            $("body").show();
            $("#text_Uname").text(res.data[0]);
            $("#a_roles").text(res.data[1]);
            $("#img_user").attr("src", "/Image/HeadPortrait/" + res.data[2]);
            $("#img_usermodal").attr("src", "/Image/HeadPortrait/" + res.data[2])
        } else {
            location.href = "/html页面/登录页面/Login.html";
            alert(res.msg);
        }
    });
}, 1000); 

//退出登录
function exit() {
    var bol = confirm("您确认要退出登录吗？");
    if (bol) {
        $.post("/Ajax/UserHandler.ashx?type=exit", function (res) {
            if (res.code == 1) {
                location.href = "/html页面/登录页面/Login.html";
            }
        });
    }
}

    //从数据库中查询菜单
    $.post("/Ajax/MenuHandler.ashx?type=GetMenuAut", function (res) {
        if (res.code > 0) {
            var ul = $('<ul class="list-group"></ul>').appendTo("#menu");
            res.data.forEach(function (v) {
                //父菜单-----------------------------------------------------------------------
                if (v.ParentID == 0) {
                    var li = $('<li class="menu-list"></li>').appendTo(ul);
                    var dl = $("<dl></dl>").appendTo(li);
                    var dt = $(`
                            <dt>
                                <img src="/Image/Menu/${v.Icon}" width="18" style="margin-right:5px;" />
                                <label style="width:170px;cursor: pointer;">${v.Mname}</label>
                                <span class="glyphicon glyphicon-menu-right"></span>
                            </dt>`).on("click", function () {

                                if ($(this).siblings().length > 0) {
                                    //绑定点击父菜单事件
                                    var $dd = $(this).siblings("dd");//选择this的同级dd元素
                                    var $span = $(this).find(".glyphicon").attr("class");
                                    if ($($dd).is(":hidden")) {
                                        //显示
                                        $(this).addClass("clickmenu");
                                        $(this).find(".glyphicon").removeClass($span).addClass("glyphicon glyphicon-menu-down");
                                    } else {
                                        //隐藏
                                        $(this).removeClass("clickmenu");
                                        $(this).find(".glyphicon").removeClass($span).addClass("glyphicon glyphicon-menu-right");
                                    }
                                    //子菜单切换显示和隐藏
                                    $dd.toggle(100);
                                } else {
                                    $(".menu-list dl dd").removeClass("Submenu");
                                    $(".menu-list dl dd").find("a").css("color", "white");
                                    
                                    $(".menu-list dl dt").css("color", "#BDC2C8");
                                    $(".menu-list dl dt").removeClass("Submenu");
                                    $('dt').each(function () {
                                        if ($(this).find("img").attr("src").indexOf("默认(黑)") !== -1) {
                                            $(this).find("img").attr("src", "/Image/Menu/默认.png");
                                        }
                                    }); 

                                    $(this).addClass("Submenu");
                                    $(this).css("color", "black");
                                    $(this).find("img").attr("src","/Image/Menu/默认(黑).png");
                                    $("#li_home").removeClass("active");
                                    $("#myiframes").attr("src", v.Murl);

                                }

                            }).bind({
                        //绑定鼠标悬浮在父菜单事件
                        mouseover: function () {
                            $(this).find(".glyphicon").css("color", "chartreuse");
                            $(this).addClass("hovermenu");
                        },
                        mouseout: function () {
                            $(this).find(".glyphicon").css("color", "#BDC2C8");
                            $(this).removeClass("hovermenu");
                        }
                    }).appendTo(dl);//将dt附加到dl中

                    //子菜单-----------------------------------------------------------------------
                    res.data.forEach(function (vv) {
                        if (vv.ParentID == v.Mid) {
                            $("<dd><a>" + vv.Mname + "</a></dd>").on("click", function () {
                                //绑定子菜单点击事件
                                $(".menu-list dl dd").removeClass("Submenu");
                                $(".menu-list dl dd").find("a").css("color", "white");

                                $("dt").removeClass("Submenu");
                                $("dt").css("color", "#BDC2C8");
                                $('dt').each(function () {
                                    if ($(this).siblings().length > 0) {
                                    } else {
                                        $(this).find("span").removeClass("glyphicon glyphicon-menu-right");
                                    }
                                }); 

                                $(this).addClass("Submenu");
                                $(this).find("a").css("color", "black");
                                $("#li_home").removeClass("active");
                                $("#myiframes").attr("src", vv.Murl);

                                $('dt').each(function () {
                                    if ($(this).find("img").attr("src").indexOf("默认(黑)") !== -1) {
                                        $(this).find("img").attr("src", "/Image/Menu/默认.png");
                                    }
                                }); 
                            }).bind({
                                //绑定鼠标悬浮在子菜单事件
                                mouseover: function () {
                                    $(this).addClass("hovermenu");
                                },
                                mouseout: function () {
                                    $(this).removeClass("hovermenu");
                                }
                            }).appendTo(dl);//将dd附加到dl中
                        }//vv.ParentID
                    });//res.data vv
                }//v.ParentID
            });//res.data v
            $(`<div style="width:100%;height:100px;"></div>`).appendTo("#menu");

            $('dt').each(function () {
                if ($(this).siblings().length > 0) {
                } else {
                    $(this).find("span").removeClass("glyphicon glyphicon-menu-right");
                }
            }); 
        }//res.code
    });//post


//点击首页事件

//ready等待网页上的元素全部准备完毕
$(document).ready(function () {
    //点击首页事件
    $("#li_home").on("click", function () {
        $(this).addClass("active");
        $(".menu-list dl dd").removeClass("Submenu");
        $(".menu-list dl dd").find("a").css("color", "white");
        $(".menu-list dl dt").removeClass("Submenu");
        $(".menu-list dl dt").css("color", "#BDC2C8");
        $('dt').each(function () {
            if ($(this).find("img").attr("src").indexOf("默认(黑)") !== -1) {
                $(this).find("img").attr("src", "/Image/Menu/默认.png");
            }
        }); 
    });
});

//侧边显示隐藏切换
$("#btn_left").on("click", function () {
    var windowWidth = $(window).width();
    $(".left").toggle();
    if ($('.left').is(':visible')) {
        $("#btn_left").attr("src","/Image/Index/开.png");
        if (windowWidth < 768) {
            $('.left').css({ "position": "absolute", "z-index": "10" });
            $('.right').css("width", "100%");
            $("#div_show").show();
        } else {
            $('.right').css("width", "calc(100% - 250px)");
        }
    } else {
        $("#btn_left").attr("src", "/Image/Index/关.png");
        $('.right').css("width", "100%");
    }

});

$(document).ready(function () {
    var windowWidth = $(window).width();

    if (windowWidth < 768) {
        $("#btn_left").attr("src", "/Image/Index/关.png");
        $(".left").hide();
        $('.right').css("width", "100%");
    } else {
        $("#btn_left").attr("src", "/Image/Index/开.png");
        $(".left").show();
        $('.right').css("width", "calc(100% - 250px)");
    }
    $(window).resize(function () {
        windowWidth = $(window).width();
        if (windowWidth < 768) {
            $("#btn_left").attr("src", "/Image/Index/关.png");
            $(".left").hide();
            $('.right').css("width", "100%");
        } else {
            $("#btn_left").attr("src", "/Image/Index/开.png");
            $(".left").show();
           $('.left').css({ "position": "initial", "z-index": "0" });
            $('.right').css("width", "calc(100% - 250px)");
            $("#div_show").hide();

        }
    });
});

$("#div_show").on("click", function () {
    $("#btn_left").attr("src", "/Image/Index/关.png");
    $("#div_show").hide();
    $('.right').css("width", "100%");
    $(".left").hide();
});

$("#index_updpwd").on("click", function () {
    $("#myModalPwd").modal("show");
});

//设置密码的显示与隐藏
function PwdOrShowHide(that) {
    var labelClass = $(that).find("label").attr("class");
    $(that).find("label").removeClass(labelClass).
        addClass(labelClass == "glyphicon glyphicon-eye-close" ? "glyphicon glyphicon-eye-open" : "glyphicon glyphicon-eye-close");
    $(that).prev().attr("type", labelClass == "glyphicon glyphicon-eye-open" ? "password" : "text");
}

$("#btn_verification").on("click", function () {
    var pwd = $("#text_pwd").val();
    var newpwd = $("#text_newpwd").val();
    var newpwd2 = $("#text_newpwd2").val();
    if (pwd != "" && newpwd != "" && newpwd2 != "") {
        if (newpwd == newpwd2) {
            $.post("/Ajax/UserHandler.ashx?type=SelPwdUid", { pwd: pwd }, function (res) {
                if (res.code != 0) {
                    $.post("/Ajax/UserHandler.ashx?type=IndexUpdPwd", { pwd: newpwd2 }, function (res) {
                        if (res.code > 0) {
                            $("#myModalPwd").modal("hide");
                        }
                        alert(res.msg);
                    });
                } else {
                    alert("原密码不正确！");
                }
            });
        } else {
            alert("两次密码不一致！");
        }
    } else {
        alert("输入框的信息不能为空！");
    }
});

