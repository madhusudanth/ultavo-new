// global variable
jQuery(function($){
	var winWidth = $(window).width();
	var winHeight = $(window).height();

	$(window).resize(function(){
		winWidth = $(window).width();
		winHeight = $(window).height();
	});

	// mobile view description show
	if (winWidth <= 767) {
		$('#home-brands .logo-info').addClass('view');

		//for blog page
		$('.no-sidebar div#content article.post .entry-content').addClass('no-image');
	}
	$(window).resize(function () {
        if(winWidth <= 767){
        	$('.no-sidebar div#content article.post .entry-content').addClass('no-image');
        }else{
        	$('.no-sidebar div#content article.post .entry-content').removeClass('no-image');
        }
    });
	$('.top-part').addClass('inactive');
	$('.tk-theaters').addClass('active');
    $('.brand-ic').click(function(){
    	var block = $(this).attr('alt');
    	block = "." + block ;
    	$('.top-part').removeClass('active');
    	$('.top-part').addClass('inactive');
    	$(block).addClass('active');
    });
});

// preloader jquery

jQuery(function($){
	$('#page').css('visibility', 'hidden');
	$(window).on('load', function() {
		$('#preload').fadeOut(500);
		$('#page').css('visibility', 'visible');
		$('#page').fadeIn(1000);
	});
	$(document).ready(function(){
	    if($('body').hasClass('home')) {
			$(document).scrollTop(0);
		}
	});
});


jQuery(function($){
	if ($('body').hasClass('page-catalogue')) {
		var imgBanner = $('#cat_page_banner').val();
		$('header.entry-header').css('background-image', 'url(' + imgBanner + ')');
		$('.prod-cat-category-label').remove();
	}
});




// map hover jquery
jQuery(function($){
	$(document).ready(function () {
		if ($(window).width() > 767) {
			$('.home.page .text-block').height($(window).height() - 40);
			$('.home.page .text-block').css('overflow','hidden');
		}
	    // you want to enable the pointer events only on click;

	    $('#custom-map').addClass('scrolloff'); // set the pointer events to none on doc ready
	    $('#map-wrap').on('click', function () {
	        $('#custom-map').removeClass('scrolloff'); // set the pointer events true on click
	    });

	    // you want to disable pointer events when the mouse leave the canvas area;

	    $("#custom-map").mouseleave(function () {
	        $('#custom-map	').addClass('scrolloff'); // set the pointer events to none when mouse leaves the map area
	    });
	});
});

// Js for main home page banner

jQuery(function($){
	$(document).ready(function(){
		var imgc = new Image;
		imgc.src = $('.site-branding').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
		$(imgc).bind('load', function(){
			var bgImgWidth = imgc.width;
			var bgImgHeight = imgc.height;
			$('.site-branding').css('height',$(window).height());
		});
	});
});

// Js for Luxury Brands on home page

jQuery(function($){
	$(document).ready(function(){
		var bgImgHeight = $(window).height();
		$('.home.page .brands .brand-content').css('height',bgImgHeight);
		// imgc.src = $('.home.page .brand-info.brands').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
		// var imgc = new Image;
		// $(imgc).bind('load', function(){
		// 	var bgImgWidth = imgc.width;
		// 	// $('.home.page .brands .brand-content').css('height',bgImgHeight);
		// });
	});
});

//Js for Services Image block
jQuery(function($){
	$('.service-images-block li').hover(function(){
		var custom_height=$(this).children('img').height();
		$(this).children('.hover-text').fadeIn(300);
		$(this).children('.heading').toggle();
		$(this).children('img').css({'animation': 'zoom-in 0.2s linear 0s 1 forwards','-webkit-animation': 'zoom-in 0.2s linear 0s 1 forwards'});
		$(this).children('.hover-text').css({'height': custom_height});
	});
	$('.service-images-block li').mouseleave(function(){
		var custom_height=$(this).children('img').height();
		$(this).children('img').css({'animation': 'zoom-out 0.2s linear 0s 1 backwards','-webkit-animation': 'zoom-out 0.2s linear 0s 1 backwards'});
		$(this).children('.hover-text').css({'height': custom_height});
		$(this).children('.hover-text').fadeOut(300);
		$('.desktop-mobile').children('span').text('Call Us Now');
	});

	//jquery function for call us
	$('.desktop-mobile').click(function(e){
		if($(window).width() > 600){
			e.preventDefault();
			var text = $(this).attr('desktop');
			$(this).children('span').text(text);
		}
	});
});

