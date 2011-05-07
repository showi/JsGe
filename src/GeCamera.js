var GeCamera = Class.create(GeTreeNode, {
	initialize: function($super, parent, pos) {
		$super(parent);
		if (pos) {
			this.pos = pos;
		} else {
			this.pos = new GePosition();
		}
	},
	_init: function(parent) {
		this.type = "camera";
	},
	track: function(node) {
		this.tracked = node;
	
	},
	untrack: function() {
		this.tracked = null;
	},
	update: function(dt) {
		this.trac
	}
});
