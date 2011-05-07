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
		ctx.fillText("Loading images...", 10, 10);
		ctx.restore();
		this.screen.swap();
	}
});