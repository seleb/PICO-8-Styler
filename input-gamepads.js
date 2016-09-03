var gamepads={
	players:[],

	available:false,
	pollEveryFrame:false,
	connected:false,
	deadZone:0.25,
	snapZone:0.25,

	down:[],
	justDown:[],
	justUp:[],

	init:function(){
		if(navigator.getGamepads){
			this.available=true;
		}else if(navigator.webkitGetGamepads){
        	navigator.getGamepads=navigator.webkitGetGamepads;
        	this.available=true;
        }

        if(this.available){
        	console.log("Gamepad API available");
        	if(navigator.userAgent.indexOf('Firefox/') != -1){
        		// listen to connection events for firefox
		        $(window).on("gamepadconnected gamepaddisconnected", function(event) {
		            console.log("gamepad connection event");
		            this.pollconnections(event);
		        }.bind(this));
        	}else{
        		this.pollEveryFrame=true;
        	}
        }else{
        	console.error("Gamepad API not available");
        }
	},

	pollconnections:function(event){
		this.connected=false;

    	var gps=navigator.getGamepads();
    	for(var i=0; i < gps.length; ++i){
    		var gp=gps[i];
    		if(gp){
	    		if(gp.connected){
	    			if(this.players[gp.index]==null){
	    				// new player
	    				this.players[gp.index]=gp;
	    				this.players[gp.index].down=[];
	    				this.players[gp.index].justDown=[];
	    				this.players[gp.index].justUp=[];
	    			}else{
	    				// returning player, copy old button states before replacing
	    				gp.down = this.players[gp.index].down;
	    				gp.justDown = this.players[gp.index].justDown;
	    				gp.justUp = this.players[gp.index].justUp;
	    				this.players[gp.index]=gp;
	    			}
					this.connected=true;
	    		}else{
	    			this.players[gps[i].index]=null;
	    		}
    		}
    	}
	},

	update:function(){
		// poll connections and update gamepad states every frame because chrome's a lazy bum
        if(this.pollEveryFrame){
        	this.pollconnections();
        }

		for(var i=0; i < this.players.length; ++i){
			var p=this.getPlayer(i);
			if(p && p!=null){
				for(var i=0; i < p.buttons.length; ++i){
					if(p.buttons[i].pressed){
						p.justDown[i]=!(p.down[i]===true);
						p.down[i]=true;
						p.justUp[i]=false;
					}else{
						p.justUp[i]=p.down[i]===true;
						p.down[i]=false;
						p.justDown[i]=false;
					}
				}
			}
		}
	},

	// returns _player's gamepad
	// if one doesn't exist, returns an object with gamepad properties reflecting a null state
	getPlayer:function(_player){
		return this.players[_player]||{connected:false,down:[],justDown:[],justUp:[],axes:[],buttons:[]};
	},

	// returns [x,y] representing the two axes for _player at _offset
	// if abs(an axis value) is < deadZone, returns 0 instead
	// if abs(1-an axis value) is < snapZone, returns 1 instead
	// if _offset isn't set, sets to 0
	// if _length isn't set, sets to 2
	// if _player isn't set (or -1), returns the sum of everyone's axes
	getAxes: function(_offset,_length,_player){
		if(arguments.length < 3){
			_player=-1;
			if(arguments.length < 2){
				_length=2;
				if(arguments.length < 1){
					_offset=0;
				}
			}
		}

		var axes=[];
		for(var i=0;i<_length;++i){
			axes[i]=0;
		}
		if(_player == -1){
			for(var i=0; i < this.players.length; ++i){
				var a=this.getAxes(_offset,_length,i);
				for(var j=0;j<a.length;++j){
					axes[j]+=a[j];
				}
			}
		}else{
			var a=this.getPlayer(_player).axes.slice(_offset,_length);
			for(var i=0;i<a.length;++i){
				if(Math.abs(a[i]) < this.deadZone){
					axes[i]+=0;
				}else if(Math.abs(1.0-a[i]) < this.snapZone){
					axes[i]+=1;
				}else if(Math.abs(-1.0-a[i]) < this.snapZone){
					axes[i]-=1;
				}else{
					axes[i]+=a[i];
				}
			}
		}
		return axes;
	},

	// returns [x,y] representing the dpad for _player
	// if _player isn't set (or -1), returns the sum of everyone's dpads
	getDpad: function(_player){
		if(arguments.length < 1){
			_player=-1;
		}
		var dpad=[0,0];
		if(_player == -1){
			for(var i=0; i < this.players.length; ++i){
				var d=this.getDpad(i);
				dpad[0]+=d[0];
				dpad[1]+=d[1];
			}
		}else{
			if(this.isDown(15,_player)){
				dpad[0]+=1;
			}if(this.isDown(14,_player)){
				dpad[0]-=1;
			}
			if(this.isDown(13,_player)){
				dpad[1]+=1;
			}if(this.isDown(12,_player)){
				dpad[1]-=1;
			}
		}
		return dpad;
	},

	// returns true if _player's _btn is currently down
	// if _player isn't set (or -1), returns true for any player
	isDown:function(_btn,_player){
		if(arguments.length < 2){
			_player=-1;
			if(arguments.length < 1){
				console.error("must specify a button");
			}
		}
		if(_player == -1){
			for(var i=0; i < this.players.length; ++i){
				if(this.isDown(_btn,i)){
					return true;
				}
			}
			return false;
		}else{
			return this.getPlayer(_player).down[_btn]===true;
		}
	},

	// returns true if _player's _btn is not currently down
	// if _player isn't set (or -1), returns true for any player
	isUp:function(_btn,_player){
		return !this.isDown(_btn,_player);
	},

	// returns true if _player's _btn is currently down and WAS NOT down in previous update
	// if _player isn't set (or -1), returns true for any player
	isJustDown:function(_btn,_player){
		if(arguments.length < 2){
			_player=-1;
			if(arguments.length < 1){
				console.error("must specify a button");
			}
		}
		if(_player == -1){
			for(var i=0; i < this.players.length; ++i){
				if(this.isJustDown(_btn,i)){
					return true;
				}
			}
			return false;
		}else{
			return this.getPlayer(_player).justDown[_btn]===true;
		}
	},

	// returns true if _player's _btn is currently NOT down and WAS down in previous update
	// if _player isn't set (or -1), returns true for any player
	isJustUp:function(_btn,_player){
		if(arguments.length < 2){
			_player=-1;
			if(arguments.length < 1){
				console.error("must specify a button");
			}
		}
		if(_player == -1){
			for(var i=0; i < this.players.length; ++i){
				if(this.isJustUp(_btn,i)){
					return true;
				}
			}
			return false;
		}else{
			return this.getPlayer(_player).justUp[_btn]===true
		};
	}
};