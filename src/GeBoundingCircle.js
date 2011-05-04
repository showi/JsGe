var GeBoundingCircle = Class.create({
	initialize: function(parent, radius) {
		this.parent = parent;
		this.type = 'circle';
		this.radius = radius;
	},
	collide: function(oB) {
		if (this.parent == oB) {
			return;
		}
		if (oB.bounding.circle) {
			var tradius = this.radius + oB.bounding.circle.radius;
			var dist = this.parent.pos.dist(oB.pos);
			
			if (dist < tradius) {
				//Log.w("Collide: dist: " + dist + ", tradius: " + tradius);
			} else {
				//Log.w("No collision");
			}
		} else {
			alert("Object without bounding circle");
		}
	}
	
});