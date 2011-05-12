var GeImage = Class.create(GeObject, {

	initialize: function($super, parent, src) {
		$super(parent);
		if (src) {
			this.set(src);
		}
	},

	set: function(src) {
		this.img = new Image();
		this.img.src = src;
		this.loaded = false;
		var that = this;//this.onload.bind(this);
		this.img.onload = function() {
			that.loaded = true;
			//that.parent.total_loaded++;
			if (that.callback) {
				that.callback(that.img);
			}
		};
	},
	
	get: function() {
		return this.img;
	},
	
	set_callback: function(callback) {
		this.callback = callback;
	},
	
	as_canvas: function() {
		var canvas = document.createElement('canvas');
		canvas.width = this.img.width;
		canvas.height = this.img.height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(this.img, 0,0);
		return canvas;
	}
});
