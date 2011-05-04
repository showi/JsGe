/*# > Object < #*/
var GeMedia_Image = Class.create(GeObject, {
	/*# > Method < #*/
	initialize: function($super, src) {
		$super();
		if (src) {
			this.set(src);
		}
	},
	/*# > Method < #*/
	set: function(src) {
		this.img = new Image();
		this.img.src = src;
		this.loaded = false;
		var that = this;
		this.img.onload = function() {
			that.loaded = true;
			Log.w("Image '" + that.img.src + " loaded");
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
		$super();
		this.pool = new Array();
		this.path = "res/img/";
		this.nothing = new GeMedia_Image(this.path + "nothing.png");
	
	},
	/*# > Method < #*/
	add: function(src) {
		if (this.pool[src]) {
			alert("Image '" + src + " already in pool");
			return null;
		}
		this.pool[src] = new GeMedia_Image(this.path + src);
		return this.pool[src];
	},
	/*# > Method < #*/
	get: function(src) {
		if (!this.pool[src] || !this.pool[src].loaded) {
			return this.nothing;
		}
		return this.pool[src];
	},
});

