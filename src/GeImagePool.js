var GeMediaPool = Class.create(GeObject, {
	
	initialize: function($super, id) {
		$super(parent);
		this.pool = new Array();
		this.path = "res/";
		this.nothing = new GeImage(this, this.path + "img/nothing.png");
		this.total = 0;
		this.total_loaded = 0;
	},
	
	add: function(src, callback) {
		if (this.pool[src]) {
			return null;
		}
		ShoGE.w("Image added: " + src);
		this.total++;
		this.pool[src] = new GeImage(this, this.path + src);
		var that = this;
		this.pool[src].set_callback (
			function(img) {
				ShoGE.w("Image '" + img.src + "' loaded");
				that.total_loaded++;
				if (callback) {
					callback(img);
				}
			}
		);
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
		var diff = this.total - this.total_loaded;
		return diff;
	}
});
