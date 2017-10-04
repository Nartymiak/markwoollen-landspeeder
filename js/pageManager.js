var fadeInterval = 1000;
var scrollInterval = 800;
var state = 'home';
var thumbState = 'down';
var viewPortWidth, containerWidth, thumbWidth, thumbHeight;
var windowWidth, windowHeight, ratio;
var thumbUniqueID ='';
var initialized = false;
var currentSlide = 0;
var eventQueue = [];
var transitioning = false;

function pageManager(){
	
	scaleElements();
	thumbLogic();
	videoLogic();
	navLogic();

	window.onresize = reload;
}

function beginAnimation(callback){
	
	setTimeout(function(){
		slideThumbsUp();
		$('#beginBlack').animate({'opacity': 0}, fadeInterval, function(){
			$('#beginBlack').css('display', 'none');
		});
	}, fadeInterval);

	initialized = true;
}

function reload(){

	var resizeTimer;

  	clearTimeout(resizeTimer);
  	resizeTimer = setTimeout(function() {
    	window.location.reload(false);          
  	}, 250); 
}

//thumbnails
function scaleElements(){

	var thumbCount, fontSize, s, px;

	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	ratio = windowWidth/windowHeight;

	if (ratio > 1){
		px = 4 * ratio + 'px';		
		$('#nav ul').css('bottom',  px);
	} else {
		px = -4;		
		$('#nav ul').css('bottom',  px);
	}

	fontSize = Math.round(windowHeight * 0.02539682539);
	s = fontSize.toString();
	$('body').css('font-size', s+"px");

	// thumbnails
	thumbCount = $('.thumb').size();
	viewPortWidth = windowWidth * .88571428571;
	// thumbnails equals (the container width - the total padding) / 5
	//thumbWidth = ($('#thumbnails').width() - 128)/5 ;
	thumbWidth = viewPortWidth / 5;
	containerWidth = thumbCount * thumbWidth;
	thumbMargin = thumbWidth * .05649717514;
	thumbWidth = thumbWidth - (thumbMargin * 2);
	thumbHeight = windowHeight * .09730538922;

	// set stuff
	$('#thumbnails').css({
		'width': viewPortWidth,
		'padding': 0
	});
	$('.thumb').css({ 
		'width' : thumbWidth,
		'height' : thumbHeight,
		'margin-left': thumbMargin,
		'margin-right': thumbMargin
	});
	$('#thumbnailsContainer').css({
		'width': containerWidth
	});
	$('#thumbAndNavContainer').css({
		'top': $('#thumbAndNavContainer').height() *-1
	});
	$('#bottomSlide').css('height', windowHeight * .3619047619);
}

function thumbLogic(){
	
	$('.thumb').hover(
		function(){$(this).children().css('display', 'block')},
		function(){$(this).children().css('display', 'none')}
	);

	$('body').on('click', '.thumb', function(e){
		e.preventDefault();
		thumbID = $(this).attr("id");
		thumbUniqueID = $(this).attr("data");
		$.address.value('/trailers/' + $(this).attr("id"));
	});

	// allows users to click and scroll
	sidewaysScroll();
}

function videoLogic(){

	$('#videoContainer').on('click', '.closeButton', function(){

		if($('#videoContainer').css('display') == 'block'){

			$('#videoContainer video').get(0).pause();
			$('#videoContainer').animate({'opacity': 0}, fadeInterval);
			setTimeout(function(){
				$('#videoContainer').css('display', 'none').empty();
			}, fadeInterval);
		}
		$.address.value(state);
	});

	$('#videoContainer').on('click', '.links a', function(){
		showVideo($(this).attr("id"), $(this).attr("data"));
	});
}

