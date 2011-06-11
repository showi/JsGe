var GeDrawTile = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);

	},
	
	drawLayer: function(ctx, i) 
	{
			ctx.drawImage(ShoGE.Core.Images.get(this.parent.layers[i]).as_canvas(), 0, 0, this.parent.u.getX()*2, this.parent.v.getY()*2);
	},
	
	_draw: function(ctx) {
			ctx.save();
	var A = new GeVector3D(0,0,0).sub(this.parent.u).sub(this.parent.v);
		var C = new GeVector3D(0,0,0).add(this.parent.u).add(this.parent.v);
				
		var i;
		for (i = 0; i < this.parent.layers.length; i++) {
				this.drawLayer(ctx, i);
			}

			ctx.translate(this.parent.u.getX(), this.parent.v.getY());
			var d = new Date();
			var h = d.getHours();
			var sign = 0;
			
			if (h <= 12) { a = 1 - (h*1.5 * (1/24)) }
			else { a = ((h-12)*1.5 * (1/24)) }
			if (a >= 0.7) {a = 0.7;}
			if (a < 0) {a = 0;}
			if (this.parent.isWalkable()) {
				ctx.fillStyle = 'rgba(0,0,0,'+ a+')';
				ctx.strokeStyle = 'rgba(255,255,255,0.1)';

			} else {
				ctx.strokeStyle = 'rgba(0,0,0,0.3)';
				ctx.fillStyle = 'rgba(0,0,0,'+a+')';
			}
			ctx.fillRect(A.getX(), A.getY(), C.getX(), C.getY());	
			ctx.strokeRect(A.getX(), A.getY(), C.getX(), C.getY());
			ctx.restore();
	},

	draw: function(renderer) 
	{
		if (this.parent.needRedraw()) {
			this.setBuffer();
			var ctx =  this.cache.getContext('2d');
			//ctx.fillStyle = 'rgba(255,255,255,0)';
			this._draw(ctx);
			this.parent.setNeedRedraw(false);
		}
		//ShoGE.w("draw tile");
		var ctx = renderer.getContext(GE_LAYER_GROUND);
		ctx.drawImage(this.cache, 0,0);
	
	},

	drawIso: function (renderer) {
		var ctx = renderer.getContext(1);
		//clip[name]._x = (j-i)*game.tileW;
		//clip[name]._y = (j+i)*game.tileW/2;
		var x = (this.parent.row - this.parent.col) * 32;
		var y = (this.parent.col + this.parent.row) * 16;
		ctx.save();
		ctx.translate(x, y);
		if (this.parent.isWalkable()) {
		//ShoGE.w("Draw " + x + ", " + y);
				ctx.drawImage(ShoGE.Core.Images.get('tile-iso-ground.png').asCanvas(), 0,0);
		} else {
				ctx.drawImage(ShoGE.Core.Images.get('tile-iso-wall.png').asCanvas(), 0,0);		
		}
		ctx.restore();
		
	},
	
	drawCache: function(buffer) {
		if (this.parent.needRedraw()) {
			this.setBuffer();
			var ctx =  this.cache.getContext('2d');
			//ctx.fillStyle = 'rgba(255,255,255,0)';
			this._draw(ctx);
			this.parent.setNeedRedraw(false);
		}
		var ctx =	buffer.getContext();
		var width = this.parent.u.getX() * 2;
		var height = this.parent.v.getY() * 2;
		var x = this.parent.col * this.parent.tileWidth;
		var y = this.parent.row * this.parent.tileWidth;
		ctx.drawImage(this.cache, 0,0, width, height, x, y, x + this.parent.tileWidth, y + this.parent.tileWidth); 
	},
	
	setBuffer: function() 
	{
		if (!this.cache) {
			this.cache = document.createElement('canvas');
			this.cache.width = this.parent.u.getX() * 2;
			this.cache.height = this.parent.v.getY() * 2;
		}
	},

	isCached: function() {
		if (this.cache) {
			return true;
		}
		return false;
	},

	resetCache: function() {
		this.cache = null;
	},
});

