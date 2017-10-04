var fadeInterval = 1200;
var state = 'home';
var thumbState = 'down';
var viewPortHeight, viewPortWidth, containerWidth, thumbWidth, thumbHeight;
var windowWidth, windowHeight;

function pageManager(){
	scaleElements();
	thumbLogic();
	videoLogic();
	navLogic();
	beginAnimation();

	window.onresize = scaleElements;

}

function beginAnimation(){
	
	setTimeout(function(){
		slideThumbsUp();
		$('#beginBlack').animate({
			'opacity': 0
		}, fadeInterval, function(){
			$('#beginBlack').css('display', 'none');
		});
	}, fadeInterval);
}

//thumbnails
function scaleElements(){

	var thumbCount;

	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	var fontSize = Math.round(windowHeight * 0.02539682539);
	var s = fontSize.toString();

	$('body').css('font-size', s+"px");

	// thumbnails
	thumbCount = $('.thumb').size();
	viewPortWidth = windowWidth * .90606060608;
	// thumbnails equals (the container width - the total padding) / 5
	thumbWidth = ($('#thumbnails').width() - 128)/5 ;
	thumbHeight = windowHeight * .09730538922;
	containerWidth = thumbCount * (thumbWidth + 30);
	// set stuff
	$('#thumbnails').css({
		'width': viewPortWidth,
		'padding': 0
	});
	$('.thumb').css({ 
		'width' : thumbWidth,
		'height' : thumbHeight
	});
	$('#thumbnailsContainer').css({
		'width': containerWidth
	});
	$('#thumbAndNavContainer').css({
		'top': $('#thumbAndNavContainer').height() *-1
	});
}

function thumbLogic(){
	
	$('.thumb').hover(
		function(){$(this).children().css('display', 'block')},
		function(){$(this).children().css('display', 'none')}
	);

	$('body').on('click', '.thumb', function(){
		showVideo($(this).attr("id"), $(this).attr("data"));
	});
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

	});

	$('#videoContainer').on('click', '.links a', function(){
		showVideo($(this).attr("id"), $(this).attr("data"));
	});
}

function navLogic(){
	$("#nav li a").on('click', function(e){
		e.preventDefault();
		showPage($(this).attr("href"));
	});

	$("#pageContainer").on('click', '#profileSubNav a', function(e){
		e.preventDefault();
		showPage($(this).attr("href"));
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
		showPage('profile');
		console.log('click');
	});
}

function openPage(){

	$('#pageContainer').css({
		'display': 'block',
		'opacity': 1
	});

	if(state === 'notables'){

		panelsIn(true,true,function(){
			pageBgSwap(function(){
				showNotablesContent();
				if(thumbState == 'up'){
					slideThumbsDown();
				}
			});
		});
		
	}else if(state === 'accolades'){
		
		panelsIn(false,false,function(){			
			showAccoladesContent();
			if(thumbState == 'up'){
				slideThumbsDown();
			}
		});

	}else if(state === 'work'){
		
		panelsIn(false,false,function(){
			pageBgSwap(function(){
				showAccoladesContent();
				if(thumbState == 'up'){
					slideThumbsDown();
				}
			});
		});

	} else {
		panelsIn(true,true,function(){
			pageBgSwap(function(){
				showContent();
				if(thumbState == 'down'){
					slideThumbsUp();
				}
			});
		});
	}
}

function closePage(state){
	
	if(state == 'accolades'){
		panelsOut(function(){
			fadeOutContent();
		});
	}else{
		panelsOut(function(){
			hideContent();
		});
	}
}

function resetPanels(callback){

	$('#topSlide').css({
		'top' : 0,
		'left': windowWidth
	});
	$('#leftSlide').css({
		'top' : windowHeight *-1,
		'left': 0
	});
	$('#bottomSlide').css({
		'top' : windowHeight-$('#bottomSlide').height(),
		'left': windowWidth *-1
	});
	$('#pageContent').css({
		'opacity': 1,
		'left': windowWidth
	});

	if(callback){callback();}

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
			'left': 0,
		}, fadeInterval);
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

	$('#pageContent').css({
		'background-color': 'rgba(126, 129, 129, 1)',
	});
	
	$('#pageContent').animate({
		'left': $('#leftSlide').width()
	}, fadeInterval, function(){
		if(callback){callback();}
	});
}

function hideContent(callback){
	$('#pageContent').animate({
		'left': windowWidth,
		'opacity': 0
	}, fadeInterval, function(){
		if(callback){callback();}
		$('#pageContent').css('opacity', 1);
	});

}

function fadeOutContent(callback){
	$('#pageContent').animate({
		'opacity': 0
	}, fadeInterval, function(){
		resetPanels();
	});

	if(callback){callback();}
}

