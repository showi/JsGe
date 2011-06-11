var GeSubMap = Class.create(GeEntity, {

	initialize: function($super, parent, path, id, width, height, tileWidth) 
	{
		$super(parent);
		this.setId(id);
		this.path = path;
		this.loaded = false;
		this.width = width;
		this.height = height;
		this.map = new GeArray2D(width, height);
		this.buffer = new GeImageBuffer(this, width, height);
		this.setTileWidth(tileWidth);
		this.Walker = new GeSubMapWalker(this);
		this.loadFromBig = true;
		var dX = tileWidth * 0;
		var dY = tileWidth * 0;

		//this.Position.set(Math.round(-this.width/2*tileWidth), Math.round(this.height/2*tileWidth));
		this.Position.set(0, 0);
		this.enable('childs');
		this.enable('canvas', new GeSubMap_Draw(this));
		this.images = new Hash();
		this.buildFrom = new Hash();
		var that = this;
		this.buildFrom.set('shadow', function() { that.buildFromShadow(); });
		this.buildFrom.set('creatures', function() { that.buildFromCreatures(); });
		this.buildFrom.set('nature', function() { that.buildFromNature(); });
		if (!ShoGE.Core.TilePool) {
			ShoGE.Core.TilePool = new GeTilePool (ShoGE.Core);
		}
		this.loading = 0;
		var Twalk = new GeTile(this, "")
		ShoGE.Core.TilePool.add('walkable', new GeTile(this, 'walkable'));
		ShoGE.Core.TilePool.add('wall', new GeTile(this, 'wall'));		
		this.loadLayer('shadow');	
	},

	setTileWidth: function(v) {
		if (v == this.tileWidth) {
			return;
		}
		this.setNeedRedraw(true);
		this.tileWidth = v;
	},
	
	pointInMap: function(x, y) {
		if (x < 0) return false;
		if (x > this.width) return false;
		if (y < 0 ) return false;
		if (y < this.height) return false;
		return true;
	},
	
	update: function(dt) {
		var max = this.width * this.height;
		for (var i = 0; i < max; i++) {
			var tile = this.map.get(i, 0);
			if (tile) tile.update(dt);
		}
	},
	
	
	buildTileOverlay: function() {
		ShoGE.w("Building tile overlay");
		for (var row = 0; row < this.height; row++) {
			for (var col = 0; col < this.width; col++) {
				var tile = this.map.get(col, row);
				if (!tile || tile.isWalkable()) 
				{
					continue;
				}
				tile.hasFriend(GE_SOUTH, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_SOUTH);
						return false;
					}
					return true;
				});
				tile.hasFriend(GE_NORTH, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_NORTH);
							return false;
					}
					return true;
				});
				tile.hasFriend(GE_EAST, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_EAST);
							return false;
					}
					return true;
				});
				tile.hasFriend(GE_WEST, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_WEST);
							return false;
					}
					return true;
				});
				
			}
		}
	},
	
	readImage: function(layer, callback) {
		var src = this.path + this.id + "-" + layer + ".png";
		var img = ShoGE.Core.Images.get(src);
		if (!img) {
			throw("Cannot load" + src + " from images pool!");
		}
		var canvas = img.as_canvas();
		var ctx = canvas.getContext('2d');
		var ti = 0;
		var d = ctx.getImageData(0,0, canvas.width, canvas.height);
		for (var row = 0; row < canvas.height; row++) {
			for (var col = 0; col < canvas.width; col++) {
				var step = (row * d.width*4) + (col *4);
				var r = d.data[step];
				var g = d.data[step + 1];
				var b = d.data[step + 2];
				var a = d.data[step + 3];
				var tile =  this.map.get(col, row);
				if (!tile) {
					ti++;
					//ShoGE.w("Add tile: " + ti );
					tile = new GeTile(this, col+"-"+row, col, row, this.tileWidth);		
					this.map.set(col,row, tile);
				}
				callback(this, tile, r, g, b ,a);
			}
		}
	},

	setTileProp: function(tile, st, g) {
		tile.setType('tile', st);
		tile.setG(g);
	},
	buildFromNature: function() {
		ShoGE.w("Build from nature");
		this.readImage('nature', function(that, tile, r, g, b, a) {
			//ShoGE.w(r + '-' + g + '-' + b + '-' + a);
			if (a != 255) {
				ShoGE.w("No nature for this tile");
				return false;
			}
			if (r == 50 && g == 50 && b == 255) {
				that.setTileProp(tile, GE_WATER, GE_WATER_WEIGHT);
			} else if (r == 50 && g == 50 && b == 50) {
				that.setTileProp(tile, GE_DEEPWATER, GE_DEEPWATER_WEIGHT);
			}
			var src = ShoGE.Core.TileSprite.loadRGB(r, g, b);
			tile.addLayer(src);
			return true;
		});
	},

	buildFromCreatures: function() {
		ShoGE.w("Build from creatures");
		this.readImage('creatures', function(that, tile, r, g, b, a) {
			if (r == 0 && g == 255 && b == 0) {
				ShoGE.w("Found monster (green) x: " + tile.col + " y: " + tile.row);
				var monster = new GeEntity_Monster(null, that.tileWidth);
				ShoGE.Core.Monster = monster;
				that.Walker.moveTo(monster, tile.col, tile.row);
				//tile.addChild(monster);
			}
		});
	},
	
	buildFromShadow: function() {
		this.readImage('shadow', function(that, tile, r, g, b, a) {
			if (a != 255) {
				tile.setWalkable(true);
				that.setTileProp(tile, GE_GRASS, GE_GRASS_WEIGHT);
	
			} else {
				tile.setWalkable(false);
				that.setTileProp(tile, GE_WALL, GE_WALL_WEIGHT);
	
			}
		});	
	},
	
	loadLayer: function(layer) {
		ShoGE.w("Layer:" + layer);
		var path = this.path + this.id + "-" + layer + ".png";
		var that = this;
		this.loading++;
		this.images.set(layer, ShoGE.Core.Images.add(path, function() {
			that.loading--;
			var meth = that.buildFrom.get(layer);
			if (!meth) {
				throw("No method to build layer '"+layer+"'");
				return false;
			}
			return meth();
		}));
	},
	
	setId: function(id) 
	{
		this.id = id;
	},
	
	getId: function() 
	{
		return this.id;
	},
	
	preload_ressources: function() {
		this.loadLayer('nature');
		this.loadLayer('creatures');
		this.buildTileOverlay();
	},
	
});

