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
		this.SgStatic = new GeTreeNode_Collection(this.SG, "static");
		this.SG.add_child(this.SgStatic);
		this.SgStatic.add_child(new GeTreeNode_Coordinate(this.SgStatic));
		this.SgDynamic = new GeTreeNode_Collection(this.SG, "dynamic");
		this.SG.add_child(this.SgDynamic);
		this.load_ressources();
		this.Renderer = new GeRenderer(this, this.Screen, null, width, height);
		this.Renderer2 = new GeRenderer(this, this.Screen2, this.camera, width/2, height/2);
		this.Level = new GeLevel(this, 'darks');
		this.Grid = new GeTreeNode_Grid(this);
		this.SG.add_child(this.Grid);
		//this.Grid.set(1,1, new GeTreeNode_Cell(parent));
		this.Grid.get(0,0);
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
		this.Images.add("map_green01.png");
		this.Images.add("tile-on.png");
		this.Images.add("tile-off.png");
		
		var m = null;
		for(var i = 0; i < 20; i++) {
			m = new GeTreeNode_Monster(null);
			this.SgDynamic.add_child(m);
		}
		this.camera = new GeCamera(parent, m.phys.pos);
		//this.camera.pos.orientation = m.phys.force; 
		this.SgStatic.add_child(new GeTreeNode_Block(
			new Vector2D(264,50),
			new Vector2D(128,0),
			new Vector2D(0,50)
		));
		this.SgStatic.add_child(this.camera);
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
		}, 0.1);
		// Our Game engine loop
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, 0.000001);
	},
	html_update: function(){
		$('GameFPS').innerHTML = Math.round(this.Renderer.FPS);
		$('GameFPS3').innerHTML = Math.round(this.Renderer2.FPS);
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