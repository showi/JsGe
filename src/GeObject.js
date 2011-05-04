var GeObject_GENID = 0;

var GeObject = Class.create({
	initialize: function() {
			this.id = ++GeObject_GENID;
			
	}
});

var GeGameObject = Class.create(GeObject, {
	initialize: function($super) {
		this.phs
	}
});