// go to top button
jQuery(function($){
	$(document).ready(function () {
		$('.gotop').fadeOut(200);
	});
	$(window).scroll(function() {
	    if ($(this).scrollTop() >= $(window).height()) {        // If page is scrolled more than 50px
	        $('.gotop').fadeIn(200);    // Fade in the arrow
	    } else {
	        $('.gotop').fadeOut(200);   // Else fade out the arrow
	    }
	});
});

jQuery(function($){
	if($('body').hasClass('home')){
		if ($(window).width() <= 767) {
			$.fn.reverseChildren = function() {
				return this.each(function(){
					var $this = $(this);
					$this.children().each(function(){ $this.prepend(this) });
				});
			};
			$('#home-brands .logo-info .brand-info').reverseChildren();
			$('.skip-scroll').hide();
			$(window).scroll(function(){
				if ($(window).scrollTop() > $('#home-brands').offset().top) {
					if ($(window).scrollTop() < ($('#home-brands').offset().top + $('#home-brands').height())) {
						$('.title-brands').addClass('scroll-title');
						$('.skip-scroll').show();
					} else {
						$('.title-brands').removeClass('scroll-title');
						$('.skip-scroll').hide();
					}
				} else {
					$('.title-brands').removeClass('scroll-title');
					$('.skip-scroll').hide();
				}
			});
		}
		var headerheight = $(window).height();
	   	$(document).ready(function () {
	        calcContentHeight();
	    });

	    $(window).resize(function () {
	        calcContentHeight();
	    });
	    function calcContentHeight() {
	    	if ($('body').hasClass('home')) {
	    		$('.site-branding').height($(window).height());
	    		$('.logo-info .brand-logo .brand-content').each(function(){
	    			$(this).height($(window).height());
	    		});
	    		$('.logo-info .brand-info .brand-content').each(function(){
	    			$(this).height($(window).height());
	    		});
	    		headerheight = $(window).height();
	    	}
	        var contents = $('.brand-info > .brand-content').length - 1;
	        contentHeight = $('.brand-info').height() * contents;
	        
	        top = 0 - contentHeight;
	        // setRightTop();
	    }
	    function setRightTop() {
	    	var childCount = $(".brand-info.brands").children().length + 1;
	    	var rightTop2 = $window.height() * childCount;
	        var rightTop2 = rightTop2 - $(window).scrollTop();
	        
	        //1. don't allow right col top to go positive
	        // if(rightTop > 0) rightTop = 0 - rightTop;
	        $('.brand-info').css('top', '-' + rightTop2 + 'px');
	        
	        //2. Ensure .row has sufficient top margin
	        // $('.services').css('margin-top', contentHeight + 'px');
	    }
		if ($(window).width() >= 768) {
			$('.skip-scroll').hide();
			$('.title-brands').removeClass('scroll-title');
		   	$('.normal-info').removeClass('scroll-info');
			$window = $(window);
		   	var distance = $('#home-brands').offset().top;
			$(window).scroll(function() {
			    if ( $window.scrollTop() > headerheight){
				    var top = 0;
				    var contentHeight = 0;

			        setRightTop();
				    
			   		$('.title-brands').addClass('scroll-title');
			   		$('.normal-info').addClass('scroll-info');
			   		$('.skip-scroll').show();

				}
			});
			var upscrollFlag = false;
			var downscrollFlag = false;
			$(window).scroll(function() {
				var distance1 = $('#services').offset().top;
				var distance = headerheight;
				if($window.scrollTop() <= headerheight){
					upscrollFlag = true;
					$('.brand-info.brands .brand-content').hide();
					$('.brand-info.brands .brand-content').last().show();
					$('.title-brands').removeClass('scroll-title');
			   		$('.normal-info').removeClass('scroll-info');
			   		$('.skip-scroll').hide();
				} else {
					if (upscrollFlag) {
						upscrollFlag = false;
						$('.brand-info.brands > .brand-content').show();
					}
				}
				if(($window.scrollTop() + $window.height()) > distance1){
					downscrollFlag = true;
					$('.brand-info.brands .brand-content').hide();
					$('.brand-info.brands .brand-content').first().show();
					$('.brand-info.brands').css('position', 'relative');
					$('.brand-info.brands').css('top', ($(window).height() * ($(".brand-info.brands").children().length - 1)));
					$('.title-brands').removeClass('scroll-title');
			   		$('.normal-info').removeClass('scroll-info');
			   		$('.skip-scroll').hide();
				} else {
					if (downscrollFlag) {
						downscrollFlag = false;
						$('.brand-info.brands > .brand-content').show();
						$('.brand-info.brands').css('position', '');
						$('.brand-info.brands').css('top', '');
					}
				}
			});
		}
	}
});

