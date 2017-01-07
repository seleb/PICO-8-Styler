var pico8_buttons = [0, 0, 0, 0, 0, 0, 0, 0];

gamepads.init();

if(gamepads.available){
	var thresh=(gamepads.deadZone+gamepads.snapZone)/2;
	function pushGamepadToButtons(){
		gamepads.update();
		
		for(var p=0; p<pico8_buttons.length;++p){
			var stick=gamepads.getAxes(0,2,p);
			var dpad=gamepads.getDpad(p);
			var btns=[
				stick[0] < -thresh || dpad[0] < -thresh,
				stick[0] > thresh || dpad[0] > thresh,
				stick[1] < -thresh || dpad[1] > thresh,
				stick[1] > thresh || dpad[1] < -thresh,
				gamepads.isDown(0,p) || gamepads.isDown(3,p),
				gamepads.isDown(2,p) || gamepads.isDown(1,p)
			];
			
			var input=0;
			for(var i=0; i<btns.length;++i){
				if(btns[i]){
					input|=Math.pow(2,i);
				}
			}
			pico8_buttons[p]=input;
		}
		
		requestAnimationFrame(pushGamepadToButtons);
	}
	pushGamepadToButtons();
}