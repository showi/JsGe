var GeDiscreteTime = Class.create(GeObject, {
	initialize: function($super, parent, dt) {
		$super(parent);
		this.dt = dt;
		this.t = 0;
		this.accumulator = 0;
		this.currentTime = Date.now();
		this.startTime = this.currentTime;
		this.alpha = 0;
	},
	
	consume: function(that) {
		//ShoGE.w("plop");
		var newTime = Date.now();
		var frameTime = newTime - this.currentTime;
		this.currentTime = newTime;
		this.accumulator += frameTime;
		while(this.accumulator > this.dt) {
		//ShoGE.w("Consume");
	
			this.accumulator -= this.dt;
			this.t += this.dt;
			//this.parent.hookPreUpdate(this);
			ShoGE.Core.SG.update(this.dt);
			//this.parent.hookPostUpdate(this)
		}
		this.alpha += (this.accumulator / this.dt);
	}
});