var GeSubMap_Draw = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);
	},
	
	draw: function(renderer) 
	{	
			var numH = renderer.Screen.width / this.parent.tileWidth + 1;
			var numV = renderer.Screen.height / this.parent.tileWidth + 1;
			var position;
			if (renderer.Camera.tracked.parent) {
				position = renderer.Camera.tracked.parent.Position;
			} else { return; position = this.parent.Position; }
			var p = this.parent.Walker.getMapPosition(position);

			var minX, maxX, minY, maxY;
			minX = p.getX() - numH;
			if (minX < 0) {
				minX = 0;
			}
			maxX = p.getX() + numH -1;
			if (maxX > this.parent.width) {
				maxX = this.parent.width;
			}
			minY = p.getY() - numV;
			if (minY < 0) {
				minY = 0;
			}
			maxY = p.getY() + numV - 1;
			if (maxY > this.parent.height) {
				maxY = this.parent.height;
			}
			minX = Math.round(minX);
			maxX = Math.round(maxX);
			minY = Math.round(minY);
			maxY = Math.round(maxY);
			//renderer.save();
			this.drawIso(renderer, minX, minY, maxX, maxY);
			
			//this.drawCache(this.parent.buffer, minX, minY, maxX, maxY);
			//var ctx = renderer.getContext(1);
			//ctx.drawImage(this.parent.buffer.getCanvas(), 0,0);// this.parent.width*this.parent.tileWidth, this.parent.height*this.parent.tileWidth);
			//renderer.restore();	
	},
	
	drawIso: function(renderer, minX, minY, maxX, maxY) {
			var row, col, i;
			//ShoGE.w("Draw From: " + minX + " to " + maxX + " and From " + minY + " to " + maxY);

				for (col = minX; col < maxX; col++) {
							for (row = minY; row < maxY; row++) {
							var x = col - row;
							var y = Math.round((col + row ) /2);
					this.parent.map.get(col, row).canvas.drawIso(renderer);
				}
			}
	},
	
	drawCache: function(renderer, minX, minY, maxX, maxY) {
			var row, col, i;
			//ShoGE.w("Draw From: " + minX + " to " + maxX + " and From " + minY + " to " + maxY);
			for (col = minX; col < maxX; col++) {
			for (row = minY; row < maxY; row++) {
				
					this.parent.map.get(col, row).canvas.drawCache(this.parent.buffer);
				}
			}
	},
	
	drawMap1: function(renderer, minX, minY, maxX, maxY) {
			var row, col, i;
			//ShoGE.w("Draw From: " + minX + " to " + maxX + " and From " + minY + " to " + maxY);
			for (row = minY; row < maxY; row++) {
				for (col = minX; col < maxX; col++) {
					this.parent.map.get(col, row).draw(renderer);
				}
			}
	},
	drawMap2: function(renderer, minX, minY, maxX, maxY) {
		var MAX = maxX * maxY;
		for (var i = 0; i < MAX; i++) {
			var row = Math.floor(i / maxX);
			var col = i - row * maxX;
			this.parent.map.get(col, row).draw(renderer);
		}
	},
	drawMap3: function(renderer, minX, minY, maxX, maxY) {
		var MAX = minX + maxX * maxY;
		for (var i = minX; i < MAX; i++) {
			//var diz = 0;
			
			this.parent.map.data[i].draw(renderer);
		}
	},
});

