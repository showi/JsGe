var GeBounding = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super();
		this.type = 'base';
		this.parent = parent;
	},
});

