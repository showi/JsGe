var GeCore = Class.create(GeObject, {
	
	initialize: function($super, parent) {
		$super(parent);
	
	},
	
	init: function(width, height) 
	{

		/* Init Global Variables */
		this.init_global_variables();
		
		/* Discrete Time */
		this.DiscreteTime = new GeDiscreteTime(15);
		
		/* Create Screen object */
		this.Screens = new Hash();
		
		/* Create our image pool */
		this.Images = new GeMediaPool();
		
		/* Create our scene graph */
		this.SG = new GeTreeNode_Collection(null, "World");
	
		/* Create our renderers */
		this.Renderers = new Hash();
	},
	
	init_global_variables: function() 
	{
		ShoGE.Log = new GeLog("GameLog");
		ShoGE.w = function(msg) { ShoGE.Log.w(msg) };		
	},

	load_ressources: function() 
	{
		
	},

	start: function()
	{
		var that = this;
		this.startTime = Date.now();
		this.lastFrameTime = Date.now();
		
		ShoGE.w("--- Starting Game Engine");
		// Render HTML Elemet (Updating html element is an heavy process)
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.html_update();
		}, 0.5);
		
		new PeriodicalExecuter(function(pe) {			
			if (that.ImageReady.is_loading()) {
				that.ImageReady.draw();
			} else {
				pe.stop();
				that.start_loop();
			}
		}, 0.1);
		
	},
	
	togglePause: function() 
	{
		if (this.pause) {
			this.pause = false;
			this.currentTime = Date.now();
			this.start_loop();
		} else {
			this.pause = true;
			this.MainLoop.stop();
		}
	},
	
	/* HTML update: Running in separate thread.*/
	html_update: function() // STUB
	{
	
	},
	
	start_loop: function() 
	{
		var that = this;
		this.MainLoop = new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, 1/1000);
		this.RenderingLoop = new PeriodicalExecuter(function(pe) {	
			that.Renderers.each(function(pair) {
				pair.value.draw();
			});
			that.DiscreteTime.alpha = 0;
			that.SG.post_rendering();
	
		}, 1/60);
	},
	
	loop: function() 
	{	
		/* Update our scene graph with discrete time */
		this.DiscreteTime.consume(this.SG);
	},
	
	/* Helpers */
	add_screen: function (id, width, height, bgcolor) 
	{
		this.Screens.set(id, 
			new GeScreen(this, id, width, height)
		);
		if (bgcolor) this.Screens.get(id).set_bgcolor(bgcolor);
		return this.Screens.get(id);
	},
	
	add_renderer: function(id, screen, camera, width, height) {
			this.Renderers.set(id,
				new GeRenderer(this, screen, camera, width, height)
			);
			return this.Renderers.get(id);
		},
	get_renderer: function(id) {
		return this.Renderers.get(id);
	},
	set_mouse: function(id) {
		this.Mouse = new GeMouse(this, id);
		return this.Mouse;
	},
	get_mouse: function() {
		return this.Mouse;
	},
	set_keyboard: function(id) {
		this.Keyboard = new GeKeyboard(this, id)
		return this.Keyboard;
	},
	get_keyboard: function() {
		return this.Keyboard;
	},
	
});	
