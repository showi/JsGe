/*# > Object < #*/
var GeMedia_Image = Class.create(GeObject, {
	/*# > Method < #*/
	initialize: function($super, parent, src) {
		$super(parent);
		if (src) {
			this.set(src);
		}
	},
	/*# > Method < #*/
	set: function(src) {
		this.img = new Image();
		this.img.src = src;
		this.loaded = false;
		var that = this;//this.onload.bind(this);
		this.img.onload = function() {
			that.loaded = true;
			Log.w("Image '" + that.img.src + " loaded");
			that.parent.total_loaded++;
			//that.img.onload = null;
		};
	},
	/*# > Method < #*/
	get: function() {
		return this.img;
	},
});

/*# > Object < #*/
var GeMediaPool = Class.create(GeObject, {
	/*# > Method < #*/
	initialize: function($super, id) {
		$super(parent);
		this.pool = new Array();
		this.path = "res/img/";
		this.nothing = new GeMedia_Image(this, this.path + "nothing.png");
		this.total = 0;
		this.total_loaded = 0;
	},
	
	add: function(src) {
		if (this.pool[src]) {
			Log.w("Image '" + src + " already in pool");
			return null;
		}
		Log.w("Image added: " + src);
		this.pool[src] = new GeMedia_Image(this, this.path + src);
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

