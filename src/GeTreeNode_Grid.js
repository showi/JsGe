var GeTreeNode_Grid = Class.create(GeTreeNode, {
	initialize: function($super, parent) {
		$super(parent);
	},
	_init: function(parent) {
		this.type = "grid";
		this.grid = new Array();
	},
	get: function(x, y) {
		if (!this.grid[x]) this.grid[x] = new Array();
		if (!this.grid[x][y]) {
			this.load(x,y);
		}
		return this.grid[x][y];
	},
	set: function(x, y, cell) {
		cell.x = x;
		cell.y = y;
		if (!this.grid[x]) {
			this.grid[x] = new Array();
		}
		this.grid[x][y] = cell;
		this.add_child(cell);
	},
	load: function(x, y) {
		var cell = new GeTreeNode_Cell(this, x, y);
		this.add_child(cell);
	},
});