var GeTreeNode_Grid = Class.create(GeTreeNode, {
	
	initialize: function($super, parent, width, height, cell_size, tile_size, src) {
		this.src = src;
		this.width = width;
		this.height = height;
		this.cell_size	= cell_size;
		this.tile_size = tile_size;
		$super(parent);
	},
	
	_init: function(parent) {
		this.type = "grid";
		this.grid = new GeArray2D(this.width, this.height);
	},
	
	get: function(x, y) {
		return this.grid.get(x, y);
	},
	
	set: function(x, y, cell) {
		cell.x = x;
		cell.y = y;
		this.grid.set(x, y, cell);
		this.add_child(cell);
	},
	
	load: function() {
		ShoGE.w("Grid: loading " + this.src);
		//var cell = new GeTreeNode_Cell(this, x, y);
		//this.set(x, y, cell);
		var simg = ShoGE.Core.Images.get(this.src).get();
		var c = document.createElement('canvas');
		c.width = simg.width;
		c.height = simg.height;
		//var ctx = c.getContext('2d');
		//ctx.drawImage( simg, 0, 0);
		var row;
		var col;
		for (row = 0; row < this.height; row++) {
			for (col = 0; col < this.width; col++) {
				var c2 = document.createElement('canvas');
				c2.width = 10;
				c2.height = 10;
				var ctx2 = c2.getContext('2d');
				var sx = col *10;
				var sy = row * 10;
				var ex = 10;
				var ey = 10;
				//alert(sx + ", " + sy + ", " + ex + ", " + ey);
				//var data = ctx.getImageData(sx, sy, ex, ey);
				ctx2.drawImage(simg, col*10, row*10, 10, 10,
													0, 0, 10, 10);
				var cell = new GeTreeNode_Cell(this, col, row, 10, 16);
				ShoGE.w("Loading cell: " + col + ", " + row);
				cell.load(c2);
				this.set(col, row, cell);
				//return;
			}
		}
		$('GameDebug').appendChild(c2);

	},
	
	add: function(node) {
		var x = Math.round(node.phys.pos.x / this.cell_width);
		var y = Math.round(node.phys.pos.y / this.cell_height);
		//alert(x + ", " + y);
		var cell = this.get(x, y)
		//if (cell) 
		cell.add_child(node);
	},
	
	replace: function(node) {
		if (!node.bound || !node.bound.grid) {
			return;
		}
		var ccell = node.get_parent('cell');
		if (!ccell) { 
			//ShoGE.w("Node " + this.type + "not in cell"); 
			return; 
		}
		var x = Math.round(node.x / this.cell_size);
		var y = Math.round(node.y / this.cell_size);
		var ccell = node.get_parent('cell');
		if (ccell.x == x && ccell.y == y) {
			return;
		}
		var ncell;
		if (ncell = this.get(x, y)) {
			ccell.childs.remove(node);
			ncell.add_child(node);
		}
	},
	
	preload_ressources: function() {
		var that = this;
		ShoGE.Core.Images.add(this.src, function() { that.load()});
	},
});
