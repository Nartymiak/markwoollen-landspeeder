<?php 
include_once('includeList.php');

$pageID = $_POST['page'];

	if($pageID == 'profile'){
	?>

					<div id="profileContent">
						<p>Mark Woollen &amp; Associates has created some of the most memorable and effective motion picture advertising of the last twenty years. From award&#45;winning campaigns for &#34;Schindler's List,&#34; to &#34;The Social Network&#34; our approach has always been to find the most innovative and intelligent ways to market exceptional films.</p>
						<p>What started as a one&#45;man operation several years ago has grown into a staff of over twenty highly skilled producers, writers, editors and graphic designers, who bring their unique vision to every marketing challenge, from critically acclaimed indies to the year's biggest blockbusters. MWA has become the exclusive agency of choice for many award&#45;winning filmmakers and has created campaigns for some of the biggest Oscar contenders in recent history. Our work has been honored with dozens of Golden Trailer and Key Art Awards and has garnered attention from the New York Times, Vanity Fair, NPR and Wired Magazine.</p>
					</div>
					<div id="profileSubNav">
						<a id="press" href="notables">press</a>
					</div>

	<?php
	} else if ($pageID == 'connect'){
	?>

				<div id="connectContent">
					<p>General Inquiries &#45; <a href='mailto:info@markwoollen.com'>info@markwoollen.com</a></p>
					<p>Jeremy Greene, Creative Director &#45; <a href='mailto:jeremy@markwoollen.com'>jeremy@markwoollen.com</a><br>
					Jared Sapolin, Creative Director &#45; <a href='mailto:jared.sapolin@markwoollen.com'>jared.sapolin@markwoollen.com</a><br>
					Jessica Fox, Creative Director &#45; <a href='mailto:jessicafox@markwoollen.com'>jessicafox@markwoollen.com</a><br>
					Mark Fox, Creative Director &#45; <a href='mailto:markfox@markwoollen.com'>markfox@markwoollen.com</a><br>
					Scott Mitsui, Creative Director &#45; <a href='mailto:scott@markwoollen.com'>scott@markwoollen.com</a>
					</p>
					
					<div style="float:left;padding-right:1em;margin-right:1em;border-right:1px solid #fff">
						<a href='http://www.facebook.com/pages/Mark&#45;Woollen&#45;Associates/262877575207?sk=wall' target='top'><img src='http://markwoollen.com/img/facebook.png' border=0></a> &nbsp; <a href='http://twitter.com/#!/MarkWoollen' target='top'><img src='http://markwoollen.com/img/twitter.png' border=0></a>
					</div>
					<div style="float:left;">
						<p><a href='javascript:mPageManager.showMap()styleDefault.css'>207 Ashland Ave. Santa Monica, CA 90405</a>
						<br>Tel. 310&#45;399&#45;2690</p>
					</div>
					<div class="clear"></div>
					<p>MWA is always accepting resumes/reels from talented and experienced editors<br><a href='mailto:jobs@markwoollen.com'>jobs@markwoollen.com</a></p>
				</div>
	<?php
	} else if ($pageID == 'notables'){
	
	$content = getNotables();

	?>	
				<div id="notableContentClose"><i class="fa fa-times" aria-hidden="true"></i></div>
				<div id="notableContent">
					<div class="left">
					</div>
					<div class="right">
					<?php
						foreach($content as $article){

							if($article['type'] === 'video'){
								$articleUID = getTrailerUniqueID($article['localLink']);
							?>
								<div class="row">
									<a class="notableVideoLink" id ="<?php echo $article['localLink']?>" data="<?php echo $articleUID?>" href="<?php echo $article['localLink'] ?>">
										<p><?php echo $article['blurb'] ?> (video)</p>
										<p class="title"><?php echo $article['title'] ?></p>
									</a>
								</div>						
							<?php
							}else{
							?>
								<div class="row">
									<a class="notableLink" id ="<?php echo $article['id']?>" href="<?php echo $article['localLink'] ?>">
										<p><?php echo $article['blurb'] ?> (more)</p>
										<p class="title"><?php echo $article['title'] ?></p>
									</a>
								</div>
							<?php
							}
						}
					?>
					</div>
					<div class="clear"></div>
				</div>
				<div id="notableArticle">
				</div>
	
	<?php
	}else if ($pageID == 'notableArticle'){
		
		$id = $_POST['id'];

		$content = getNotableArticle($id);


		if(!empty($content)){
			echo '<div id="articleHeader"><p class="title">' .$content['title']. ': ' .$content['date']. '</p><i id="articleClose" class="fa fa-times" aria-hidden="true"></i><div class="clear"></div></div>';	
			echo '<div id="articleInner">'.$content['content'];
			echo '</div>';
		}
	} else if ($pageID == 'accolades'){

		$accolades = getAccolades();
		$featured = getFeaturedAccolades();

		?>
			<div id="accoladeContent">
				<div id="notableContentClose"><i class="fa fa-times" aria-hidden="true"></i></div>
				<div id="featuredAccolades">
					<div class="left">
						<div class="awardsKey"><p></p></div>
					</div>
					<div class="right">
						<div class="featuredThumbWrapper">
						<?php 
							foreach($featured as $feature){
							?>
								<div class="featuredThumb" id="<?php echo $feature['id']?>" data="<?php echo $feature['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $feature['id']?>.jpg) center center / cover no-repeat;" >
									<div class="awardImage" style="background-image:url('images/<? echo $feature['type'];?>_med.png');"></div>
									<div class="featuredThumbTitle"><?php echo $feature['name']?></div>
								</div>
							<?php
							}
						?>
						<div class="clear"></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div id="accoladesBG">
					<div id="accolades">
						<div id="accoladesContainer">
							<?php 
								foreach($accolades as $accolade){

								?>
									<div class="accoThumb thumb" id="<?php echo $accolade['id']?>" data="<?php echo $accolade['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $accolade['id']?>.jpg) center center / cover no-repeat;" >
										<div class="caption">
											<div class="awardImage" style="background-image:url('images/<? echo $accolade['type'];?>_med.png');"></div>
											<div class="thumbTitle" ><?php echo $accolade['name']?></div>
										</div>
									</div>
								<?php
								}
							?>
						<div class="clear"></div>	
						</div>
					</div>
				</div>
			</div>
		<?php
	} else if($pageID == 'work'){

		$trailers = getWork();
		$i=0;

		?>
		<div id="workLeftScroll"></div><div id="workRightScroll"></div>
		<div id="workContent" data="<?php echo sizeof($trailers) ?>">
			<div id="workPagesContainer">
				<?php 
				foreach ($trailers as $trailer) {
					
					if($i === 0){
						echo "<div class=\"workPage\">\r\n";
						echo "<div class=\"workRow\">\r\n";
						echo "<div  class=\"workRowWrapper\">\r\n";
					}

					if($i%5 === 0 && $i!== 0){
						echo "			<div class=\"clear\"></div>\r\n";
						echo "		</div><!-- end wrapper -->\r\n";
						echo "</div><!-- end row -->\r\n";
						if($i%15 === 0){
							echo "</div><!-- end page -->\r\n";
							echo "<div class=\"workPage\">\r\n";
						}
						echo "<div class=\"workRow\">\r\n";
						echo "<div  class=\"workRowWrapper\">\r\n";
					}
					?>
						<div href="<?php echo $trailer['name']?>" class="thumb workThumb" id="<?php echo $trailer['id']?>" data="<?php echo $trailer['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $trailer['id']?>.jpg) center center / cover no-repeat;" >
							<p> </p>
							<div class="thumbTitle"><?php echo $trailer['name']?></div>
						</div>
					<?php
					$i++;
				}

				echo "		<div class=\"clear\"></div>\r\n";
				echo "		</div><!-- end wrapper -->\r\n";
				echo "		</div><!-- end row -->\r\n"; 
				echo "</div><!-- end workPage -->\r\n";
				?>
				<div class="clear"></div>
			</div>
		</div>


		<?php
	}else if($pageID == 'more'){

		$trailers = getMore();
		$i=0;

		?>
		<div id="workLeftScroll"></div><div id="workRightScroll"></div>
		<div id="workContent" data="<?php echo sizeof($trailers) ?>">
			<div id="workPagesContainer">
				<?php 
				foreach ($trailers as $trailer) {
					
					if($i === 0){
						echo "<div class=\"workPage\">\r\n";
						echo "<div class=\"workRow\">\r\n";
						echo "<div  class=\"workRowWrapper\">\r\n";
					}

					if($i%5 === 0 && $i!== 0){
						echo "			<div class=\"clear\"></div>\r\n";
						echo "		</div><!-- end wrapper -->\r\n";
						echo "</div><!-- end row -->\r\n";
						if($i%15 === 0){
							echo "</div><!-- end page -->\r\n";
							echo "<div class=\"workPage\">\r\n";
						}
						echo "<div class=\"workRow\">\r\n";
						echo "<div  class=\"workRowWrapper\">\r\n";
					}
					?>
						<div href="<?php echo $trailer['name']?>" class="thumb workThumb" id="<?php echo $trailer['id']?>" data="<?php echo $trailer['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $trailer['id']?>.jpg) center center / cover no-repeat;" >
							<p> </p>
							<div class="thumbTitle"><?php echo $trailer['name']?></div>
						</div>
					<?php
					$i++;
				}

				echo "		<div class=\"clear\"></div>\r\n";
				echo "		</div><!-- end wrapper -->\r\n";
				echo "		</div><!-- end row -->\r\n"; 
				echo "</div><!-- end workPage -->\r\n";
				?>
				<div class="clear"></div>
			</div>
		</div>


		<?php
	}else if($pageID == 'design'){

		$reelName = 'MWA Graphics Reel';
		$designs = getFeaturedDesigns();
		$reel = getReel($reelName);

		$i=0;

		?>
		<div id="designContent">
			<div class="left">
				<p style="height:100%;">
					MWA employs a team of highly skilled artists and animators who create the motion design for our campaigns and are regularly sought out by other companies for a multitude of design challenges.
					<br><br><a href='mailto:graphics@markwoollen.com'>graphics@markwoollen.com</a>
				</p>
				
				 
				<a id='playReel'data ="<?php echo $reel[0]['id']; ?>" href="115">play reel</a>
			</div>
			<div class="right">
				<div id="designSlide" class='slide'></div>
				<ul class="slideContents" style="display:none">
					<?php
						$count = 0;
						foreach ($designs as $design) { 
							echo '<li id="slide_'.$count.'" src="'.$design['imageName'].'">'.$design['project'].'</li>';
							$count ++;
						}
					?>
				</ul>
			</div>
			<div class="clear"></div>
		</div>

		<?php
	}

?>