function navLogic(){

	$.address.change(function(event){

		var eventObj;
		var trailerCheck;

		eventQueue[0] = event;

		if(transitioning !== true){

			var arrloop = function(){

				transitioning = true;
				
				eventObj = eventQueue.shift();
				trailerCheck = eventObj.value.split('/');

				if ((eventObj.value === '/' || eventObj.value === '/home') && initialized === false){			
					beginAnimation();

				} else if(trailerCheck[1] === 'trailers'){
					showVideo(trailerCheck[2], thumbUniqueID, function(){
						if(eventQueue.length === 0){
							transitioning = false;
						} else {
							arrloop();
						}
					});
					$('#beginBlack').css('opacity', 0);

				} else {
					showPage(eventObj.value, (function(){
						if(eventQueue.length === 0){
							transitioning = false;
						} else {				
							arrloop();
						}
					}));
					$('#beginBlack').css('opacity', 0);
				}
			}
			arrloop();
		}
	});

	$("#nav li a").on('click', function(e){
		e.preventDefault();
		$.address.value($(this).attr('href'));
	});

	$("#pageContainer").on('click', '#profileSubNav a', function(e){
		e.preventDefault();
		$.address.value($(this).attr('href'));
	});

	$('#pageContent').on('click', '.notableLink', function(e){
		e.preventDefault();
		showNotableArticle($(this).attr("id"));
	});

	$('#pageContent').on('click', '#articleClose', function(e){
		e.preventDefault();
		hideArticle();
	});

	$('#pageContent').on('click', '#notableContentClose', function(e){
		e.preventDefault();
		$.address.value('profile');
	});
}

function openPage(callback){
	$('#pageContainer').css({
		'display': 'block',
		'opacity': 1
	});

	// mark nav element selected
	$('#nav ul li a').each(function(){
		if($(this).attr('href') === state){
			$(this).addClass('selected');
		}else{
			$(this).removeClass('selected');
		}
	});

	toggleWorkNav();

	switch(state){
		case 'notables':
			panelsIn(true,true,function(){
				pageBgSwap(function(){
					showNotablesContent();
					if(thumbState == 'up'){
						slideThumbsDown();
					}
				});
			});
			break;

		case 'accolades':
			panelsIn(false,false,function(){			
				showAccoladesContent();
				if(thumbState == 'up'){
					slideThumbsDown();
				}
			});
			break;

		case 'work':
		case 'more':
			pageBgSwap(function(){
				showWorkContent(function(){if(callback){callback();}});
				if(thumbState == 'up'){
					slideThumbsDown();
				}
			});
			break;
		case 'design':
			panelsIn(true,true,function(){
				pageBgSwap(function(){
					showDesignContent(function(){
						if(callback){callback();}
						slideShow();
					});
					if(thumbState == 'down'){
						slideThumbsUp();
					}
				});
			});
			break;
		case 'home':
			pageBgSwap(function(){
				if(thumbState == 'down'){
					slideThumbsUp();
				}
			});
			break;
		default:
			panelsIn(true,true,function(){
				pageBgSwap(function(){
					showContent(function(){if(callback){callback()}});
					if(thumbState == 'down'){
						slideThumbsUp();
					}
				});
			});

	}
}

function toggleWorkNav(){
	
	if(state === 'work' || state === 'design' || state === 'more'  ){

		if($('.workNav').css('opacity') !== 1){
			$('.workNav').css('display', 'inline-block');
			$('.workNav').animate({
				'opacity': 1
			}, fadeInterval);
		}
	} else {
		if($('.workNav').css('opacity') !== 0){
			$('.workNav').animate({
				'opacity': 0
			},fadeInterval, function(){
				$('.workNav').css('display', 'none');
			});		
		}
	}
}

// animation function
function panelsIn(top,bottom,callback){

	if(top){
		$('#topSlide').animate({
			'left': 0,
		}, fadeInterval);
	}

	$('#leftSlide').animate({
		'top': 0,
	}, fadeInterval, function(){
			if(callback){callback();}
		}
	);
	
	if(bottom){
		$('#bottomSlide').animate({
			'left': 0
		}, fadeInterval);
	}
}

function closePage(state, callback){
	
	if(state === 'accolades' || state === 'work'  || state === 'more'){
		panelsOut(function(){
			fadeOutContent(function(){callback()});
		});
	}else{
		panelsOut(function(){
			hideContent(function(){callback()});
		});
	}
}

