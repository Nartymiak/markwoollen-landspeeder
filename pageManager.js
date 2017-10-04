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
var arrCount = 0;
var thumbcurrentPage = 0;
var thumbposCount = 0;
var fullScreen = false;

function pageManager(){
	
	scaleElements();
	thumbLogic();
	thumbNavLogic();
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

		initialized = true;
	},fadeInterval);
}

function reload(){

	var resizeTimer;

	if(fullScreen !== true){
	  	clearTimeout(resizeTimer);
	  	resizeTimer = setTimeout(function() {
	    	window.location.reload(false);          
	  	}, 250);
	}
}

//thumbnails
function scaleElements(){

	var thumbCount, fontSize, s, px, thumbAndNavContainerHeight;

	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	ratio = windowWidth/windowHeight;

	fontSize = Math.round(windowHeight * 0.02539682539);

	if (ratio > 1.5){
		thumbAndNavContainerHeight = (windowHeight * .20359281437) * (ratio *.75);
	} else if (ratio > 1){
		thumbAndNavContainerHeight = (windowHeight * .20359281437);
	} else {
		thumbAndNavContainerHeight = (windowHeight * .20359281437) * ratio;
	}

	if(windowWidth < 769){
		fontSize = fontSize * .75;
		thumbAndNavContainerHeight = (windowHeight * .20359281437) * (ratio *.75);
	}
	s = fontSize.toString();
	$('body').css('font-size', s+"px");

	// thumbnails
	thumbCount = $('.thumb').size();
	viewPortWidth = windowWidth * .88571428571;
	thumbWidth = viewPortWidth / 5;
	containerWidth = thumbCount * thumbWidth + 1;
	thumbMargin = thumbWidth * .05649717514;
	thumbWidth = thumbWidth - (thumbMargin * 2);
	//thumbHeight = windowHeight * .09730538922;
	thumbHeight = thumbWidth * .41139240506;

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
		'height': thumbAndNavContainerHeight,
		'top': thumbAndNavContainerHeight *-1
	});
	$('#nav ul li a').css({
		'line-height': thumbAndNavContainerHeight * .3235294117 + 'px'
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
}

function thumbNavLogic(){
switch(state){
		case 'accolades':
			accoScroll();
			break;
		case 'work':
		case 'more':
			workScroll();
			break;
		default:
			sidewaysScroll();
	}
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
		fullScreen = false;
		$.address.value(state);
	});

	$('#videoContainer').on('click', '.links a', function(){
		showVideo($(this).attr("id"), $(this).attr("data"));
	});

	$('#videoContainer').on('click', '.vjs-fullscreen-control', function(){
		fullScreen = true;
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
					if(eventQueue.length === 0){
						transitioning = false;
					} else {
						arrloop();
					}
				} else if(trailerCheck[1] === 'trailers'){
					showVideo(trailerCheck[2], thumbUniqueID, function(){
						if(eventQueue.length === 0){
							transitioning = false;
						} else {
							arrloop();
						}
					});
					$('#beginBlack').css('opacity', 0);
					initialized = true;

				} else {
					showPage(eventObj.value, (function(){
						if(eventQueue.length === 0){
							transitioning = false;
						} else {				
							arrloop();
						}
					}));
					$('#beginBlack').css('opacity', 0);
					initialized = true;

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

	$('#pageContent').on('click', '.notableVideoLink', function(e){
		e.preventDefault();
		showVideo($(this).attr("id"), $(this).attr("data"));
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
			console.log($(this).html());
			$(this).addClass('selected');
		}else{
			$(this).removeClass('selected');
		}
	});

	//toggleWorkNav();

	switch(state){
		case 'notables':
			panelsIn(true,true,function(){
				pageBgSwap(function(){
					showNotablesContent(function(){if(callback){callback();}thumbNavLogic();});
					if(thumbState == 'up'){
						slideThumbsDown();
					}
				});
			});
			break;

		case 'accolades':
			panelsIn(false,false,function(){			
				showAccoladesContent(function(){if(callback){callback();}thumbNavLogic();});
				if(thumbState == 'up'){
					slideThumbsDown();
				}
			});
			break;

		case 'work':
		case 'more':
			pageBgSwap(function(){
				showWorkContent(function(){if(callback){callback();}thumbNavLogic();});
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
						thumbNavLogic();
					});
					if(thumbState == 'down'){
						slideThumbsUp();
					}
				});
			});
			break;
		case 'home':
			pageBgSwap(function(){
				if(thumbState == 'down'){slideThumbsUp();}
				if(callback){callback();}thumbNavLogic();
			});
			break;
		default:
			panelsIn(true,true,function(){
				pageBgSwap(function(){
					showContent(function(){if(callback){callback()}thumbNavLogic();});
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

function showNotablesContent(callback){
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
	}, fadeInterval, function(){if(callback){callback();}});
}

function showAccoladesContent(callback){
	var accoThumbCount = $('.accoThumb').size();

	pageBgSwap();

	$('#pageContent').css({
		'background-color': 'transparent',
		'top': windowHeight,
		'left': 0,
		'width': windowWidth,
		'height': windowHeight
	});
	$('.awardsKey').css({'opacity': 0});
	$('#featuredAccolades').css({'top': windowHeight});
	$('#accolades').css({
		'width': viewPortWidth,
		'padding': 0
	});
	$('.accoThumb').css({ 
		'width' : thumbWidth,
		'height' : thumbHeight,
		'margin-left': thumbMargin,
		'margin-right': thumbMargin
	});
	$('#accoladesContainer').css({
		'width': containerWidth
	});

	// chained animations
	$('#pageContent').animate({'top': 0}, fadeInterval, function(){
		$('#featuredAccolades').animate({'top': windowHeight * 0.18888888888}, fadeInterval, function(){
			$('.awardsKey').animate({'opacity': 1}, fadeInterval, function(){if(callback){callback();}});
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
		if(callback){callback()};
	});

}

function showArticle(){
	var top = $('#pageContent').position().top;
	var height = $('#thumbAndNavContainer').position().top;

	$('#notableArticle').css({
		'opacity': 1,
		'top': windowHeight,
		'height': height - 25
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
	var thumbScrollTimer;
	
	$('.thumb').each(function(){
		
		if(thumbposCount % 5=== 0){
			thumbpoints.push($(this).position().left);
		}
		thumbposCount ++;
	});

	$('#thumbLeft').off();
	$('#thumbLeft').on('click', function(){
		if(state !== 'work' && state !== 'more' && state !== 'accolades'){

			if(thumbcurrentPage !== 0){
				thumbcurrentPage --;
				$('#thumbnails').animate({
	        		scrollLeft: thumbpoints[thumbcurrentPage]
	   			}, scrollInterval);
			}
		}
	});

	$('#thumbRight').off();
	$('#thumbRight').on('click', function(){
		if(state !== 'work' && state !== 'more' && state !== 'accolades'){

			if(thumbcurrentPage !== thumbpoints.length){
				thumbcurrentPage ++;
				$('#thumbnails').animate({
	        		scrollLeft: thumbpoints[thumbcurrentPage]
	   			}, scrollInterval);
			}
		}
	});

	$('#thumbnails').scroll(function(){
		
		if(thumbScrollTimer) {
			window.clearTimeout(thumbScrollTimer);
		}

		thumbScrollTimer = window.setTimeout(function() {
			
			thumbcurrentPage = (Math.round(document.getElementById('thumbnails').scrollLeft / viewPortWidth));
			
		},250);

	});
}

function accoScroll(){
	var accoThumbPoints = [];
	var accoThumbCurrentPage = 0;
	var accoThumbPosCount = 0;
	var accoThumbScrollTimer;
	
	$('.accoThumb').each(function(){
		
		if(accoThumbPosCount % 5=== 0){
			accoThumbPoints.push($(this).position().left);
		}
		accoThumbPosCount ++;
	});

	$('#thumbLeft').off();
	$('#thumbLeft').on('click', function(){
		if(accoThumbCurrentPage !== 0){
			accoThumbCurrentPage --;
			$('#accolades').animate({
	        	scrollLeft: accoThumbPoints[accoThumbCurrentPage]
	   		}, scrollInterval);
		}
	});
	
	$('#thumbRight').off();
	$('#thumbRight').on('click', function(){
		if(accoThumbCurrentPage !== accoThumbPoints.length){
			accoThumbCurrentPage ++;
			$('#accolades').animate({
	        	scrollLeft: accoThumbPoints[accoThumbCurrentPage]
	   		}, scrollInterval);
		}
	});

	$('#accolades').scroll(function(){
		
		if(accoThumbScrollTimer) {
			window.clearTimeout(accoThumbScrollTimer);
		}

		accoThumbScrollTimer = window.setTimeout(function() {
			
			accoThumbCurrentPage = (Math.round(document.getElementById('accolades').scrollLeft / viewPortWidth));
			
		},250);

	});
}

function workScroll(){
	var points = [];
	var currentPage = 0;
	var workScrolling = false;
	var workScrollTimer;
	
	$('.workPage').each(function(){
		points.push($(this).offset().left);
	});

	$('#thumbLeft').off();
	$('#thumbLeft').on('click', function(){
		
		if(currentPage !== 0){
			workScrolling = true;
			$('#workContent').animate({
        		scrollLeft: points[currentPage-1]
   			}, scrollInterval, function(){workScrolling = false;});
		}
	});

	$('#thumbRight').off();
	$('#thumbRight').on('click', function(){

		if(currentPage !== points.length){
			workScrolling = true;
			$('#workContent').animate({
        		scrollLeft: points[currentPage+1]
   			}, scrollInterval, function(){workScrolling = false;});
		}

	});

	$('#workLeftScroll').on('click', function(){

		if(currentPage !== 0){
			workScrolling = true;
			$('#workContent').animate({
        		scrollLeft: points[currentPage-1]
   			}, scrollInterval, function(){workScrolling = false;});
		}
	});

	$('#workRightScroll').on('click', function(){

		if(currentPage !== points.length){
			workScrolling = true;
			$('#workContent').animate({
        		scrollLeft: points[currentPage+1]
   			}, scrollInterval, function(){workScrolling = false;});
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
			if(workScrolling === false){
				$('#workContent').animate({
	        		scrollLeft: points[currentPage]
	   			}, scrollInterval/2);
			}
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
			if(workScrolling === false){
				$('#workContent').animate({
		        	scrollLeft: points[currentPage]
		   		}, scrollInterval/2);
			}
		}
	});

	$('#workContent').scroll(function(){
		
		if(workScrollTimer) {
			window.clearTimeout(workScrollTimer);
		}

		workScrollTimer = window.setTimeout(function() {		
			currentPage = (Math.round(document.getElementById('workContent').scrollLeft / windowWidth));

		},100);
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
	    	videojs(document.getElementById('video'), {"fluid": true}, function() {
	  	    	
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
