var GeCamera = Class.create(GeTreeNode, {
	initialize: function($super, parent, object) {
		$super(parent);
		if (object) {
			this.object = object;
		} else {
			this.object = new GePosition(); // Bugged must be phys.pos...
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
	
});
