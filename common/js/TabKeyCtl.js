$(function () { 


/* 按鍵動作*/
var isAlt = false;
$(window).keydown(function (evt) {
    if (evt.which == 18) { // alt
        isAlt = true;
    }
}).keyup(function (evt) {
    if (evt.which == 18) { // alt
        isAlt = false;
    }
});


$(document).keydown(function (e) {
    //e.preventDefault(); // alert(e.keyCode);// clearTimeout(timer1); //自動輪播停止
    if ((e.keyCode == 67) && (isAlt == true)) { // alt+c
        $("#accesskeyc").focus();
    }

    if ((e.keyCode == 76) && (isAlt == true)) { // alt+l
        $("#accesskeyl").focus();
    }


    if ((e.keyCode == 82) && (isAlt == true)) { // alt+r
        $("#accesskeyr").focus();
    }


    if ((e.keyCode == 66) && (isAlt == true)) { // alt+b
        $("#accesskeyb").focus();
    }

    if ((e.keyCode == 79) && (isAlt == true)) { // alt+u  改o
        $("#accesskeyo").focus();
    }

    if ((e.keyCode == 83) && (isAlt == true)) { // alt+s
        //alert("1")
        $(".mm-listview").show(); 
        $("#txtQueryMenu").focus();
    }

});



});