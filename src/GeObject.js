var GeObject = Class.create({
	initialize: function(parent) {
		this.core_id = ShoGE.GenID.get();
		this.parent = parent;
	},
	
	set_parent: function(parent) {
		this.parent = parent;
	},
	
	get_root: function() {
		if (this.parent) {
			return this.parent.get_root();
		} else {
			return this;
		}
	}
});
