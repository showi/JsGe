var GeBoundingCircle = Class.create(GeBounding, {
	initialize: function($super, parent, radius) {
		$super(parent);
		this.type = 'circle';
		this.radius = radius;
	},
	
	collide_against_circle: function(node) {
		var c = null;
		if (node.bound && node.bound.circle) {
			//alert("plop");
			if (c = this.check_cc(node)) {
				return c;
			}
		}
		for (var i = 0; i < node.childs.length; i++) {
			var child = node.childs[i];
			if (child.bound && child.bound.circle) {
				if (c = this.collide_against_circle(child)) {
					return c;
				}
			}
		}
		return null;
	},
	
	check_cc: function(node) {
		if (this.parent == node) {
			return null;
		}
		//Log.w("Collision btw " + this.core_id + " and " + node.core_id);
		
		var tradius = this.radius + node.bound.circle.radius;
		var dist = this.parent.phys.pos.dist(node.phys.pos);
		var delta = dist - tradius;
		if (delta < 0) {
			var c = new GeCollision('cc', this.parent, node);
			c.tradius = tradius;
			c.dist = dist;
			c.delta = -delta;
			//c.correct();
			
				return c;//Log.w("Collide: dist: " + dist + ", tradius: " + tradius);
		} else {
				return null;
				//Log.w("No collision");
		}
		return null;
		
	},
	collide: function() {	
		return this.collide_against_circle(Core.SG);
	}
	
});