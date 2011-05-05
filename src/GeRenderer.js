var GeRenderer = Class.create(GeObject, {
	initialize: function($super, parent, screen, camera, width, height) {
		$super();
		this.camera = camera;
		this.parent = parent;
		this.screen = screen;
		this.width = width;
		this.height = height;
		this.FPS = 0;
		var date = new Date();
		this.lastFrameTime = date.getTime();
		this.frameCount = 0;
	},
	draw: function() {
		this.screen.init_buffer();
		var ctx = this.screen.buffer.getContext('2d');	
		ctx.save();
		//ctx.save();
		if (this.camera) {
		ctx.translate(this.screen.width / 2, this.screen.height / 2);
		ctx.scale(0.5,0.5);
		//ctx.rotate(new Vector2D(0,1).angle(this.camera.pos.orientation));
		ctx.translate(-this.camera.pos.x, -this.camera.pos.y);
			//ctx.scale(2,2);
			
		
			
		}
		//ctx.restore();
		
		this.parent.SG.draw(ctx);
		ctx.restore();
		var date = new Date();
		var ctime = date.getTime();
		var d = ctime - this.lastFrameTime;			
		if (d >= 1000.0) {
			this.FPS = (this.frameCount + this.FPS) / 2.0;
			this.lastFrameTime = ctime + (d - 1000);
			this.frameCount = 0;
			
		}
		this.frameCount++;	
		this.screen.swap();	
		//document.getElementById('GameFPS').innerHTML =  Math.round(this.FPS);
	}
});