function showNotablesContent(){
	var top = $('#pageContent').position().top;
	
	$('#notableContentClose').css({'top': -top + 18});
	$('#pageContent').css({
		'top': windowHeight,
		'left': 0,
		'width': windowWidth
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

	$('.awardsKey').css({
		'opacity': 0
	});

	$('#featuredAccolades').css({
		'top': windowHeight
	});

	$('#pageContent').animate({
		'top': 0
	}, fadeInterval);

	setTimeout(function(){
		$('.awardsKey').animate({
			'opacity': 1
		}, fadeInterval);
	},fadeInterval * 2);

	setTimeout(function(){
		$('#featuredAccolades').animate({
			'top': windowHeight * 0.18888888888
		}, fadeInterval);
	},fadeInterval);


	$('#accolades').css({
		'width': viewPortWidth,
		'padding': 0
	});

	$('.thumb').css({ 
		'width' : thumbWidth,
		'height' : thumbHeight
	});

	$('#accoladesContainer').css({
		'width': accoContainerWidth
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
	$('#thumbnailsContainer').animate({
		'top': 0
	}, fadeInterval, function(){
		if(callback){callback();}
	});
	$('#thumbnails').css({'visibility': 'visible'});
	thumbState = 'up';
}

function slideThumbsDown(callback){
	$('#thumbnailsContainer').animate({
		'top': 136
	}, fadeInterval, function(){
		$('#thumbnails').css({'visibility': 'hidden'});
		if(callback){callback();}
	});
	thumbState = 'down';
	
}

function showVideo(id, uniqueID){

		// the server request
		$.ajax({

		    // The URL for the request
		    url: "fns/ajxShowVideo.php",
		 
		    // The data to send (will be converted to a query string)
		    data: {	"uniqueID": uniqueID,
					"id": id	
				},

		    // Whether this is a POST or GET request
		    type: "POST",
		 
		    // Code to run if the request succeeds;
		    // the response is passed to the function
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

		    	$(function () {

				    $("#video").bind("loadedmetadata", function () {
				        var width = this.videoWidth;
				        var height = this.videoHeight;
						console.log(width + " " + height);       
				    });

				});

		    },
		 
		    // Code to run if the request fails; the raw request and
		    // status codes are passed to the function
		    error: function( xhr, status, errorThrown ) {
		        alert( "Sorry, there was a problem!" );
		        console.log( "Error: " + errorThrown );
		        console.log( "Status: " + status );
		        console.dir( xhr );
		    },
		 
		    // Code to run regardless of success or failure
		    complete: function( xhr, status ) {
		        //alert( "The request is complete!" );
		    }
		});

}

function showPage(page){

		// the server request
		$.ajax({

		    // The URL for the request
		    url: "fns/ajxPage.php",
		 
		    // The data to send (will be converted to a query string)
		    data: {	"page": page
				},

		    // Whether this is a POST or GET request
		    type: "POST",
		 
		    // Code to run if the request succeeds;
		    // the response is passed to the function
		    success: function( text ) {

		    	closePage(state);
		    	state = page;
		    	
		    	setTimeout(function(){
		    		$('#pageContent').empty();
		    		$('#pageContent').html( text );
		    	}, fadeInterval);
		    	openPage();
		    	console.log(state);

		    },
		 
		    // Code to run if the request fails; the raw request and
		    // status codes are passed to the function
		    error: function( xhr, status, errorThrown ) {
		        alert( "Sorry, there was a problem!" );
		        console.log( "Error: " + errorThrown );
		        console.log( "Status: " + status );
		        console.dir( xhr );
		    },
		 
		    // Code to run regardless of success or failure
		    complete: function( xhr, status ) {
		        //alert( "The request is complete!" );
		    }
		});
}

function showNotableArticle(id){

		// the server request
		$.ajax({

		    // The URL for the request
		    url: "fns/ajxPage.php",
		 
		    // The data to send (will be converted to a query string)
		    data: {	"page": 'notableArticle',
		    		"id": id
				},

		    // Whether this is a POST or GET request
		    type: "POST",
		 
		    // Code to run if the request succeeds;
		    // the response is passed to the function
		    success: function( text ) {

		    	setTimeout(function(){
		    		showArticle();
					$('#notableArticle').empty();
			    	$('#notableArticle').html( text );
		    	}, fadeInterval);

		    },
		 
		    // Code to run if the request fails; the raw request and
		    // status codes are passed to the function
		    error: function( xhr, status, errorThrown ) {
		        alert( "Sorry, there was a problem!" );
		        console.log( "Error: " + errorThrown );
		        console.log( "Status: " + status );
		        console.dir( xhr );
		    },
		 
		    // Code to run regardless of success or failure
		    complete: function( xhr, status ) {
		        //alert( "The request is complete!" );
		    }
		});

}
