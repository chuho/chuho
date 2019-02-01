$(function(){

	var $footer = $(".Footer"),
		$publicize = $(".section.publicize"),
		$subNav = $(".subNav"),
		$share = $(".share"),
		$shareUL = $(".share").find('ul'),
		$lang = $(".lang"),
		$lang = $(".lang").find('ul');


	$("input.btn").click(function (){
		$("input.text").fadeIn(800);
	});

	$( ".fotorama" ).on( "click", ".fotorama__video-play", function() {
	  $(".section.publicize").addClass("removeIcon");
	  $(".Footer,.subNav").css("visibility","hidden");
	});
	$( ".fotorama" ).on( "click", ".fotorama__video-close", function() {
	  $publicize.removeClass("removeIcon");
	  $(".Footer,.subNav").css("visibility","visible");
	});

	
	// $(".Footer>a").click(function (){
	// 	$footer.toggleClass("down");
	// });	
	
	$(".Footer>a").mouseenter(function (){
		if (!$footer.hasClass("down")) {
			$footer.addClass("down");
			$publicize.addClass("removeIcon");
		};
	});

	$(".Footer>a").on('click',footerIn);

	$footer.on('mouseleave',footerOut);

	function footerIn(){
		if (!$footer.hasClass("down")) {
			$footer.addClass("down");
			$publicize.removeClass("removeIcon");
		}else{
			$footer.removeClass("down");
			$publicize.addClass("removeIcon");
		}
	}
	function footerOut(){
		if ($footer.hasClass("down")) {
			$footer.removeClass("down");
			$publicize.removeClass("removeIcon");
		};
	}


	/*$("header>a").click(function (){
		$("ul.pagination").fadeToggle(800);
	});
	$(".subNav a.subNavBtn").click(function (){
		$(".subNav").toggleClass("down");
	});*/

	$(".subNav a.subNavBtn").mouseenter(function (){
		if (!$subNav.hasClass("down")) {
			$subNav.addClass("down");
		};
	});	
	$subNav.on('click mouseleave',subNavOut)
	function subNavOut(){
		if ($subNav.hasClass("down")) {
			$subNav.removeClass("down");
		};
	};

	$share.hover(
		function(){
			$shareUL.stop(true, true).slideDown(500);	
		},
		function(){
			$shareUL.stop(true, true).slideUp(500);	
	}); 
	$(".lang").hover(
		function(){
			$(".lang ul").stop(true, true).slideDown(500);	
		},
		function(){
			$(".lang ul").stop(true, true).slideUp(500);	
	});
      var _windowWidth2=$(window).width();  
       if (_windowWidth2<550) {
          $('.typeB a br').remove();
       }
	

	$(".Footer .site li>ul").each(function(index, el) {
		$(this).has('li').parent("li").addClass('hasTwoLevel')
		

		
	});
       

	/*GOTOP*/
    $(".fixedBtn").hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 500) {
			$(".fixedBtn").fadeIn();
		} else {
			$(".fixedBtn").fadeOut();
		};

	});

	$(".goTop").click(function () {
		$("body,html").animate({scrollTop:0},800);
		return false;
	});

    /* 判斷裝置 20171018 惟夫修改 */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        console.log('我是行動裝置');
        $('section.publicize').addClass('ismobile');
    }else{
        console.log('我是電腦');
        $('section.publicize').removeClass('ismobile');
    }


});
