var GeLevel = Class.create(GeObject, {
	initialize: function($super, parent, path) {
		$super(parent);
		this.path = path;
		this.cell_size = 256;
	},
});