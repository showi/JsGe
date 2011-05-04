var GeCamera = Class.create(GeObject, {
	initialize: function($super, pos) {
		$super();
		if (pos) {
			this.pos = pos;
		} else {
			this.pos = new GePosition();
		}
	},
});