function panelsOut(callback){

	$('#topSlide').animate({
		'top': $(this).height() * -1,
	}, fadeInterval, function(){
		resetPanels();
	});

	$('#leftSlide').animate({
		'left': windowWidth,
		'opacity': 0
	}, fadeInterval, function(){
		resetPanels();
	});

	$('#bottomSlide').animate({
		'top': windowHeight,
	}, fadeInterval, function(){
		resetPanels();
	});

	if(callback){callback();}

}

function hideContent(callback){
	$('#pageContent').animate({
		'left': windowWidth,
		'opacity': 0
	}, fadeInterval, function(){
		resetPanels();
		$('#pageContent').css('opacity', 1);
		if(callback){callback();}
	});
}

function fadeOutContent(callback){
	$('#pageContent').animate({
		'opacity': 0
	}, fadeInterval, function(){
		resetPanels();
		if(callback){callback();}
	});
}

function resetPanels(callback){

	$('#topSlide').css({'top' : 0, 'left': windowWidth});
	$('#leftSlide').css({'top' : windowHeight *-1,'left': 0,'opacity': 1});
	$('#bottomSlide').css({'top' : windowHeight-$('#bottomSlide').height(), 'left': windowWidth *-1});
	$('#pageContent').css({'opacity': 1, 'left': windowWidth});

	if(callback){callback();}
}

function pageBgSwap(callback){
	
	$('#pageBackground').css({
		'opacity': 0,
		'background-image': 'url("images/backgrounds/'+state+'.jpg")',
	}).animate({
		'opacity': 1
	}, fadeInterval, function(){
		$('#bgContainer').css('background-image', 'url("images/backgrounds/'+state+'.jpg")');
		if(callback){callback();}
	});
}

function showContent(callback){

	// content elements
	$('#pageContent').css({
		'height': windowHeight - ($('#topSlide').height() + $('#bottomSlide').height()),
		'width': windowWidth - $('#leftSlide').width(),
		'top': $('#topSlide').height()
	});

	$('#pageContent').css({'background-color': 'rgba(126, 129, 129, 1)'});
	
	$('#pageContent').animate({
		'left': $('#leftSlide').width()
	}, fadeInterval, function(){
		if(callback){callback();}
	});
}

function showDesignContent(callback){

	// content elements
	$('#pageContent').css({
		'height': windowHeight - ($('#topSlide').height() + $('#bottomSlide').height()),
		'width': windowWidth,
		'top': $('#topSlide').height()
	});

	$('#pageContent').css({
		'background-color': 'rgba(126, 129, 129, 1)',
	});
	
	$('#pageContent').animate({
		'left': 0
	}, fadeInterval, function(){
		if(callback){callback();}
	});

	$('#playReel').on('click', function(e){
		e.preventDefault();
		thumbID = $(this).attr("data");
		thumbUniqueID = $(this).attr("href");
		$.address.value('/trailers/' + $(this).attr("data"));
	});
}

function showNotablesContent(){
	var top = $('#pageContent').position().top;
	
	$('#notableContentClose').css({'top': -top + 18});
	$('#pageContent').css({
		'top': windowHeight,
		'left': 0,
		'width': windowWidth,
		'height': windowHeight - ($('#topSlide').height() + $('#bottomSlide').height()),
	});

	$('#pageContent').animate({
		'top': top
	}, fadeInterval);
}

function showAccoladesContent(){
	var top = $('#pageContent').position().top;
	var accoThumbCount = $('.accoThumb').size();
	var accoContainerWidth = accoThumbCount * (thumbWidth + 30);

	pageBgSwap();

	$('#pageContent').css({
		'background-color': 'transparent',
		'top': windowHeight,
		'left': 0,
		'width': windowWidth,
		'height': windowHeight
	});

	$('#accolades').css({'width': viewPortWidth,'padding': 0});
	$('#accoladesContainer').css({'width': accoContainerWidth});
	$('.awardsKey').css({'opacity': 0});
	$('#featuredAccolades').css({'top': windowHeight});
	$('.thumb').css({'width' : thumbWidth,'height' : thumbHeight});

	// chained animations
	$('#pageContent').animate({'top': 0}, fadeInterval, function(){
		$('#featuredAccolades').animate({'top': windowHeight * 0.18888888888}, fadeInterval, function(){
			$('.awardsKey').animate({'opacity': 1}, fadeInterval);
		});
	});

	// click on thumb
	$('.featuredThumb').on('click', function(e){
		e.preventDefault();
		thumbID = $(this).attr("id");
		thumbUniqueID = $(this).attr("data");
		$.address.value('/trailers/' + $(this).attr("id"));
	});
}

