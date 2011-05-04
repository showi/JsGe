var GeRenderer = Class.create(GeObject, {
	initialize: function($super, parent, screen, camera, width, height) {
		$super();
		this.camera = camera;
		this.parent = parent;
		this.screen = screen;
		this.width = width;
		this.height = height;
		this.objects = new Array();
	},
	draw: function() {
		this.screen.init_buffer();
		var ctx = this.screen.buffer.getContext('2d');	
		ctx.save();
		//ctx.save();
		if (this.camera) {
			ctx.translate(-this.camera.pos.x + this.screen.width / 2, -this.camera.pos.y + this.screen.height / 2);
			//ctx.rotate(Math.PI/4);
		}
		//ctx.restore();
		
		this.parent.SG.draw(ctx);
		ctx.restore();
		this.screen.swap();	
		//document.getElementById('GameFPS').innerHTML =  Math.round(this.FPS);
	}
});