var GeTileSprite = Class.create(GeObject, {
	initialize: function($super, parent) 
	{
		$super(parent);
	},
	
	buildPath: function(r, g, b) {
		return "tiles/tile-64x64-" + r + "-" + g + "-" + b + ".png";
	},
	
	loadRGB: function(r, g, b) 
	{
		var path = this.buildPath(r, g, b);
		ShoGE.Core.Images.add(path);
		return path;
	},
	
	getRGB: function(r, g, b) 
	{
		var path = this.buildPath(r, g, b);
		return ShoGE.Core.Images.get(path);
	},
	
});

var GeTile = Class.create(GeEntity, {
	
	initialize: function($super, parent, id, col, row, width) {
		$super(parent);
		this.setType("tile");
		var w = width / 2;
		this.setU(w, 0, 0);
		this.setV(0, w, 0);
		this.setG(0);
		this.row = row;
		this.col = col;
		this.id = id;
		this.Position.set(col*w+w, row*w+w);
		this.setWalkable(false);
		this.enable('childs');
		this.enable('canvas', new GeDrawTile(this));
		this.layers = new Array();
	},
	
	setG: function(v) {
		this.g = v;
	},
	
	getG: function() {
		return this.g;
	},
	
	getRow: function() {
		return this.row;
	},
	
	getCol: function() {
		return this.col;
	},
	
	addLayer: function(layer) {
	
		this.layers.push(layer);
		this.setNeedRedraw(true);
	},
	
	setWalkable: function(b) 
	{
		this.walkable = b;
	},
	
	isWalkable: function() 
	{
		return this.walkable;
	},
	
	isLoaded: function() 
	{
		return this.loaded;
	},
	
	getImage: function() 
	{
		return ShoGE.Core.Images.get(this.src);
	},
	
	addBorder: function(cardinal) 
	{
		switch(cardinal) {
		
		case GE_NORTH:
			var path = "tiles/tile-64x64-border-north.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
			
		case  GE_SOUTH:
			var path = "tiles/tile-64x64-border-south.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
			
		case GE_EAST:
			var path = "tiles/tile-64x64-border-east.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
			
		case GE_WEST: 
			var path = "tiles/tile-64x64-border-west.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
		
		default:
			throw("Unknow cardinal border '"+cardinal+"'");
		}
	},
	hasFriend: function(cardinal, callback) 
	{
		if (cardinal == GE_NORTH) {
			if ( 0 >= (this.row - 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col, this.row - 1);
			if (callback(this, ft)) {
			}
			return 1;
		} 	else if (cardinal == GE_SOUTH) {
			if ( this.parent.height <= (this.row + 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col, this.row + 1);
			if (callback(this, ft)) {
			}
			return 1;
		} 	else if (cardinal == GE_EAST) {
			if ( this.parent.width <= (this.col + 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col + 1, this.row);
			if (callback(this, ft)) {
			}
			return 1;
		} 	else if (cardinal == GE_WEST) {
			if ( 0 >= (this.col - 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col - 1, this.row);
			if (callback(this, ft)) {
			}
			return 1;
		}
		return 0;
	},
	
});

var GeTilePool = Class.create(GeObject, {

	initialize: function($super, parent) 
	{
		$super(parent);
		this.pool = new Hash();
	},
	
	add: function(id, tile) 
	{
		if (!(tile instanceof GeTile)) {
			throw("ERROR_TILEPOOL_ADD_BADINSTANCE");
			return null;
		}
		var tile;
		if (tile = this.pool.get(id)) {
			throw("ERROR_TILEPOOL_ADD_SAMEID");
			return null;
		}
		this.pool.set(id, tile);
	},
	
	get: function(id) 
	{
		return this.pool.get(id);
	},
	
});