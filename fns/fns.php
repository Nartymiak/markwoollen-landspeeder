<?php

// writes a html header
function htmlHeader() {

?>
	<!DOCTYPE html>
	<html>
		<head>
			<title>Mark Woollen &amp; Associates</title>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<meta name="author" content="MWA">
			<meta name=viewport content="width=device-width, initial-scale=1">
			<!-- no cashing of this page -->
			<meta http-equiv="Expires" content="Tue, 01 Jan 2000 12:12:12 GMT">
			<meta http-equiv="Pragma" content="no-cache">
			<!-- facebook meta -->
			<meta property="og:url" content="http://markwoollen.com">
			<meta property="og:title" content="Mark Woollen & Associates">
			<meta property="og:description" content="Mark Woollen & Associates has created some of the most memorable and effective motion picture advertising of the last twenty years.">
			<meta property="og:image" content="http://markwoollen.com/img/mwa.jpg">
			<!-- end facebook meta -->
	    	<link rel="stylesheet" href="css/markwoollen.css" type="text/css" />
	    	<link rel="stylesheet" href="fonts/css/font-awesome.min.css">
	  		<!-- third party apis -->
			<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
			<script src="js/jquery-ui-EFFECTS.js"></script>
			<script src="js/jquery.address-1.5.min.js"></script>
			<!-- custom js for mwa -->
			<script src="js/pageManager.js"></script>
	 	</head>

	 	<body>
<?php	
}

function htmlBody(){
?>
	
	<div id="bgContainer"><div id="beginBlack"></div></div>
	<div id="videoContainer"></div>
	<div id="pageContainer">
		<div id="pageBackground"></div>
		<div id="topSlide"></div>
		<div id="leftSlide"></div>
		<div id="bottomSlide"></div>
		<div id="pageContent"></div>
	</div>
	<div id="thumbAndNavContainer">
<?php
	thumbnails();
	nav();
?>
	</div>
<?php
}

function nav(){
?>
			<div id="nav">
				<ul>
					<li class="home"><a href="home"><!--home--></a></li>
					<li><a href="profile">profile</a></li>
					<li><a href="connect">connect</a></li>
					<li><a href="work">work</a></li>
				</ul>
			</div>
<?php
}

function thumbnails(){
	// query for trailers
	$trailers = getTrailers('work');

	echo "	<div id=\"thumbnails\">\r\n";
	echo "		<div id=\"thumbnailsContainer\">\r\n";
	
	foreach ($trailers as $trailer) {
	?>
		<div class="thumb" id="<?php echo $trailer['id']?>" data="<?php echo $trailer['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $trailer['id']?>.jpg) center center / cover no-repeat;" >
			<div class="thumbTitle" style="display: none;"><?php echo $trailer['name']?></div>
		</div>
	<?php
	}
	echo "		<div class=\"clear\"></div></div>\r\n";
	echo "	</div>\r\n";
}

// writes a html footer
function htmlFooter(){
?>
	    	<!-- custom js -->
			<script language="Javascript">
				
				$(document).ready(function() { 
					pageManager();
				});

		 	</script>
		</body>
	</html>

<?php
}
?>

