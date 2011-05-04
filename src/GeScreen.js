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
	init_buffer: function() {
		var b = document.createElement('canvas');
		b.width = this.width;
		b.height = this.height;
		this.buffer = b;
		var ctx = b.getContext('2d');
		ctx.fillStyle = "rgb(20,20,20)";
		ctx.fillRect (0, 0, this.width, this.height);
	},
	swap: function() {
		//this.clear();
		this.ctx.drawImage(this.buffer, 0, 0);
	},
	clear: function(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect (0, 0, this.width, this.height);
	}

});