var GeSubMapWalker = Class.create(GeObject, {
	
	initialize: function($super, parent) {
		$super(parent);
	},
	
	addTo: function(entity, x, y) 
	{
		
	},
	getMapPosition: function(p) 
	{
		return p.clone().div(this.parent.tileWidth/2 ).floor();
	},
	
	isWalkable: function(mapPos) 
	{
		var tile = this.parent.map.get(mapPos.getX(), mapPos.getY());
		if (!tile) {
			return null;
		}
		return tile.isWalkable();
	},
	
	moveTo: function(entity, x, y) 
	{
		//ShoGE.w("MoveTo x: " + x + ", y: " + y);
			var tile = this.parent.map.get(x, y);
			if (!tile) {
				//ShoGE.w("Cannot move there's no tile");
				return false;
			}
			if (!tile.isWalkable()) {
				//ShoGE.w("Cannot move to non walkable tile ");
				return false;
			}

			return this.associate(entity, tile);
	},
	
	associate: function(entity, tile) {
		if (entity.parent == tile) {
			ShoGE.w("Associate loop");
			return false;
		}
		if (entity.parent) {
			entity.parent.removeChild(entity);
		}
		var dw = this.parent.tileWidth / 2;
		entity.parent = tile;
		entity.Position.set(dw,dw);
		tile.addChild(entity);
		return true;
	},
	
	move: function(entity, d) 
	{
		ShoGE.w("Move");
		var pos;
		if (entity.parent ) {
			pos = entity.parent.Position.clone().add(d);
		} else {
			ShoGE.w("Warning: cannot walk no parent");//pos = entity.Position.clone().add(d);
			return false;
		}
		var mapPos = this.getMapPosition(pos);
		var tile;
		if (tile = this.parent.map.get(mapPos.getX(), mapPos.getY())) {
			if (!tile.isWalkable()) {
				ShoGE.w("Cannot move non walkable");
				return false;
			}
			ShoGE.w("Associate");
			this.associate(entity,tile);
			//entity.Position = pos;
			return true;
		} else {
			ShoGE.w("Cannot move");
		}
		return false;
	},
	
	moveCardinal: function(entity, cardinal) {
		if (!entity || !entity.parent) 
		{
			throw("Entity without parent");
		}
		//ShoGE.w("moveCardinal: " + cardinal);
		var col = entity.parent.getCol();
		var row = entity.parent.getRow();
		switch(cardinal) {
			case GE_NORTH:
				return this.moveTo(entity, col, row - 1);
			break;
			case GE_EAST:
				return this.moveTo(entity, col + 1, row);
			break;
			case GE_SOUTH:
				return this.moveTo(entity, col, row + 1);
			break;
			case GE_WEST:
				return this.moveTo(entity, col, row - 1);
			break;
			default:
				return false;
		}
	},
	
});

