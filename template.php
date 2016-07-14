﻿<?php
	$name = "star picker-upper";
	// basically just a null coelesce
	function get($s,$dv){
		return isset($_GET[$s]) ? $_GET[$s] : $dv;
	}
	$colors = array(
		"text"=>"#FFF",
		"bg"=>"#FF0",
		"btnBg"=>"#B00",
		"btnBgHover"=>"#F00"
	);

	$width = 512;
	$height = 512;

	$includeButtons = true;
?>

<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title><?php echo $name; ?>PICO-8 Cartridge</title>
		<meta name="description" content="">

		<style type="text/css">
		<!--
		html,body{
			padding:0;
			margin:0;
			width:100%;
			height:100%;
		}
		center{
			width:<?php echo $width; ?>px;
			height:<?php echo $height; ?>px;
			position:absolute;
			display:block;
			top:0;
			bottom:0;
			right:0;
			left:0;
			margin:auto;
		}
		canvas#canvas {
			width: <?php echo $width; ?>px;
			height: <?php echo $height; ?>px;

			image-rendering: -moz-crisp-edges;
			image-rendering:   -o-crisp-edges;
			image-rendering: -webkit-optimize-contrast;
			image-rendering: crisp-edges;
			-ms-interpolation-mode: nearest-neighbor;
			image-rendering: pixelated;
		}

		<?php if($includeButtons){ ?>
		.pico8_el {
			float:left;
			width:92px;
			display:inline-block; 
			margin: 1px;
			padding: 4px;
			text-align: center;
			color:<?php echo $colors["text"]; ?>;
			background-color:<?php echo $colors["btnBg"]; ?>;
			font-family : verdana, sans-serif;
			font-size: 9pt;
			cursor: pointer;
			cursor: hand;
		}
		.pico8_el a{
			text-decoration: none;
			color:<?php echo $colors["text"]; ?>;
		}

		.pico8_el:hover,
		.pico8_el:link{
			background-color:<?php echo $colors["btnBgHover"]; ?>;
		}
		<?php } ?>
		-->
		</style>
	</head>

	<body bgcolor=<?php echo $colors["bg"]; ?>>
		<center>
			<div style="width:<?php echo $width; ?>px;">
				<!-- CANVAS -->
				<canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()"></canvas>

				<!-- SCRIPTS -->
				<script type="text/javascript">
					var require = null; // fix for node.js issue (prevents game from running when opened in something like nwjs)

					var canvas = document.getElementById("canvas");
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;

					// show Emscripten environment where the canvas is
					// arguments are passed to PICO-8
					
					var Module = {
						arguments: ["-width","<?php echo $width; ?>","-height","<?php echo $height; ?>"],
					};
					Module.canvas = canvas;
					
					/*
					// When pico8_buttons is defined, PICO-8 takes each int to be a live bitfield
					// representing the state of each player's buttons
					
					var pico8_buttons = [0, 0, 0, 0, 0, 0, 0, 0]; // max 8 players
					pico8_buttons[0] = 2 | 16; // example: player 0, RIGHT and Z held down
					*/
				</script>
				<script async type="text/javascript" src="<?php echo $name; ?>.js"></script>
				<script>
					// key blocker. prevent cursor keys from scrolling page while playing cart.
					function onKeyDown_blocker(event) {
						event = event || window.event;
						var o = document.activeElement;
						if(!o || o == document.body || o.tagName == "canvas"){
							if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1){
								if(event.preventDefault){
									event.preventDefault();
								}
							}
						}
					}

					document.addEventListener('keydown', onKeyDown_blocker, false);
				</script>
				<!-- BUTTONS -->
				<?php if($includeButtons){ ?>
				<div class=pico8_el onclick="Module.pico8Reset();"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAaklEQVR4Ae2dOwoAMQhE15A+rfc/3bZ7AlMnQfywCkKsfcgMM9ZP+QHtIn0vLeBAFduiFdQ/0DmvtR5LXJ6CPSXe2ZXcFNlTxFbemKrbZPs35XogeS9xeQr+anT6LzoOwEDwZJ7jwhXUnwkTTiDQ2Ja34AAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII=" alt="Reset" width=12 height=12/> Reset</div>
				<div class=pico8_el onclick="Module.pico8TogglePaused();"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAPUlEQVR4Ae3doQ0AIAxEUWABLPtPh2WCq26DwFSU/JPNT166QSu/Hg86W9dwLte+diP7AwAAAAAAgD+A+jM2ZAgo84I0PgAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII=" alt="Pause" width=12 height=12/> Pause</div>
				<div class=pico8_el onclick="Module.requestFullScreen(true, false);"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAaklEQVR4Ae2dsQ1AIQhExfze1v2ns3UCrfgFhmgUUAoGgHscp21wX9BqaZoDojbB96OkDJKNcTN2BHTyYNYmoT2BlPL7BKgcPfHjAVXKKadkHOn9K1r16N0czN6a95N8mnA7Aq2fTZ3Af3UKmCSMazL8HwAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII=" alt="Fullscreen" width=12 height=12/> Fullscreen</div>
				<div class=pico8_el onclick="Module.pico8ToggleSound();"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAXklEQVR4Ae2doQ4AIQxD4YLH8v9fh+ULhjpxxSwLg2uyapr1JRu1iV5Z+1BGl4+xNpX38SYo2uRvYiT5LwEmt+ocgXVLrhPEgBiw8Q5w7/kueSkK+D2tJO4E/I3GrwkqQCBabEj/4QAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII=" alt="Toggle Sound" width=12 height=12/> Sound</div>
				<div class=pico8_el ><a target="_new" href="http://www.lexaloffle.com/bbs/?cat=7&sub=2"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAlElEQVR4Ae2dMQ5FQBCGh6jcwAkkateg3DiAa+iQUGqVKi95FQfAJRQOoHeBUf8JyQqKjZ1uMzuz2e/LTE3KhyF7kSlgLOykas23f6D+A9Yp84aAOYU15pcJnfji0Il2ID8HzC4y38ZrnfIBGxeRoR3c3EWrACdsV5BOsx7OSRnrOXh4F5HzA6bevwUn8wlz7eCDsQM99B3ks0s/4QAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII=" alt="More Carts" width=12 height=12/> Carts</a></div>
				<?php } ?>
			</div>
		</center>
	</body>
</html>
