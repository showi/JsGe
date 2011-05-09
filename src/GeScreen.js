var GeScreen = Class.create(GeObject, {
	
	initialize: function($super, parent, id, width, height) {
		$super(parent);
		this.id = id;
		//this.parent = parent;
		this.width = width;
		this.height = height;
		this.bgcolor = "rgb(0,0,0)";
		this.canvas = document.getElementById(id);
		if (!this.canvas.getContext || !this.canvas.getContext('2d')){
			alert("HTML 5 canvas may be not supported on your system");
			exit(1);
		}
		this.ctx = this.canvas.getContext('2d');
		this.init_buffer(); 
	},
	
	set_bgcolor: function(bgcolor) {
		this.bgcolor = bgcolor;
	},
	
	get_bgcolor: function(bgcolor) {
		return this.bgcolor;
	},
	
	init_buffer: function() {
		this.layers = new Array();
		var b = document.createElement('canvas');
		b.width = this.width;
		b.height = this.height;
		this.buffer = b;
		var ctx = b.getContext('2d');
		this.clear(this.bgcolor);
	},
	
	swap: function() {
		this.ctx.drawImage(this.buffer, 0, 0);
	},
	
	clear: function(color) {
		var bgcolor = color || this.bgcolor;
		this.ctx.save();
		this.ctx.fillStyle = bgcolor;
		this.ctx.fillRect (0, 0, this.width, this.height);
		this.ctx.restore();
	}

});
