var GeVector3D = Class.create({
	initialize: function(x, y, z) {
		this.set(x, y, z);
	},
	
	set: function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	},
	add: function(vB) {
		this.x += vB.x;
		this.y += vB.y;
		this.z += vB.z;
	},
	sub: function(vB) {
		this.x -= vB.x;
		this.y -= vB.y;
		this.z -= vB.z;
	},	
	mul: function(n) {
		this.x *= n;
		this.y *= n;
		this.z *= n;
	},
	div: function(vB) {
		this.x /= n;
		this.y /= n;
		this.z /= n;
	},
	length: function() {
	
	}
});