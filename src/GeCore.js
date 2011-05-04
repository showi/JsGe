var GeCore = Class.create({
	initialize: function() {
		
		this.bgcolor = "rgb(0,0,0)";
		
		this.step = 0;
		this.timer = null;
		this.t = 0;
		this.startTime = null;
		var date = new Date();
		this.currentTime = date.getTime();
		this.dt = 5;
		this.accumulator = 0;
		this.lastDraw = this.currentTime;

	},
	init: function() {
		Log = new GeLog("GameLog");
		this.frameCount = 0;
		this.FPS = 0;
		this.droppedFrame = 0;
		this.maxFrameDrop = 5;
		var date = new Date();
		this.lastFrameTime = date.getTime();
		this.Screen = new GeScreen(this,"GameScreen", 640,480);
		this.Mouse = new GeMouse();
		this.Images = new GeMediaPool();
		this.Images.add("alpha-1x1.png");
		this.Images.add("ball-blue-32x32.png");
		this.Images.add("ball-cover-32x32.png");
		this.Images.add("ball-infected-32x32.png");
		this.Images.add("lvl-test-shadow.png");
		//this.Renderer = new GeRenderer(this);
		this.SG = new GeTreeNode(null);
		for(i = 0; i < 20; i++) {
			this.SG.add_child(new GeTreeNode_Monster(null));
		}
		this.SG.add_child(new GeTreeNode_Map(null));
		this.Screen.clear(this.bgcolor);
		var date = new Date();
		this.currentTime = date.getTime();
		this.start();
	},

	start: function() {
		var date = new Date();
		this.startTime = date.getTime();
		Log.w("--- Starting Game Engine");
		var that = this;
		//this.Renderer.add(sp01);
		this.lastFrameTime = date.getTime();
		this.timer = new PeriodicalExecuter(function(pe) {
			var date = new Date();
			var ctime = date.getTime();
			var d = ctime - that.lastFrameTime;			
			//alert(th.lastFrameTime);
			if (d >= 1000.0) {
				//this.FPS = ((this.frameCount / 60.0) + this.FPS) / 2.0;
				that.FPS = (that.frameCount + that.FPS) / 2.0;
				that.lastFrameTime = ctime + (d - 1000);
				that.frameCount = 0;
				
			}
			that.frameCount++;
			//$('GameElapsedTime').innerHTML = that.droppedFrame;		
			that.loop();
			

		}, 0.015);
		//var accumul = 0;
	},
	
	loop: function() {		
		//Log.w("Tick");
		var date = new Date();
		var newTime = date.getTime();
		var frameTime = newTime - this.currentTime;
		
		this.currentTime = newTime;
		this.accumulator  += frameTime;
		//$('GameAccumulator').innerHTML = this.accumulator;
		while(this.accumulator >= this.dt) {
			this.accumulator -= this.dt;
			this.t += this.dt;
			//this.Renderer.update(this.dt);
			this.SG.update(this.dt);
		}
		/*if (this.FPS > 66) {
			if (this.droppedFrame < this.maxFrameDrop) {
				this.droppedFrame++;
				
				return;
			} else {
				this.droppedFrame = 0;
			}
		}*/
		//this.Renderer.draw();
		this.Screen.init_buffer();
		var ctx = this.Screen.buffer.getContext('2d');	
		this.SG.draw(ctx);
		this.Screen.swap();	
		document.getElementById('GameFPS').innerHTML =  Math.round(this.FPS);	
		
	}
});	