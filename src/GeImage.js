var GeImage = Class.create(GeLoadable, {

	initialize: function($super, parent, src, callback) {
		$super(parent);
		this.setLoaded(false);
		if (typeof(callback) == 'function') {
			//ShoGE.w("Init image with callback");
			this.set_callback(callback);
		}
		if (src) {
			try {
				this.set(src);
			} catch(e) {
				ShoGE.w("Error: Fail to add image '"+src+"'");
			}
		}
		return this;
	},

	set: function(src) {
		this.src = src;
		this.img = new Image();
		this.img.src = src;
		this.setLoaded(false);
		this.error = false;
		var that = this;//this.onload.bind(this);
		this.img.onload = function() {
			//ShoGE.w("Image loaded >> " + that.src);
			that.setLoaded(true);
			that.exec_callback();
		};
		this.img.onerror = function() {
			that.error = true;
			throw("Loading image " + that.src  + " failed.");
		}
	},
	
	get: function() {
		return this.img;
	},
	
	set_callback: function(callback) {
		//ShoGE.w("Setting up callback");
		this.callback = callback;
	},
	
	exec_callback: function() {
		//ShoGE.w("Exec callback "  + this.callback);
		if (!this.callback && typeof(this.callback) != 'function') {
			ShoGE.w("No callback to call");
			return 0;
		}
		this.callback(this);
		return 1;
	},
	
	as_canvas: function() { return this.asCanvas(); },
	
	asCanvas: function() {
		var canvas = document.createElement('canvas');
		canvas.width = this.img.width;
		canvas.height = this.img.height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(this.img, 0,0);
		return canvas;
	},
	
});
