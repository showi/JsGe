var GeMedia_Image = Class.create(GeObject, {

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
			ShoGE.w("Image '" + that.img.src + " loaded");
			that.parent.total_loaded++;
			if (that.callback) {
				that.callback();
			}
		};
	},
	
	get: function() {
		return this.img;
	},
	
	set_callback: function(callback) {
		this.callback = callback;
	}
});


var GeMediaPool = Class.create(GeObject, {
	
	initialize: function($super, id) {
		$super(parent);
		this.pool = new Array();
		this.path = "res/";
		this.nothing = new GeMedia_Image(this, this.path + "img/nothing.png");
		this.total = 0;
		this.total_loaded = 0;
	},
	
	add: function(src, callback) {
		if (this.pool[src]) {
			//ShoGE.w("Image '" + src + " already in pool");
			return null;
		}
		ShoGE.w("Image added: " + src);
		this.pool[src] = new GeMedia_Image(this, this.path + src);
		this.pool[src].set_callback(callback);
		return this.pool[src];
	},
	
	get: function(src) {
		if (!this.pool[src]) { throw("GeImagePool: Trying to get invalid image: " + src); }
		if (!this.pool[src].loaded) {
			return this.nothing;
		}
		return this.pool[src];
	},
	

	is_loading: function() {
		return !(this.total - this.total_loaded);
	}
});
