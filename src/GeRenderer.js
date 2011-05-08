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
		if (this.camera) {
			//var o = new Vector2D(1, 0).angle(this.camera.object.phys.velocity);
			//ctx.rotate(o);
			//alert(this.camera.object.phys.pos.x + ", " +   this.camera.object.phys.pos.y);
			//ctx.save();
			ctx.translate(this.camera.object.phys.pos.x,   this.camera.object.phys.pos.y);
			//ctx.translate(, );
			//ctx.scale(2, 2);
		} else {
			//ctx.scale(0.5, 0.5);
		}
		//ctx.restore();
		this.parent.SG.draw(ctx);
		if (this.mouse) {
			this.mouse.draw(ctx);
		}
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
	}
});