function showWorkContent(callback){
	var workThumbCount = $('#workContent').attr("data");
	var workPageCount = Math.ceil(workThumbCount/15);

	$('#pageContent').css({
		'background-color': 'transparent',
		'top': windowHeight,
		'left': 0,
		'width': windowWidth,
		'height': windowHeight
	});

	$('#workPagesContainer').css({'width': workPageCount * windowWidth});
	$('.workPage').css({'width': windowWidth});

	$('#pageContent').animate({
		'top': 0
	}, fadeInterval, function(){
		workScroll();
		if(callback){callback()};
	});

}

function showArticle(){
	var top = $('#pageContent').position().top;
	var height = $('#thumbAndNavContainer').position().top;

	$('#notableArticle').css({
		'opacity': 1,
		'top': windowHeight,
		'height': height - 10
	}).animate({
		'top': 10
	}, fadeInterval);
}

function hideArticle(){
	$('#notableArticle').animate({
		'opacity': 0,
	}, function(){
		$(this).css({
			'top': windowHeight
		});
	});
}

function slideThumbsUp(callback){
	$('#thumbnailsContainer').animate({'top': 0}, fadeInterval, function(){
		if(callback){callback();}
	});
	$('#thumbnails').css({'visibility': 'visible'});
	thumbState = 'up';
}

function slideThumbsDown(callback){
	$('#thumbnailsContainer').animate({'top': 136}, fadeInterval, function(){
		$('#thumbnails').css({'visibility': 'hidden'});
		if(callback){callback();}
	});
	thumbState = 'down';	
}

function slideShow() {

	setTimeout(function(){
		if($('#designContent').find('.slideContents').length > 0){
			var slideLength = $('#designContent').find('.slideContents').find('li').length;
			currentSlide ++ ;
			if(currentSlide >= slideLength){
					currentSlide = 0;
			}
			$('#designContent').find('.slide').animate({opacity:0}, 800, function(){
				$('#designContent').find('.slide').css('background-image', 'url(images/slides/' + $('#designContent').find('#slide_'+ currentSlide).attr('src')+')');
				$('#designContent').find('.slide').delay(800).animate({opacity:1}, 800, function(){
				$('#designContent').find('.slide').animate({opacity:1}, 3000, slideShow());
				});
			});
		} else {
			currentSlide = 0;
		}
	}, fadeInterval);
}

function sidewaysScroll(){
	var thumbpoints = [];
	var thumbcurrentPage = 0;
	var thumbposCount = 0;
	
	$('.thumb').each(function(){
		
		if(thumbposCount % 5=== 0){
			thumbpoints.push($(this).position().left);
		}
		thumbposCount ++;
	});

	$('#thumbLeft').on('click', function(){
		if(thumbcurrentPage !== 0){
			thumbcurrentPage --;
			$('#thumbnails').animate({
        		scrollLeft: thumbpoints[thumbcurrentPage]
   			}, scrollInterval);
		}
	});

	$('#thumbRight').on('click', function(){
		if(thumbcurrentPage !== thumbpoints.length){
			thumbcurrentPage ++;
			$('#thumbnails').animate({
        		scrollLeft: thumbpoints[thumbcurrentPage]
   			}, scrollInterval);
		}
	});

	$('#thumbnails').scroll(function(){
		if( document.getElementById('thumbnails').scrollLeft > thumbpoints[thumbcurrentPage]){
			thumbcurrentPage ++;
		}
		if( document.getElementById('thumbnails').scrollLeft < thumbpoints[thumbcurrentPage-1]){
			thumbcurrentPage --;
		}
	});
}

