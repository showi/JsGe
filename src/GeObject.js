var GeObject = Class.create({
	initialize: function() {
			this.core_id = ShoGE.GenID.get();
	},
	
	get_root: function() {
		if (this.parent) {
			return this.parent._getro();
		} else {
			return this;
		}
	}
});
