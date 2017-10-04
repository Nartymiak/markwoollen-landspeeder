<?php
	include_once('includeList.php');

	$details;
	$linkedTrailers;

	$uniqueID = $_POST['uniqueID'];
	$id = $_POST['id'];

	

	if($uniqueID == null || $uniqueID == ''){

		$uniqueID = getTrailerUniqueID($id);

	}
	
	$details = getTrailerDetails($uniqueID);
	$linkedTrailers = getLinkedTrailers($uniqueID);



	$temp = array();
	$linkAddress = 1;
	
	// linked trailers comes out very straight forward, turn it into an indexable array
	if(!empty($linkedTrailers)){
		for($i=1;$i <= count($linkedTrailers[0]);$i++){
			if($i%2 == 1){
				if ($linkedTrailers[0]['pos' .$linkAddress. '_id'] != NULL){
					array_push($temp, array($linkedTrailers[0]['pos' .$linkAddress. '_id'], $linkedTrailers[0]['pos' .$linkAddress. '_label']));
				}
				$linkAddress ++;
			}
		}
	}

	?>	
	<div class="wrapper">
		<div class="title">
			<h2><?php echo htmlspecialchars($details['name']);?></h2>
			<p><a><i class="fa fa-times closeButton" aria-hidden="true"></i></a></p>
		</div>
		<div class="videoPlayer">
			<video id="video" class="video-js" controls preload="none" autoplay poster="../../img/poster/<?php echo $id; ?>.jpg" data-setup="{}">
				<source src="http://www.markwoollen.com/video/<?php echo $id; ?>.mp4">
				<source src="http://www.markwoollen.com/video/<?php echo $id; ?>.webm">
				<source src="http://www.markwoollen.com/video/<?php echo $id; ?>.ogg">
			    <p class="vjs-no-js">
			      To view this video please enable JavaScript, and consider upgrading to a web browser that
			      <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
			    </p>
			</video>
		</div>
		<div class="links">
	<?php
		
		if(!empty($temp)){
			$i=0;
			foreach($temp as $link){
				if($i !== 0){ echo " <span style=\"margin-left:10px;\"> | </span>"; }
				echo "<a id=\"" .$link[0]. "\" data=\"" .$uniqueID. "\">" .$link[1]."</a>\r\n";
				$i++;
			}
		}
	?>
		</div>
	</div>