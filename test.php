<?php include_once('fns/includeList.php');
$trailers = getWork();
$i=0;
?>

		<div id="workContent">
			<div id="workPagesContainer">
				<?php 
				foreach ($trailers as $trailer) {
					
					if($i === 0){
						echo "<div class=\"workPage\">\r\n";
						echo "<div class=\"workRow\">\r\n"; 
					}

					if($i%5 === 0 && $i!== 0){
						echo "</div><!-- end row -->\r\n";
						if($i%15 === 0){
							echo "</div><!-- end page -->\r\n";
							echo "<div class=\"workPage\">\r\n";
						}
						echo "<div class=\"workRow\">\r\n";
					}
					?>
						<div href="<?php //echo $trailer['name']?>" class="thumb workThumb" id="<?php //echo $trailer['id']?>" data="<?php //echo $trailer['uniqueID']?>" style="background:url(//markwoollen.com/img/thumbs/<?php //echo $trailer['id']?>.jpg) center center / cover no-repeat;" >
							<p>thumb</p>
							<div class="thumbTitle" style="display: none;"><?php //echo $trailer['name']?></div>
						</div>
					<?php
					$i++;
				}
				echo "		</div class=\"clear\"></div>\r\n";
				echo "		</div><!-- end row -->\r\n"; 
				echo "</div><!-- end workPage -->\r\n";
				?>
				<div class="clear"></div>
			</div>
		</div>