var GePosition = Class.create(Vector2D, {
	initialize: function($super, x, y, angle) {
		$super(x, y);
		this.orientation = angle;
	},
});

/* @PhysicalState: Storing physical state of game object
	R4K Integration: http://gafferongames.com/game-physics/integration-basics/
*/
var GePhysState = Class.create({
	initialize: function(parent) {
		this.parent = parent;
		this.pos = new GePosition(0.0, 0.0);
		//this.velocity = new Vector2D(0.0,0.0);
		this.force = new Vector2D(0, 0);
		this.movable = false;
		this.solid = false;
		this.set_mass(10);
		this.width = 32;
		this.height = 32;
	},
	set_mass: function(mass) {
		this.mass = mass;
		this.invmass = 1 / mass;
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
  applyForce: function(force, dt) {
	force.mul(dt);
	this.force.add(force);
  },
  update: function(dt) {
  //alert("x: " + this.velocity.x);
	var vmag = this.force.mag();
	//if (vmag < 0.0001) {
	//	this.force.x = this.force.y = 0;
	//}
	//this.applyForce(new Vector2D(0, 0.0002), dt);
  	if (this.pos.x < 16 || this.pos.x > 624) {
			if (this.pos.x < 16) {
				this.pos.x = 16;
			} else {
				this.pos.x = 624;
			}
			//this.force.x -= 0.002;
			this.force.x = - this.force.x ;
	}
	if (this.pos.y < 8 || this.pos.y > 464) {
		//this.force.y -= 0.002;
		this.force.y = - this.force.y ;
		if (this.pos.y < 8) {
			this.pos.y = 8;
		} else {
			this.pos.y = 464;
		}
	}
	var m = this.force.clone();
	m.mul(dt);
	this.pos.add(m);
	
  },
});

var RK4State = Class.create({
	initialize: function() {
		this.pos = new Vector2D(0, 0);
		this.force = new Vector2D(0, 0);
	},
	set_pos: function(x, y) {
		this.pos.set(x, y);
	},
	set_force: function(x, y) {
		this.force.set(x, y);
	},
});

var RK4Integrator = Class.create({
	initialize: function() {

	},
	acceleration: function (state, t) {
		return state.force * state.invmass;
	},
	evaluate: function(initial, t, dt, derivative) {
		var state = new RK4State();
		state.pos = initial.pos.clone();
		state.force = initial.pos.clone();
		var output = new RK4State();
		output.pos = state.pos.clone();
		output.force = this.acceleration(state, t + dt);
		return output;
	},
});