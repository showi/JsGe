var GeCore = Class.create(GeObject, {
	
	/* -[meth]- */
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
		this.SG = new GeTreeNode_Collection(null, "World");
		//this.SgStatic = new GeTreeNode_Collection(this.SG, "static");
		//this.SG.add_child(this.SgStatic);
		//this.SgStatic.add_child(new GeTreeNode_Coordinate(this.SgStatic));
		//this.SgDynamic = new GeTreeNode_Collection(this.SG, "dynamic");
		//this.SG.add_child(this.SgDynamic);
		
		this.Renderer = new GeRenderer(this, this.Screen, null, width, height);
		
		this.Level = new GeLevel(this, 'darks');
		this.Grid = new GeTreeNode_Grid(this, 2,2, 512);
		this.SG.add_child(this.Grid);
		this.load_ressources();
		this.ImageReady = new GeWaitLoading(parent, this.Screen, this.Images);
		//this.Grid.set(1,1, new GeTreeNode_Cell(parent));
		//this.Grid.get(0,0);
		this.SG.preload_ressources();
		this.start();
	},
	
	init_global_variables: function() {
		Log = new GeLog("GameLog");
	},
	/* -[meth]- */
	load_ressources: function() {
		//this.Images.add("alpha-1x1.png");
		//this.Images.add("ball-blue-32x32.png");
		//this.Images.add("ball-cover-32x32.png");
		//this.Images.add("ball-infected-32x32.png");
		//this.Images.add("lvl-test-shadow.png");
		//this.Images.add("map_green01.png");
		//this.Images.add("tile-on.png");
		//this.Images.add("tile-off.png");
		
		var m = null;
		for(var i = 0; i < 10; i++) {
			m = new GeTreeNode_Monster(null);
			this.Grid.add(m);
		}
		this.camera = new GeCamera(parent, m);
		//this.camera.pos.orientation = m.phys.force; 
		this.SG.add_child(this.camera);
		this.Renderer2 = new GeRenderer(this, this.Screen2, this.camera, this.width/2, this.height/2);
		var map = new GeTreeNode_Map(null);
		//this.SgStatic.add_child(map);
		
	},

	/* -[meth]- */
	start: function() {
		var that = this;
		this.startTime = Date.now();
		this.lastFrameTime = Date.now();
		
		Log.w("--- Starting Game Engine");
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
		}, 0.5);
		
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