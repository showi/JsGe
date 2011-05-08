var GeScreen = Class.create(GeObject, {
	
	initialize: function(parent, id, width, height) {
		this.id = id;
		this.parent = parent;
		this.width = width;
		this.height = height;
		this.canvas = document.getElementById(id);
		if (!this.canvas.getContext || !this.canvas.getContext('2d')){
			alert("HTML 5 canvas may be not supported on your system");
			exit(1);
		}
		this.ctx = this.canvas.getContext('2d');
		this.init_buffer(); 
	},
	
	get_layer: function(id) {
		if (id < 0) {
			id = 0;
		}
		if (id > 10) {
			id = 10;
		}
		if (this.layers[id]) {
			return this.layers[id];
		}
		var c = document.createElement('canvas');
		this.layers[id] = c.getContext('2d');
	},
	
	init_buffer: function() {
		this.layers = new Array();
		var b = document.createElement('canvas');
		b.width = this.width;
		b.height = this.height;
		this.buffer = b;
		var ctx = b.getContext('2d');
		this.clear("rgb(50,50,50");
		/*ctx.save();
		ctx.fillStyle = "rgb(20,20,250)";
		ctx.fillRect (0, 0, this.width, this.height);
		ctx.restore();*/
	},
	
	swap: function() {
		this.ctx.drawImage(this.buffer, 0, 0);
	},
	
	clear: function(color) {
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.fillRect (0, 0, this.width, this.height);
		this.ctx.restore();
	}

});
