var Vector2D = Class.create({
  initialize: function(x, y) {
	this.set(x, y);
  },
  set: function(x, y) {
	this.x = x;
	this.y = y;
  },
  clone: function() {
	return new Vector2D(this.x, this.y);
	},
	equals: function(v) {
		if (this.x != v.x || this.y != v.y) {
			return false;
		}
		return true;
	},
	mag: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
  add: function(b) {
	this.x += b.x;
	this.y += b.y;
  },

  inv: function() {
	this.x = - this.x;
	this.y = - this.y;
  },
  mul: function(b) {
	this.x *= b;
	this.y *= b;
  },
  dist: function (b) {
	var dist = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
	return dist;
  },
  
  dot: function(b) {
	return this.x * b.x + this.y + b.y;
  },
  
  norm: function() {
	var m = this.mag();
	if (m > 0.0) {
		this.x / m;
		this.y / m;
	}
	return this;
  }
});