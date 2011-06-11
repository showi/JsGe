
var GeImageBuffer = Class.create(GeObject, {
	initialize: function($super, parent, w, h) {
		$super(parent);
		this.width = w;
		this.height = h;
		this.initBuffer();
	},
	
	initBuffer: function() {
		//this.trans = document.createElement('canvas');
		//this.trans.width = this.width;
		//this.trans.height = this.height;
		this.htmlCanvas = document.createElement('canvas');
		this.htmlCanvas.width = this.width;
		this.htmlCanvas.height = this.height;
		this.ctx = this.getContext();
		//this.ctx.globalCompositeOperation = 'source-out';
		//this.ctx.globalAlpha = 1;
		//this.ctx.globalCompositeOperation = 'xor';
		return this.htmlCanvas;
	},
	
	getContext: function() {
		return this.htmlCanvas.getContext('2d');
	},
	
	clear: function(color) {
		this.initBuffer();
		//this.ctx.save();
		//this.ctx.fillStyle = 'rgba(0,0,0,1)';
		//this.ctx.fillRect(0, 0, this.width, this.height);
		//this.ctx.globalCompositeOperation = 'destination-out';
		//this.ctx.drawImage(this.htmlCanvas, 0,0);
		//this.ctx.globalCompositeOperation = 'source-over';
		/*this.ctx.globalCompositeOperation = 'destination-in';
		this.ctx.drawImage(this.trans, 0, 0);
		this.ctx.globalCompositeOperation = 'source-over';
		*/
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		//this.ctx.restore();
	},
	
	draw: function(ctx)  {
		ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height);
	},
	
	getCanvas: function() {
		return this.htmlCanvas;
	},
});

const GE_LAYER_COMPOSITE = 0;
const GE_LAYER_GROUND = 1;
const GE_LAYER_MOVING = 2;

var GeRenderer = Class.create(GeObject, {
	
	initialize: function($super, parent, screen, camera, width, height) {
		$super(parent);
		this.set_camera(camera);
		this.set_screen(screen);
		this.set_width(width);
		this.set_height(height);

		this.fps = 0;
		this.lastFrameTime = Date.now();
		this.frameCount = 0;
		this.layers = new Array();
		this.addLayer(GE_LAYER_COMPOSITE);
		this.addLayer(GE_LAYER_GROUND);
		this.addLayer(GE_LAYER_MOVING);
	},
	
	addLayer: function(index) {
		if (this.layers[index]) {
			throw("[GeRender] Cannot add layer with same name");
		}
		ShoGE.w("Add Layer " + index);
		var buffer = new GeImageBuffer(this, this.width, this.height);
		this.layers[index] = buffer;
	},
	
	translate: function(x, y) {
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			//ShoGE.w("Translate layer " + i + " x: " + x + ", y: " + y);
			//exit();
			this.layers[i].ctx.translate(x,y);
			}
	},
	
	save: function() {
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].ctx.save();
		}
	},
	
	restore: function() {
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].ctx.restore();
		}
	},		
	
	clear: function(color) {
		var l = this.layers.length;
		var i;
		for (i = 0; i < l; i++) {
			this.layers[i].clear(color);
		}
	},		
	
	compose: function() {
		var l = this.layers.length;
		var i;
		for (i = 0; i < l; i++) {
			//ShoGE.w("Compose: " + i);
			this.layers[i].ctx.save();
			if (GE_LAYER_MOVING == i) {
				this.layers[i].shadowOffsetX = 15;
				this.layers[i].shadowOffsetY = 15;
				 this.layers[i].shadowColor = "#bbbbbb";
			}
			this.layers[i].draw(this.layers[0].getContext(), 0, 0);
			this.layers[i].ctx.restore();
			}
	},
	
	swap: function() {
		this.compose();
		//this.Screen.clear("rgba(255,255,255,1)");
		this.layers[0].draw(this.Screen.getContext(), 0, 0, this.width, this.height);
		//this.layers[1].draw(this.Screen.getContext(), 0, 0);
		this.Screen.swap();
	},
	draw: function() {
		//this.Screen.init_buffer();
		//ctx.save();
		//ctx.shadowColor = "#bbbbbb";
		//ctx.shadowBlur = 20;
		//ctx.shadowOffsetX = 15;
		//ctx.shadowOffsetY = 15;
		//ctx.translate(this.width/2,   this.height/2);
		this.save();
		this.clear('rgba(0,0,0,0)');
		this.layers[0].clear('rgba(255,255,255,0)');
	
		//this.save();
		/*if (this.Mouse) {
			this.Mouse.draw(ctx);
		}*/
	this.Screen.draw(this);
	
	if (this.Camera) {
		this.Camera.draw(this);
		}
	
		this.parent.SG.draw(this);

		
	this.swap();
		//this.restore();
			this.restore();
		
		var ctime = Date.now();
		var d = ctime - this.lastFrameTime;			
		if (d >= 1000.0) {
			this.fps = (this.frameCount + this.fps) / 2.0;
			this.lastFrameTime = ctime + (d - 1000);
			this.frameCount = 0;
			
		}
		this.frameCount++;	
	},
	getContext: function(index) {
		if (!this.layers[index]) {
			throw("Invalid layer index for getContext " + index);
		}
		return this.layers[index].getContext();
		//return this.Screen.buffer.getContext('2d');	
	},
	/* Mouse G/S */
	set_mouse: function(mouse) {
		this.Mouse = mouse;
	},
	
	get_mouse: function() {
		return this.Mouse;
	},
	
	/* Camera G/S */
	set_camera: function(camera) {
		this.Camera = camera;
	},
	
	get_camera: function() {
		return this.Camera;
	},
	
	/* Screen G/S */
	set_screen: function(screen) {
		this.Screen = screen;
	},
	
	get_screen: function() {
		return this.Screen;
	},
	
	/* Width G/S */
	set_width: function(width) {
		this.width = width;
	},
	
	get_width: function() {
		return this.width;
	},	
	
	/* Height G/S */
	set_height: function(height) {
		this.height = height;
	},
	
	get_width: function() {
		return this.width;
	},	
	
		
	/* FPS G */
	get_fps: function() {
		return this.fps;
	},
	
});
