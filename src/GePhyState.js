var GePosition = Class.create(Vector2D, {
	initialize: function($super, x, y, orientation) {
		$super(x, y);
		if (orientation) {
			this.orientation = orientation;
		} else {
			this.orientation = new Vector2D(0, 1);
		}
	},
});

/* @PhysicalState: Storing physical state of game object
	R4K Integration: http://gafferongames.com/game-physics/integration-basics/
*/
var GePhysState = Class.create({
	initialize: function(parent) {
		this.parent = parent;
		this.pos = new GePosition(0.0, 0.0, null);
		this.velocity = new Vector2D(0.0,0.0);
		this.force = new Vector2D(0.0, 0.0);
		this.movable = false;
		this.solid = false;
		this.set_mass(10.0);
		this.width = 32;
		this.height = 32;
		this.minval = 0.00001;
	},
	get_force: function() {
		return this.force();
	},
	set_mass: function(mass) {
		this.mass = mass;
		this.invmass = 1.0 / mass;
	},
	setPosX: function(x) {
		this.pos.x = x;
	},
	setPosY: function(y) {
		this.pos.y = y;
	},
	getPosX: function() {
		return this.pos.x;
	},
  getPosY: function() {
	return this.pos.y;
  },
  isSolid: function() {
	return this.solid;
  },
  setSolid: function(bSolid) {
	this.solid = bSolid;
  },
  isMovable: function() {
	return this.movable;
  },
  setMovable: function(bMovable) {
	this.movable = bMovable;
  },
  applyForce: function(force) {
	if (!this.force) {
		this.force = new Vector2D(0,0);
	}
	this.force.add(force);
  },
  update: function(dt) {

	if (this.force) {
		this.force.set(0,0);
			// Gravity
	//this.applyForce(new Vector2D(0.0, 9.81/1000).mul(dt));
	// Friction (Loss Of energy)
	//this.applyForce(
	//	this.velocity.clone().normalize().inv().mul(this.minval).mul(dt)
	//);
		var m = this.force.clone();
		m.mul(this.invmass).mul(dt);
		if (Math.abs(m.x) < this.minval) m.x = 0;
		if (Math.abs(m.y) < this.minval) m.y = 0;
		this.velocity.add(m);
		/*var s = new RK4State();
		s.pos = this.pos.clone();
		s.force = this.force.clone();
		var i = new RK4Integrator();
		i.integrate(s, ShoGE.Core.t, ShoGE.Core.dt);
		this.pos = i.pos;*/
		
	}
	if (Math.abs(this.velocity.x) < this.minval) {
		this.velocity.x = 0;
	}
	if (Math.abs(this.velocity.y) < this.minval) {
		this.velocity.y = 0;
	}
	if (this.velocity.x == 0 && this.velocity.y == 0) {
		this.parent.freeze();
	}
	this.pos.add(this.velocity);
	
	
	  	if (this.pos.x < 16 || this.pos.x > 640 - 16) {
			if (this.pos.x < 16) {
				this.pos.x = 16;
			} else {
				this.pos.x = 640 - 16;
			}
			//this.force.x -= 0.002;
			this.velocity.x = - this.velocity.x ;
	}
	if (this.pos.y < 17 || this.pos.y > 480 - 17) {
		//this.force.y -= 0.002;
		if (this.pos.y < 17) {
			this.pos.y = 17;
		} else {
			this.pos.y = 480 - 17;
		}
		this.velocity.y = - this.velocity.y ;
	}
	this.pos.x = Math.round(this.pos.x);
	this.pos.y = Math.round(this.pos.y);
  },
});

