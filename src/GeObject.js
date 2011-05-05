var GeObject = Class.create({
	initialize: function() {
			this.core_id = GenID.get();
	},
	
	_getro: function() {
		if (this.parent) {
			return this.parent._getro();
		} else {
			return this;
		}
	}
});