function workScroll(){
	var points = [];
	var currentPage = 0;
	var scrollTimer;
	
	$('.workPage').each(function(){
		points.push($(this).offset().left);
	});

	$('#workLeftScroll').on('click', function(){
		if(currentPage !== 0){
			currentPage --;
			$('#workContent').animate({
        		scrollLeft: points[currentPage]
   			}, scrollInterval);
		}
	});

	$('#workRightScroll').on('click', function(){
		if(currentPage !== points.length){
			currentPage ++;
			$('#workContent').animate({
        		scrollLeft: points[currentPage]
   			}, scrollInterval);
		}
	});

	$('#workLeftScroll').hover(function(){
		if(currentPage !== 0){
			$('#workContent').animate({
        		scrollLeft: points[currentPage]-thumbWidth/2
   			}, scrollInterval/2);
		}
	},function(){
		if(currentPage !== 0){
			$('#workContent').animate({
        		scrollLeft: points[currentPage]
   			}, scrollInterval/2);
		}
	});

	$('#workRightScroll').hover(function(){
		if(currentPage !== points.length){
			$('#workContent').animate({
        		scrollLeft: points[currentPage]+thumbWidth/2
   			}, scrollInterval/2);
		}
	},function(){
		if(currentPage !== points.length){
			$('#workContent').animate({
        		scrollLeft: points[currentPage]
   			}, scrollInterval/2);
		}
	});
}

function showVideo(id, uniqueID, callback){

	$.ajax({
	    url: "fns/ajxShowVideo.php",
	    data: {	"uniqueID": uniqueID,
				"id": id	
		},
	    type: "POST",
	    success: function( text ) {

	    	$('#videoContainer').empty();
	    	$('#videoContainer').html( text ); 
	    	$('#videoContainer').css('display', 'block');
	    	$('#videoContainer').animate({'opacity': 1}, fadeInterval);
	    	$('.links a').each(function(){
	    		if($(this).attr("id") == id){
	    			$(this).css('border-bottom', '1px solid #d1d1d1');
	    		}
	    	});

	    	$(function(){
			    $("#video").bind("loadedmetadata", function () {
			        var width = this.videoWidth;
			        var height = this.videoHeight;			      
			    });
			});
	    },
	    error: function( xhr, status, errorThrown ) {
	        alert( "Sorry, there was a problem!" );
	        console.log( "Error: " + errorThrown );
	        console.log( "Status: " + status );
	        console.dir( xhr );
	    },
	    complete: function( xhr, status ) {
	    	if(callback){callback()}
	    }
	});
}

function showPage(page, callback){

	page = page.replace('/', '');
	// check to see if not already there (may happen when closing a trailer)
	if(state !== page){

		$.ajax({
		    url: "fns/ajxPage.php",
		    data: {	"page": page},
		    type: "POST",
		    success: function( text ) {

			    closePage(state, function(){
					state = page;
				    openPage(function(){if(callback){callback();}});
				    $('#pageContent').empty();
					$('#pageContent').html( text );
			    });		    	
		    },
			error: function( xhr, status, errorThrown ) {
		        alert( "Sorry, there was a problem!" );
		        console.log( "Error: " + errorThrown + " Status: " + status + "xhr: " + xhr);
			},
			complete: function( xhr, status ) {
		    }
		});
	} else {
		if(callback){callback();}
	}
}

function showNotableArticle(id){

	$.ajax({
	    url: "fns/ajxPage.php",
	    data: {	"page": 'notableArticle',
	    		"id": id
		},
	    type: "POST",
	    success: function( text ) {

	    	setTimeout(function(){
	    		showArticle();
				$('#notableArticle').empty();
		    	$('#notableArticle').html( text );
	    	}, fadeInterval);
	    },
	    error: function( xhr, status, errorThrown ) {
	        alert( "Sorry, there was a problem!" );
	        console.log( "Error: " + errorThrown );
	        console.log( "Status: " + status );
	        console.dir( xhr );
	    },
	    complete: function( xhr, status ) {
	    }
	});
}
