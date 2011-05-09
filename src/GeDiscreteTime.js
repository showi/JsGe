var GeDiscreteTime = Class.create(GeObject, {
	initialize: function($super, dt) {
		$super();
		this.dt = dt;
		this.t = 0;
		this.accumulator = 0;
		this.currentTime = Date.now();
		this.startTime = this.currentTime;
	},
	
	consume: function(that) {
		var newTime = Date.now();
		var frameTime = newTime - this.currentTime;
		this.currentTime = newTime;
		this.accumulator += frameTime;
		while(this.accumulator > this.dt) {
			this.accumulator -= this.dt;
			this.t += this.dt;
			that.update(this.dt);
		}
		this.alpha = this.accumulator / this.dt;
	}
});