jQuery(function($){
	$(window).load(function(){
		if ($(window).width() <= 751) {
			$('.prod-cat-sidebar').css('position', 'initial');
		}
	});
	$(window).resize(function(){
		if ($(window).width() <= 751) {
			if (!($('.prod-cat-sidebar .prod-cat-sidebar-content').hasClass('show'))) {
				$('.prod-cat-sidebar').css('position', 'initial');
			}
		}
	});
	//for category page
	jQuery(function($){
		if ($('body').hasClass('page-catalogue')) {
			var width = 1500;
			var height = 595;
			var exHeaderHeight = $('header#masthead').height();
			var headerWidth = $(window).width();
			if (headerWidth >= 1200) {
				var headerHeight = $(window).height() - exHeaderHeight;
			} else {
				var headerHeight = (headerWidth * height) / width;
			}
			$('.entry-header').height(headerHeight);
		}
		$(window).on('resize', function(){
			if ($('body').hasClass('page-catalogue')) {
				var width = 1500;
				var height = 595;
				var exHeaderHeight = $('header#masthead').height();
				var headerWidth = $(window).width();
				if (headerWidth >= 1200) {
					var headerHeight = $(window).height() - exHeaderHeight;
				} else {
					var headerHeight = (headerWidth * height) / width;
				}
				$('.entry-header').height(headerHeight);
			}
		});
		$('.prod-cat-sidebar-cat-title').click(function(){
			if ($(window).width() <= 715) {
				$(this).children('h3').toggleClass('open');
				$('.prod-cat-sidebar-content').toggleClass("show");
				if ($('.prod-cat-sidebar-content').hasClass("show")) {
					$('.prod-cat-sidebar').css('position', 'relative');
				} else {
					$('.prod-cat-sidebar').css('position', 'initial');
				}
			}
		});
	});
});

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {38: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll(event) {
	if (window.addEventListener){
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	} // older FF
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault(event); // mobile
	document.onkeydown  = preventDefaultForScrollKeys(event);
}

function enableScroll(event) {
    if (window.removeEventListener){
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

jQuery(function($){
	var arrowUpDownKeyFlag = true;
	function check_if_in_view($animation_elements) {
		if ($(window).scrollTop() >= 0) {
			var window_height = $(window).height();
			var window_top_position = $(window).scrollTop();
			var window_bottom_position = (window_top_position + window_height);
			var window_middle_position = (window_top_position + (window_height/2));
			$.each($animation_elements, function() {
				var $element = $(this);
				var element_height = $element.outerHeight();
				var element_top_position = $element.offset().top;// + 30;
				var element_bottom_position = (element_top_position + element_height);// - 30);

				//check to see if this current container is within viewport
				// if ((element_bottom_position <= window_bottom_position) && (element_top_position > window_top_position)) {
				// 	$element.addClass('in-view');
				// } else {
				// 	$element.removeClass('in-view');
				// }
				if ((element_top_position < window_middle_position) && (window_middle_position < element_bottom_position)) {
					$element.addClass('in-view');
				} else {
					$element.removeClass('in-view');
				}
			});
		}
	}

	function changeLuxuryHeadingColor(tempWinWidth) {
		if (tempWinWidth > 767) {
			var homeBrandsTitleFirst = $('#home-brands .title-brands .home-title.first');
			var homeBrandsTitleLast = $('#home-brands .title-brands .home-title.last');
			var brandBgIsWhite = $('.brand-info.brands .brand-content.in-view').hasClass('bg-white');
			if (($('#home-brands').offset().top + $(window).height() - 20) < $(window).scrollTop()) {
				if (brandBgIsWhite) {
					homeBrandsTitleFirst.css('color', 'white');
					homeBrandsTitleLast.css('color', '#1a1a1a');
				} else {
					homeBrandsTitleFirst.css('color', '#1a1a1a');
					homeBrandsTitleLast.css('color', 'white');
				}
			} else {
				homeBrandsTitleFirst.css('color', '#1a1a1a');
				homeBrandsTitleLast.css('color', 'white');
			}
		}
	}

	// transit to block script
	$('.transit-to-block').click(function(){
		var transToId = '#' + $(this).attr('alt');
		$('html,body').animate({scrollTop: $(transToId).offset().top}, 10);
	});
	$('.transit-to-block-arrow').click(function(){
		var transToId = '#' + $(this).attr('alt');
		$('html,body').animate({scrollTop: $(transToId).offset().top}, {duration: 600, step: function( currentStep ){check_if_in_view($('.brand-info .brand-content')); changeLuxuryHeadingColor($(window).width());}});
	});

	function scrollFullPage(event, scrollType) {
		$.each($('.brand-info .brand-content'), function() {
			var $element = $(this);
			$element.removeClass('in-view');
		});
		var firstChildFlag = false;
		scrollTopVal = $(window).scrollTop() - $(window).height();
		scrollDownVal = $(window).scrollTop() + $(window).height();
		var scrollVal = 0;
		if (scrollType == 1) {
			if ($(window).scrollTop() >= $("#services").offset().top) {
				var checkIfInViewFlag = false;
				if(event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0) {
					// var scrollVal = scrollDownVal;
					// if (($(window).scrollTop() + $(window).height()) < ($("#services .service-images-block").offset().top + $("#services .service-images-block").height())) {
					// 	var scrollVal = $("#services .service-images-block").offset().top + $("#services .service-images-block").height() - $(window).height();
					// } else {
					if (($(window).scrollTop() + $(window).height()) < ($("#services").offset().top + $("#services").height())) {
						var scrollVal = $("#services").offset().top + $("#services").height() - $(window).height();
					} else {
						if ($(window).scrollTop() >= $('.keep-updated').offset().top && $(window).scrollTop() < ($('.keep-updated').offset().top + $('.keep-updated').height() - 5)) {
							var scrollVal = $('.last-banner').offset().top;
						} else if ($(window).scrollTop() >= ($('.last-banner').offset().top - 10)) {
							var scrollVal = $('body').height() - $(window).height();
						} else {
							var scrollVal = scrollDownVal;
						}
					}
		        } else if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		        	if (($(window).scrollTop() + $(window).height()) < ($("#services").offset().top + $("#services").height())) {
		        		// alert('ok');
						firstChildFlag = true;
					}
		        	if (($(window).scrollTop() + $(window).height()) >= $('body').height()) {
		        		if ($(window).scrollTop() > $('.last-banner').offset().top) {
		        			var scrollVal = $('.last-banner').offset().top;
		        		} else {
		        			var scrollVal = $('.keep-updated').offset().top;
		        		}
		        	} else {
		        		if ($(window).scrollTop() == $('.last-banner').offset().top) {
		        			var scrollVal = $('.keep-updated').offset().top;
		        		} else if ($(window).scrollTop() <= ($('.last-banner').offset().top + 10) && $(window).scrollTop() >= ($('.last-banner').offset().top - 10)) {
		        			var scrollVal = $('.keep-updated').offset().top;
		        		} else if ($(window).scrollTop() == $('.keep-updated').offset().top) {
		        			var scrollVal = $("#services").offset().top + $("#services").height() - $(window).height();
		        		} else if ($(window).scrollTop() <= ($('.keep-updated').offset().top + 10) && $(window).scrollTop() >= ($('.keep-updated').offset().top - 10)) {
		        			var scrollVal = $("#services").offset().top + $("#services").height() - $(window).height();
		        		} else if ($(window).scrollTop() > $('#services').offset().top && $(window).scrollTop() <= ($('#services').offset().top + $('#services').height())) {
		        			var scrollVal = $('#services').offset().top;
		        		} else {
		        			var scrollVal = scrollTopVal;
		        		}
		        	}
		        }
			} else {
				var checkIfInViewFlag = true;
				if(event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0) {
					var scrollVal = scrollDownVal;
		        } else if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		        	var scrollVal = scrollTopVal;
		        }
			}
	        $('html, body').animate({scrollTop: scrollVal + 'px'}, {duration: 600, step: function(currentStep){if(checkIfInViewFlag){check_if_in_view($('.brand-info .brand-content')); changeLuxuryHeadingColor($(window).width());} if(firstChildFlag){$('.brand-info .brand-content:first-child').addClass('in-view');}}, complete: function () {safariFlag = false; enableScroll(event);}});
		} else if (scrollType == 2) {
			if ($(window).scrollTop() >= $("#services").offset().top) {
				var checkIfInViewFlag = false;
				if (event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 34) {
					// var scrollVal = scrollTopVal;
					if (($(window).scrollTop() + $(window).height()) < ($("#services").offset().top + $("#services").height())) {
						var scrollVal = $("#services").offset().top + $("#services").height() - $(window).height();
					} else {
						if ($(window).scrollTop() >= $('.keep-updated').offset().top && $(window).scrollTop() < ($('.keep-updated').offset().top + $('.keep-updated').height())) {
							var scrollVal = $('.last-banner').offset().top;
						} else if ($(window).scrollTop() >= $('.last-banner').offset().top) {
							var scrollVal = $('body').height() - $(window).height();
						} else {
							var scrollVal = scrollDownVal;
						}
					}
				} else if (event.keyCode == 38 || event.keyCode == 33) {
					if (($(window).scrollTop() + $(window).height()) < ($("#services").offset().top + $("#services").height())) {
		        		// alert('ok');
						firstChildFlag = true;
					}
					// var scrollVal = scrollDownVal;
					if (($(window).scrollTop() + $(window).height()) >= $('body').height()) {
		        		if ($(window).scrollTop() > $('.last-banner').offset().top) {
		        			var scrollVal = $('.last-banner').offset().top;
		        		} else {
		        			var scrollVal = $('.keep-updated').offset().top;
		        		}
		        	} else {
		        		if ($(window).scrollTop() == $('.last-banner').offset().top) {
		        			var scrollVal = $('.keep-updated').offset().top;
		        		} else if ($(window).scrollTop() == $('.keep-updated').offset().top) {
		        			var scrollVal = $("#services").offset().top + $("#services").height() - $(window).height();
		        		} else if ($(window).scrollTop() > $('#services').offset().top && $(window).scrollTop() <= ($('#services').offset().top + $('#services').height())) {
		        			var scrollVal = $('#services').offset().top;
		        		} else {
		        			var scrollVal = scrollTopVal;
		        		}
		        	}
				}
			} else {
				var checkIfInViewFlag = true;
				if (event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 34) {
					var scrollVal = scrollDownVal;
				} else if (event.keyCode == 38 || event.keyCode == 33) {
					var scrollVal = scrollTopVal;
				}
			}
			$('html, body').animate({scrollTop: scrollVal + 'px'}, {duration: 600, step: function( currentStep ){if(checkIfInViewFlag){check_if_in_view($('.brand-info .brand-content')); changeLuxuryHeadingColor($(window).width());} if(firstChildFlag){$('.brand-info .brand-content:first-child').addClass('in-view');}}, complete: function () {/*if(checkIfInViewFlag){check_if_in_view($('.brand-info .brand-content')); changeLuxuryHeadingColor();} if(firstChildFlag){$('.brand-info .brand-content:first-child').addClass('in-view');}*/ arrowUpDownKeyFlag = true;}});
		}
	}
	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
	var safariFlag = false;
	$(window).bind(mousewheelevt, function(event) {
		if($('body').hasClass('home')){
			if (safariFlag) {
				event.preventDefault();
			} else {
				safariFlag = true;
		        event.preventDefault();
				disableScroll(event);
				var scrollType = 1;
				scrollFullPage(event, scrollType);
			}
		}
	});
	$(document).keydown(function(event) {
		if($('body').hasClass('home')){
			if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 32) {
				event.preventDefault();
				if (arrowUpDownKeyFlag) {
					arrowUpDownKeyFlag = false;
					var scrollType = 2;
					scrollFullPage(event, scrollType);
				}
			}
		}
	});
});