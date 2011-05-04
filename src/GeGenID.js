var GeGenID = Class.create({
	initialize: function() {
		this.id = 0;
	},
	get: function() {
		return this.id++;
	}
});
var GenID = new GeGenID();