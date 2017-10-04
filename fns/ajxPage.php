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
						<a id="press" href="notables">notables</a>
						<a id="awards" href="accolades">accolades</a>
						<div class="clear"></div>
					</div>

	<?php
	} else if ($pageID == 'connect'){
	?>

				<div id="profileContent">
					<p>General Inquiries &#45; <a href='mailto:info@markwoollen.com'>info@markwoollen.com</a></p>
					<p>Scott Mitsui, Creative Director &#45; <a href='mailto:scott@markwoollen.com'>scott@markwoollen.com</a></p>
					<p>Jeremy Greene, Creative Director &#45; <a href='mailto:jeremy@markwoollen.com'>jeremy@markwoollen.com</a></p>
					<p>
						<a href='javascript:mPageManager.showMap()styleDefault.css'>207 Ashland Ave. Santa Monica, CA 90405</a>
						<br>
						Tel. 310&#45;399&#45;2690
						<br>
						<br>
						MWA is always accepting resumes/reels from talented and experienced editors
						<br>
						<a href='mailto:jobs@markwoollen.com'>jobs@markwoollen.com</a>
						<br>
						<br>
						<a href='http://www.facebook.com/pages/Mark&#45;Woollen&#45;Associates/262877575207?sk=wall' target='top'><img src='http://markwoollen.com/img/facebook.png' border=0></a> &nbsp; <a href='http://twitter.com/#!/MarkWoollen' target='top'><img src='http://markwoollen.com/img/twitter.png' border=0></a>
					</p>
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
							?>

									<div class="row">
										<a class="notableLink" id ="<?php echo $article['id']?>" href="<?php echo $article['localLink'] ?>">
											<p><?php echo $article['blurb'] ?> (more)</p>
											<p class="title"><?php echo $article['title'] ?></p>
										</a>
									</div>

							<?php
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
		
			echo '<div id="articleInner">'.$content['content']. '</div>';

		}
	} else if ($pageID == 'accolades'){

		$accolades = getAccolades();
		$featured = getFeaturedAccolades();

		?>
			<div id="accoladeContent">
				<div id="featuredAccolades">
					<div class="left">
						<p></p>
					</div>
					<div class="right">
						<div class="featuredThumbWrapper">
						<?php 
							foreach($featured as $feature){
							?>
								<div class="thumb" id="<?php echo $feature['id']?>" data="<?php echo $feature['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $feature['id']?>.jpg) center center / cover no-repeat;" >
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
				<div id="accolades">
						<?php 
							foreach($accolades as $accolade){
							?>
								<div class="thumb" id="<?php echo $accolade['id']?>" data="<?php echo $accolade['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php echo $accolade['id']?>.jpg) center center / cover no-repeat;" >
									<div class="featuredThumbTitle" style="display: none;"><?php echo $accolade['name']?></div>
								</div>
							<?php
							}
						?>
				<div class="clear"></div>		
				</div>
			</div>
		<?php
	}
?>






