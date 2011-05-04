var GeMedia_Image = Class.create({
	initialize: function(src) {
		if (src) {
			this.set(src);
		}
	},
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
	get: function() {
		return this.img;
	},
});



var GeMediaPool = Class.create({
	initialize: function(id) {
		this.pool = new Array();
		this.path = "res/img/";
		this.nothing = new GeMedia_Image(this.path + "nothing.png");
	
	},
	add: function(src) {
		if (this.pool[src]) {
			alert("Image '" + src + " already in pool");
			return;
		}
		this.pool[src] = new GeMedia_Image(this.path + src);
		return this.pool[src];
	},
	get: function(src) {
		if (!this.pool[src] || !this.pool[src].loaded) {
			return this.nothing;
		}
		return this.pool[src];
	},
});

