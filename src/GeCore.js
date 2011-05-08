var GeCore = Class.create(GeObject, {
	
	initialize: function($super, parent) {
		this.set_parent(parent);
		var date = new Date();
		this.bgcolor = "rgb(0,0,0)";
		this.step = 0;
		this.timer = null;
		this.t = 0;
		this.startTime = null;
		this.currentTime = date.getTime();
		this.dt = 12;
		this.accumulator = 0;
		this.lastDraw = this.currentTime;
	},
	
	init: function(width, height) {
		var date = new Date();
		
		this.init_global_variables();
		
		this.Screen = new GeScreen(this,"GameScreen", width,height);
		this.Screen.clear(this.bgcolor);
		this.Screen2 = new GeScreen(this,"GameScreen3", width/2,height/2);
		this.Screen2.clear(this.bgcolor);
		this.Mouse = new GeMouse();
		this.Images = new GeMediaPool();
		this.SG = new GeTreeNode_Collection(null, "World");
	
		this.Renderer = new GeRenderer(this, this.Screen, null, width, height);
		
		this.Level = new GeLevel(this, 'darks');
		this.Grid = new GeTreeNode_Grid(this, 2,2, 512);
		this.SG.add_child(this.Grid);
		this.load_ressources();
		this.ImageReady = new GeWaitLoading(parent, this.Screen, this.Images);

		this.SG.preload_ressources();
		this.start();
	},
	
	init_global_variables: function() {
		Log = new GeLog("GameLog");
		ShoGE.w = Log.w;
	},

	load_ressources: function() {
		var m = null;
		for(var i = 0; i < 10; i++) {
			m = new GeTreeNode_Monster(null);
			this.Grid.add(m);
		}
		this.camera = new GeCamera(parent, m);
		this.SG.add_child(this.camera);
		this.Renderer2 = new GeRenderer(this, this.Screen2, this.camera, this.width/2, this.height/2);
		var map = new GeTreeNode_Map(null);
	},

	start: function() {
		var that = this;
		this.startTime = Date.now();
		this.lastFrameTime = Date.now();
		
		ShoGE.w("--- Starting Game Engine");
		// Render HTML Elemet (Updating html element is an heavy process)
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.html_update();
		}, 0.01);
		
		new PeriodicalExecuter(function(pe) {			
			if (that.ImageReady.is_loading()) {
				that.ImageReady.draw();
			} else {
				pe.stop();
				that.start_loop();
			}
		}, 0.1);
		
	},
	html_update: function(){
		$('GameFPS').innerHTML = Math.round(this.Renderer.FPS);
		$('GameFPS3').innerHTML = Math.round(this.Renderer2.FPS);
	},
	
	start_loop: function() {
		// Our Game engine loop
		var that = this;
		new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, 0.0001);
	},
	/* -[meth]- */
	loop: function() {	
		var newTime = Date.now();
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
