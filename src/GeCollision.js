var GeCollision = Class.create(GeObject, {
	initialize: function($super, type, objA, objB) {
		$super(parent);
		this.type = type;
		this.A = objA;
		this.B = objB;
		var wallNormal = new Vector2D(0,0).link(this.A.phys.pos, this.B.phys.pos);
		this.wallNormal = wallNormal.normalize()
	},
	correct: function() {
		if (this.type == 'cc') {
			this.correct_cc();
		}
	},
	correct_cc: function() {
		var wN = this.wallNormal.clone();
		wN.mul(this.delta);
		this.A.phys.pos.sub(wN);
	},
	
	
});