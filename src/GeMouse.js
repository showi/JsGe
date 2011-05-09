var GeArea = Class.create({
	initialize: function(vS, vE) {
		this.set(vS, vE);
	},
	set: function(v1, v2) {
		var minX = v1.x;
		var maxX = v2.x;
		if (v2.x < minX) {
			minX = v2.x;
			maxX = v1.x;
		}
		var minY = v1.y;
		var maxY = v2.y;
		if (v2.y < minY) {
			minY = v2.y;
			maxY = v1.y;
		}
		ShoGE.w("(" + minX + ", " + minY + "), (" + maxX + ", " + maxY + ")");
		this.start = new Vector2D(minX, minY);
		this.stop = new Vector2D(maxX, maxY);
	}
});


var GeMouse = Class.create({
	initialize: function(id) {
		this.elmID = id;
		this.pos = new Vector2D(0 , 0);
		this.click = new Array();
		this.area = null;
		this.status = null;
		this._init();
	},

	_init: function() {
		var that = this;
		Event.observe(this.elmID, 'mousemove', function(e) {
			that.pos.x =  Event.pointerX(e) - e.element().offsetLeft;
			that.pos.y =  Event.pointerY(e) - e.element().offsetTop;
		});
		Event.observe(this.elmID, 'mousedown', function(e) {
			that.mouseDown(
				Event.pointerX(e) - e.element().offsetLeft,
				Event.pointerY(e) - e.element().offsetTop
			);
		});
		Event.observe(this.elmID, 'mouseup', function(e) {
			that.mouseUp(
				Event.pointerX(e) - e.element().offsetLeft,
				Event.pointerY(e) - e.element().offsetTop
			);
		});
	},
	
	mouseDown: function(x, y) {
		this.down = new Vector2D(x,y);
		this.status = 'down';
		$('GameScreen').style.cursor = "crosshair";
	},
	
	mouseUp: function(x, y) {
		this.up = new Vector2D(x,y);
		this.status = 'up';
		var lX = Math.abs(this.up.x - this.down.x);
		var lY = Math.abs(this.up.y - this.down.y);
		ShoGE.w("lX: " + lX + ", lY: " + lY);
		if (lX > 1 || lY > 1) {
			this.area = new GeArea(this.down, this.up);
		} else {
			this.click.push(this.down.clone());
			this.area = null;
		}
		this.reset();
		$('GameScreen').style.cursor = "default";
	},
	
	reset: function() {
		this.down = null;
		this.up = null;
		this.status = null;
	},
	
	draw_area: function(ctx) {
		if (this.status == 'down') {
			var lX = this.pos.x - this.down.x;
			var lY = this.pos.y - this.down.y;
			if (Math.abs(lX) < 1 && Math.abs(lY) < 1) {
				return;
			}
			var a = new GeArea(this.down, this.pos);
			ctx.save();
			ctx.fillStyle = "rgba(200,0,0, 0.1)";
			ctx.fillRect (this.down.x, this.down.y, lX, lY);
			ctx.strokeStyle = "rgba(200,0,0, 0.8)";
			ctx.strokeRect(this.down.x, this.down.y, lX, lY);
			ctx.restore();
		}
	},
	
	draw: function(ctx) {
		this.draw_area(ctx);
	},
});
