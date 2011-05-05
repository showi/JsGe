var GeCore = Class.create({
	
	/* -[meth]- */
	initialize: function() {
		var date = new Date();
		this.bgcolor = "rgb(0,0,0)";
		this.step = 0;
		this.timer = null;
		this.t = 0;
		this.startTime = null;
		this.currentTime = date.getTime();
		this.dt = 33;
		this.accumulator = 0;
		this.lastDraw = this.currentTime;
	},
	
	/* -[meth]- */
	init: function(width, height) {
		var date = new Date();
		
		this.init_global_variables();
		
		this.Screen = new GeScreen(this,"GameScreen", width,height);
		this.Screen.clear(this.bgcolor);
		this.Screen2 = new GeScreen(this,"GameScreen3", width/2,height/2);
		this.Screen2.clear(this.bgcolor);
		this.Mouse = new GeMouse();
		this.Images = new GeMediaPool();
		this.SG = new GeTreeNode(null);
		this.load_ressources();
		this.Renderer = new GeRenderer(this, this.Screen, null, width, height);
		this.Renderer2 = new GeRenderer(this, this.Screen2, this.camera, width/2, height/2);
		
		
		this.start();
	},
	
	init_global_variables: function() {
		Log = new GeLog("GameLog");
	},
	/* -[meth]- */
	load_ressources: function() {
		this.Images.add("alpha-1x1.png");
		this.Images.add("ball-blue-32x32.png");
		this.Images.add("ball-cover-32x32.png");
		this.Images.add("ball-infected-32x32.png");
		this.Images.add("lvl-test-shadow.png");
		
		var m = null;
		for(var i = 0; i < 50; i++) {
			m = new GeTreeNode_Monster(null);
			this.SG.add_child(m);
		}
		this.camera = new GeCamera(m.phys.pos);
		this.camera.pos.orientation = m.phys.force; 
		this.SG.add_child(new GeTreeNode_Map(null));
	},
	
	/* -[meth]- */
	start: function() {
		var that = this;
		var date = new Date();
		this.startTime = date.getTime();
		this.lastFrameTime = date.getTime();
		
		Log.w("--- Starting Game Engine");
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.html_update();
		}, 0.1);
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, 0.001);
	},
	html_update: function(){
		$('GameFPS').innerHTML = Math.round(this.Renderer.FPS);
		$('GameFPS3').innerHTML = Math.round(this.Renderer2.FPS);
	},
	/* -[meth]- */
	loop: function() {	
		var date = new Date();
		var newTime = date.getTime();
		var frameTime = newTime - this.currentTime;
		
		this.currentTime = newTime;
		this.accumulator  += frameTime;
		while(this.accumulator >= this.dt) {
			this.accumulator -= this.dt;
			this.t += this.dt;
			this.SG.update(this.dt);
		}
		this.Renderer.draw();
		this.Renderer2.draw();
	},
});	