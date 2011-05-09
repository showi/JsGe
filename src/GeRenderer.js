var GeRenderer = Class.create(GeObject, {
	
	initialize: function($super, parent, screen, camera, width, height) {
		$super(parent);
		this.set_camera(camera);
		this.set_screen(screen);
		this.set_width(width);
		this.set_height(height);

		this.fps = 0;
		this.lastFrameTime = Date.now();
		this.frameCount = 0;
	},
	
	draw: function() {
		this.Screen.init_buffer();
		var ctx = this.Screen.buffer.getContext('2d');	
		ctx.save();
		ctx.scale(0.5, 0.5);
		if (this.Camera) {
			ctx.translate(this.Camera.object.phys.pos.x,   this.Camera.object.phys.pos.y);
		}
		
		this.parent.SG.draw(ctx);
		
		if (this.Mouse) {
			this.Mouse.draw(ctx);
		}

		ctx.restore();
		var ctime = Date.now();
		var d = ctime - this.lastFrameTime;			
		if (d >= 1000.0) {
			this.fps = (this.frameCount + this.fps) / 2.0;
			this.lastFrameTime = ctime + (d - 1000);
			this.frameCount = 0;
			
		}
		this.frameCount++;	
		this.Screen.swap();	
	},
	
	/* Mouse G/S */
	set_mouse: function(mouse) {
		this.Mouse = mouse;
	},
	
	get_mouse: function() {
		return this.Mouse;
	},
	
	/* Camera G/S */
	set_camera: function(camera) {
		this.Camera = camera;
	},
	
	get_camera: function() {
		return this.Camera;
	},
	
	/* Screen G/S */
	set_screen: function(screen) {
		this.Screen = screen;
	},
	
	get_screen: function() {
		return this.Screen;
	},
	
	/* Width G/S */
	set_width: function(width) {
		this.width = width;
	},
	
	get_width: function() {
		return this.width;
	},	
	
	/* Height G/S */
	set_height: function(height) {
		this.height = height;
	},
	
	get_width: function() {
		return this.width;
	},	
	
		
	/* FPS G */
	get_fps: function() {
		return this.fps;
	}
});
