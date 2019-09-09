var winWidth = 0;
var sBannerMerga = false;
var Dwinsize, Nwinsize;
$(document).ready(function () {
    fnWidthChangeInit();
    //$(window).resize(function () { fnWidthChangeInit(); });
    //window.onresize = fnWidthChangeInit;
    /* 20180430 惟夫新增 */
    if ($(window).width() > 768) {
        Dwinsize = true;
    } else {
        Dwinsize = false;
    }
    /* 20180430 惟夫新增 結束 */
});
$(window).resize(function () {
    /* 20180430 惟夫隱藏 */
    // var intStstus = fnCheckWidthStatus();
    // // alert(intStstus);
    // if((intStstus == 1) || (intStstus == 2)) {
    //     setTimeout(function () {window.location.reload();}, 1);
    // }
    /* 20180430 惟夫隱藏 結束 */
    if($(window).width() > 768) {
        Nwinsize = true;
    }else{
        Nwinsize = false;
    }
    if(Dwinsize != Nwinsize){
        $(window).off('resize');
        window.location.reload();
    }
});
//判斷螢幕寬度
function fnCheckWidthStatus() {
    /* 20180430 惟夫隱藏 */
    //    var intStatus = 0;
    //    if (($(window).width() <= 768) && ((winWidth > 768) || (winWidth==0))) {
    //        //行動版
    //        intStatus = 1;
    //    } else if (($(window).width() > 768) && (winWidth < 768)) {
    //        //桌機板
    //        intStatus = 2;
    //    }
    //    setTimeout(function () { winWidth = $(window).width(); }, 1000);
        //alert(intStatus +  '-'+ $(window).width() + '-' + winWidth);
    /* 20180430 惟夫隱藏 結束 */
    /* 20180502 惟夫調整 把尺寸分界從768改成960 */
    if ($(window).width() <= 960) {
        intStatus = 1;
    } else {
        intStatus = 2;
    }
    return intStatus;
}
   function fnWidthChangeInit() {
       var str = fnCheckWidthStatus();
      // alert(str);
       if (str == 2) {  //桌機
       //  alert('桌機');
           $(".slider").HSlider();
           $(".publicize.fotorama").attr("data-height", "100%");
           //alert($(".bannerSilder.fotorama").attr("data-height"));
          $(".bannerSilder.fotorama").attr("data-height", "50%");
           //alert($(".bannerSilder.fotorama").attr("data-height"));
           //$(".bannerSilder.fotorama").attr("data-height", "200%");
          // $("#div21").attr("data-transition") = "dissolve";
           //$('#div21').fotorama({
           //    "data-width": "100%",
           //    "data-height": "50%",
           //    "data-fit": "cover",
           //    "data-autoplay": "2000",
           //    "data-arrows": "true",
           //    "data-click": "false",
           //    "data-transition": "dissolve"
           //});
       }
       else if (str == 1) { //行動
           $(".publicize.fotorama").attr("data-height", "50%");
		   // alert('mobile－' + $(".publicize.fotorama").attr("data-height"));
           //$(".bannerSilder.fotorama").attr("data-height", "200");
           //$(".publicize.fotorama").attr("data-height", "10%");
           //$(".bannerSilder.fotorama").attr("data-height", "50");
           ////$(".bannerSilder.fotorama").attr("data-transition", "slide");
           //$('#div21').fotorama({
           //    "data-width": "50%",
           //    "data-height": "200%",
           //    "data-fit": "cover",
           //    "data-autoplay": "2000",
           //    "data-arrows": "true",
           //    "data-click": "false",
           //    "data-transition": "slide"
           //});
           // $("#div21").css({"data-transition":"slide"});
          //   alert($("#div21").attr("data-transition"));
           //  $("#div21").fotorama();
           if (sBannerMerga == false) {
               $(".hotBanner1 .bannerSilder .fotorama").append($(".hotBanner2 .bannerSilder .fotorama").html());
              // alert(1);
               sBannerMerga = true;
           }
         //  alert($(".hotBanner2 .bannerSilder .fotorama").html());
       }
   }
   function dynamicRemove(removeName, thType) {
       var targetElement = (thType == "js") ? "script" : (thType == "css") ? "link" : "none";
       var targetAttr = (thType == "js") ? "src" : (thType == "css") ? "href" : "none";
       var allsuspects = document.getElementsByTagName(targetElement);
       var i = allsuspects.length;
       for (i; i >= 0; i--) {
           if (allsuspects[i] && allsuspects[i].getAttribute(targetAttr) != null
                   && allsuspects[i].getAttribute(targetAttr).indexOf(removeName) != -1) {
               alert(allsuspects[i].getAttribute(targetAttr));
               allsuspects[i].parentNode.removeChild(allsuspects[i]);
           }
       }
   }
   function dynamicInsert(insertName, thType) {
       if (thType == "js") {
           var diFile = document.createElement('script');
           diFile.setAttribute("type", "text/javascript");
           diFile.setAttribute("src", insertName);
       } else if (thType == "css") {
           var diFile = document.createElement("link");
           diFile.setAttribute("rel", "stylesheet");
           diFile.setAttribute("type", "text/css");
           diFile.setAttribute("href", insertName);
       }
       if (typeof diFile != "undefined") {
           document.getElementsByTagName("head")[0].appendChild(diFile);
       }
   }
   //判斷瀏覽器
   function fnGetBrowser() {
       var gAgent = navigator.userAgent;
       var gName = navigator.appName;
       var fullVer = "" + parseFloat(navigator.appVersion);
       var majorVer = parseInt(navigator.appVersion, 10);
       var sName, sVer, sTrim;
       if ((sVer = gAgent.indexOf("Opera")) != -1) {
           gName = "Opera";
           fullVer = gAgent.substring(sVer + 6);
           if ((sVer = gAgent.indexOf("Version")) != -1) fullVer = gAgent.substring(sVer + 8);
       } else if ((sVer = gAgent.indexOf("MSIE")) != -1) {
           gName = "IE";
           fullVer = gAgent.substring(sVer + 5);
       } else if ((sVer = gAgent.indexOf("Sleipnir")) != -1) {
           gName = "Sleipnir";
           fullVer = gAgent.substring(sVer + 9);
       } else if ((sVer = gAgent.indexOf("Chrome")) != -1) {
           gName = "Chrome";
           fullVer = gAgent.substring(sVer + 7);
       } else if ((sVer = gAgent.indexOf("Safari")) != -1) {
           gName = "Safari";
           fullVer = gAgent.substring(sVer + 7);
           if ((sVer = gAgent.indexOf("Version")) != -1) fullVer = gAgent.substring(sVer + 8);
       } else if ((sVer = gAgent.indexOf("Firefox")) != -1) {
           gName = "Firefox";
           fullVer = gAgent.substring(sVer + 8);
       } else if ((sName = gAgent.lastIndexOf(' ') + 1) < (sVer = gAgent.lastIndexOf('/'))) {
           /* 多數瀏覽器中名稱版本是在 userAgent 的結尾*/
           gName = gAgent.substring(sName, sVer);
           fullVer = gAgent.substring(sVer + 1);
           if (gName.toLowerCase() == gName.toUpperCase()) {
               gName = navigator.appName;
           }
       }
       return gName;
   }