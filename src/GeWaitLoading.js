var GeWaitLoading = Class.create(GeObject, {
	
	initialize: function($super, parent, screen, pool) {
		this.set_parent(parent);
		this.screen = screen;
		this.pool = pool;
	},
	
	is_loading: function() {
		return this.pool.is_loading();
	},
	
	draw: function() {
		this.screen.init_buffer();
		var ctx = this.screen.buffer.getContext('2d');	
		ctx.save();
		ctx.fillStyle = "rgb(255,255,255)";
		//ctx.font = 'italic 400 12px/2 Unknown Font, sans-serif';
		ctx.fillText("Loading images...", 10, 10);
		ctx.strokeText("Loading images...", 10, 10);
		ctx.restore();
		this.screen.swap();
	},
	
});
