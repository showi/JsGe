var GeTreeNode_Grid = Class.create(GeTreeNode, {
	
	initialize: function($super, parent, width, height, cell_size) {
		this.width = width;
		this.height = height;
		this.cell_size = cell_size;
		$super(parent);
	},
	
	_init: function(parent) {
		this.type = "grid";
		this.grid = new GeArray2D(this.width, this.height);
		this.load(0,0);
		this.load(1,0);
		this.load(0,1);
		this.load(1,1);
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
	
	load: function(x, y) {
		var cell = new GeTreeNode_Cell(this, x, y);
		this.set(x, y, cell);
		//this.add_child(cell);
	},
	
	add: function(node) {
		var x = Math.round(node.phys.pos.x / this.cell_size);
		var y = Math.round(node.phys.pos.y / this.cell_size);
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
});
