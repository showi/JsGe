
// Source: src/GeGlobals.js

var ShoGE = new Object();

// Source: src/GeVar.js

var GeVar = Class.create({
	initialize: function(value, dl, ul) {
		this.ulimit = ul;
		this.dlimit = dl;
		this.flag = 0;
		this.set(value);
	},
	set_ulimit: function(limit) {
		this.ulimit = limit;
		this._ulimit(limit);
	},
	set_dlimit: function(limit) {
		this.dlimit = limit;
		this._dlimit(limit);
	},
	set: function(value) {
		this.value = value;
		if (this.ulimit != null) {
			this._ulimit(this.ulimit);	
		}
		if (this.dlimit != null) {
			this._dlimit(this.dlimit);
		}
	},
	get: function() {
		return this.value;
	},
	_ulimit: function (limit) {
		if(this.value > limit) {
			this.flag = 1;
			this.value = limit;
		} else {
			this.flag = 0;
		}
	},
	_dlimit: function (limit) {
		if(this.value < limit) {
			this.flag = -1;
			this.value = limit;
		} else {
			this.flag = 0;
		}
	},
	inc: function(inc) {
		this.set(this.value + inc);
	},
	dec: function(dec) {
		this.set(this.value - inc);
	}
});

// Source: src/GeGenID.js

var GeGenID = Class.create({
	initialize: function() {
		this.id = 0;
	},
	get: function() {
		return this.id++;
	}
});

ShoGE.GenID = new GeGenID();

// Source: src/GeObject.js

var GeObject = Class.create({
	initialize: function() {
			this.core_id = ShoGE.GenID.get();
	},
	
	get_root: function() {
		if (this.parent) {
			return this.parent._getro();
		} else {
			return this;
		}
	}
});


// Source: src/GeLog.js

var GeLog = Class.create(GeObject, {
	initialize: function($super, id) {
		$super();
		this.elm = document.getElementById(id);
		this.count = 0;
		
	},
	w: function(msg) {
		if(!this.elm) {
			return;
		}
		if (this.count >100) {
			this.count = 1;
			this.elm.innerHTML = "";
		}
		var date = new Date();
		this.elm.innerHTML += "[" + date.getTime() + "] " + msg + "<br>";
		this.count++;
	}
});

//var Log;
//var log;

// Source: src/GeVector2d.js

var Vector2D = Class.create({
  initialize: function(x, y) {
	this.set(x, y);
	return this;
  },
  is_vector: function(v) {
	if (v instanceof Vector2D) {
		return true;
	}
	return false;
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
	return this;
  },
  sub: function(b) {
	this.x -= b.x;
	this.y -= b.y;
	return this;
  },
  inv: function() {
	this.x = - this.x;
	this.y = - this.y;
	return this;
  },
  mul: function(b) {
	this.x *= b;
	this.y *= b;
	return this;
  },
  dist: function (b) {
	var dist = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
	return dist;
  },
  
  dot: function(b) {
	return this.x * b.x + this.y + b.y;
  },
  angle: function(v) {
	return Math.PI/180* Math.acos(this.dot(v));
  },
  normalize: function() {
	var m = this.mag();
	if (m != 0) {
		this.x /= m;
		this.y /= m;
	}
	return this;
  },
  link: function(A, B) {
	this.x = B.x - A.x;
	this.y = B.y - A.y;
	return this;
  },
  normal: function() {
	var v = new Vector2D(0,0);
	v.x = - this.y;
	v.y =  this.x;
	return v;
  },
  proj: function(b) {
		var dp = this.dot(b);
		var p = new Vector2D(0,0);
		p.x = (dp / (b.x * b.x + b.y * b.y)) * b.x;
		p.y = (dp / (b.x * b.x + b.y * b.y)) * b.y;
		return p;
  } 
  
  
});

// Source: src/GeScreen.js

var GeScreen = Class.create(GeObject, {
	initialize: function(parent, id, width, height) {
		this.id = id;
		this.parent = parent;
		this.width = width;
		this.height = height;
		this.canvas = document.getElementById(id);
		if (!this.canvas.getContext || !this.canvas.getContext('2d')){
			alert("HTML 5 canvas may be not supported on your system");
			exit(1);
		}
		this.ctx = this.canvas.getContext('2d');
		this.init_buffer(); 
	},
	get_layer: function(id) {
		if (id < 0) {
			id = 0;
		}
		if (id > 10) {
			id = 10;
		}
		if (this.layers[id]) {
			return this.layers[id];
		}
		var c = document.createElement('canvas');
		this.layers[id] = c.getContext('2d');
	},
	init_buffer: function() {
		this.layers = new Array();
		var b = document.createElement('canvas');
		b.width = this.width;
		b.height = this.height;
		this.buffer = b;
		var ctx = b.getContext('2d');
		ctx.fillStyle = "rgb(20,20,250)";
		ctx.fillRect (0, 0, this.width, this.height);
	},
	swap: function() {
		//this.clear();
		this.ctx.drawImage(this.buffer, 0, 0);
	},
	clear: function(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect (0, 0, this.width, this.height);
	}

});

// Source: src/GeMouse.js

var GeMouse = Class.create({
	initialize: function(id) {
		this.pos = new Vector2D(0 , 0);
		this._init();
	},
	_init: function() {
		var that = this;
		Event.observe('GameScreen', 'click', function(event) {
			var gs = $('GameScreen');
			that.pos.x = Event.pointerX(event);
			that.pos.y = Event.pointerY(event);
			//$('clickatX').innerHTML = that.pos.x;
			//$('clickatY').innerHTML = that.pos.y;
			//Log.w("Clicked at: " +  that.pos.x + ", "  + that.pos.y);
		});
	},
});


// Source: src/GeImagePool.js

/*# > Object < #*/
var GeMedia_Image = Class.create(GeObject, {
	/*# > Method < #*/
	initialize: function($super, src) {
		$super();
		if (src) {
			this.set(src);
		}
	},
	/*# > Method < #*/
	set: function(src) {
		this.img = new Image();
		this.img.src = src;
		this.loaded = false;
		var that = this;
		this.img.onload = function() {
			that.loaded = true;
			Log.w("Image '" + that.img.src + " loaded");
		};
	},
	/*# > Method < #*/
	get: function() {
		return this.img;
	},
});

/*# > Object < #*/
var GeMediaPool = Class.create(GeObject, {
	/*# > Method < #*/
	initialize: function($super, id) {
		$super();
		this.pool = new Array();
		this.path = "res/img/";
		this.nothing = new GeMedia_Image(this.path + "nothing.png");
	
	},
	/*# > Method < #*/
	add: function(src) {
		if (this.pool[src]) {
			alert("Image '" + src + " already in pool");
			return null;
		}
		this.pool[src] = new GeMedia_Image(this.path + src);
		return this.pool[src];
	},
	/*# > Method < #*/
	get: function(src) {
		if (!this.pool[src] || !this.pool[src].loaded) {
			return this.nothing;
		}
		return this.pool[src];
	},
});



// Source: src/GeCollision.js

var GeCollision = Class.create({
	initialize: function(parent, type, objA, objB) {
		this.parent = parent;
		this.type = type;
		this.A = objA;
		this.B = objB;
		this.calcNormal()
	},
	calcNormal: function() {
		if (this.type == 'cc') {
			var wallNormal = new Vector2D(0,0).link(this.A.phys.pos, this.B.phys.pos);
			this.wallNormal = wallNormal.normalize();
		}
	},
	correct: function() {
		if (this.type == 'cc') {
			this.correct_cc();
		}
	},
	correct_cc: function() {
		//Log.w("Correct cc");
		var wN = this.wallNormal.clone();
		wN.mul(this.delta);
		this.A.phys.pos.sub(wN);
	},
	
	response: function() {
		if (this.type == 'cc') {
			this.response_cc();
		}
	},
	
	response_cc: function() {
	return;
		var delta = this.A.phys.pos.link(this.A.phys.pos, this.B.phys.pos);
		var d = delta.mag();
		var mtd = delta.clone().mul((this.dist - d )/ d);
		
		// impact speed
		var v = this.A.phys.velocity.clone().sub(this.B.phys.velocity);
		var vn = v.dot(mtd.clone().normalize());
		if (vn > 0.0) return;
		
		// Collision impulse
		var ConstantRestitution = 0.5; 
		var i = (-(1.0 + ConstantRestitution) * vn) / (this.A.phys.invmass + this.B.phys.invmass);
		var impulse = mtd.mul(i);
		
		this.A.phys.velocity.add(impulse.clone().mul(this.A.phys.invmass));
		this.B.phys.velocity.add(impulse.clone().mul(this.B.phys.invmass));
		/*
		//Log.w("res cc");
		var wn = this.wallNormal.inv();
		var l = this.A.phys.velocity.mag();
		var pU = this.A.phys.velocity.proj(wn).inv();
		var pV = this.A.phys.velocity.proj(wn.normal()).inv();
		var f = pU.clone().add(pV).normalize().mul(l);
		this.A.phys.velocity = f;*/
	},
});

// Source: src/GeBounding.js

var GeBounding = Class.create({
	initialize: function(parent) {
		this.type = 'base';
		this.parent = parent;
	},
});



// Source: src/GeBoundingShadow.js

var GeBound_Shadow = Class.create(GeBounding, {
	initialize: function($super, parent) {
		$super(parent);
		this.type = 'shadow';
		this.shadow = document.createElement('canvas');		
	},
	collide: function(map) {//
			//this.shadow = document.createElement('canvas');	
			var ctx = this.shadow.getContext('2d');		
			this.shadow.width = this.parent.gx.width;
			this.shadow.height = this.parent.gx.height;
			var dwi = this.shadow.width / 2;
			var dhe = this.shadow.height / 2;
			var cposx =  -this.parent.phys.pos.x + dwi;
			var cposy =  -this.parent.phys.pos.y + dhe
			
			// Saving state 
			ctx.save();
			ctx.save();
			ctx.translate( cposx, cposy);
			this.parent.gx.draw(ctx);
			ctx.restore();
			//ctx.translate(0, 0);
			ctx.globalCompositeOperation = 'source-in';
			var posX = this.parent.phys.pos.x - dwi;
			if (posX < 0) {
				posX = 0;
			} else if (posX > this.shadow.width) {
				posX = this.shadow.width;
			}			
			var posY = this.parent.phys.pos.y - dhe;
			if (posY < 0) {
				posY = 0;
			} else if (posY > this.shadow.height) {
				posY = this.shadow.height;
			}
			if (posX > 640 - this.shadow.width) {
				posX = 640 - this.shadow.width;
			}
			if (posY > 480 - this.shadow.height) {
				posY = 480 - this.shadow.height;
			}
			ctx.drawImage(Core.Images.get("lvl-test-shadow.png").get(), 
				posX, posY,
				this.shadow.width, this.shadow.height,
				0, 0, this.shadow.width, this.shadow.height);
			ctx.restore();
			

			
			// Watching for colision
			//var buffer = ctx2.getImageData(0,0, this.shadow.width, this.shadow.height);
			//var buffer = ctx2.data;//getImageData(1,1,1,1);
			//var l = buffer.data.length / 4;
			//for(var row = 0; row < this.shadow.height; row++) {
	    	/*var avgCol = 0;
			var avgRow = 0;
			var l = 1;
			for (var i = 0; i < l; i++) {
	    	  //var r = frame.data[i * 4 + 0];
	    	  //var g = frame.data[i * 4 + 1];
	    	  //var b = frame.data[i * 4 + 2];
			  //var a = buffer.data[i * 4 + 3];
			  var a = 0;
	    	  if (a == 1) {
				avgCol = (avgCol + col) / 2;
				avgRow = (avgRow + row) / 2;
			  }
				//if (g > 100 && r > 100 && b < 43)
	    	    //	frame.data[i * 4 + 3] = 0;
				//}
			}
			Log.w("avg: " + avgRow + ", " + avgCol);*/
			
			
			var c2 = document.createElement('canvas');
			ctx2 = c2.getContext('2d');
			c2.height = this.shadow.height;
			c2.width = this.shadow.width;
			ctx2.fillStyle = "rgba(250,250,250, 0)";
			ctx2.fillRect (0, 0, 32, 32);
			ctx2.drawImage(this.shadow, 0, 0);
			
			var cs = document.getElementById('GameScreen2').getContext('2d')
			cs.fillStyle = "rgba(250,50,250, 1)";
			cs.fillRect (0, 0, 32, 32);
			cs.drawImage(c2, 0, 0);
			
	},
});


// Source: src/GeBoundingCircle.js

var GeBoundingCircle = Class.create(GeBounding, {
	initialize: function($super, parent, radius) {
		$super(parent);
		this.type = 'circle';
		this.radius = radius;
	},
	
	check_cc: function(node) {
		//-> Don't want to collide against ourself
		if (this.parent == node) {
			return null;
		}
		//alert("blop");
		var tradius = this.radius + node.bound.circle.radius;
		var dist = this.parent.phys.pos.dist(node.phys.pos);
		var delta = dist - tradius;
		if (delta < 1) {
			var c = new GeCollision(parent, 'cc', this.parent, node);
			c.tradius = tradius;
			c.dist = dist;
			c.delta = -delta;
			return c;//Log.w("Collide: dist: " + dist + ", tradius: " + tradius);
		} else {
				return null;
		}
		return null;
	},

	collide: function(node) {	
		var c = null;
		if (node.bound) {
			if (node.bound.circle) {
				//alert("cc");
				if (c = this.check_cc(node)) {
					return c;
				}
			} else if (node.bound.box) {
				/*if (c = this.check_cb(node)) {
					return c;
				}*/
			}
		}
		for (var i = 0; i < node.childs.length; i++) {
			var child = node.childs[i];
				if (c = this.collide(child)) {
					return c;
				} 
		}
		return null;
	}
	
});

// Source: src/GeBoundingBox.js

var GeBoundingBox = Class.create(GeBounding, {
	initialize: function($super, parent, u, v) {
		$super(parent);
		this.type = 'box';
		this.u = u;
		this.v = v
	},
	collide: function(sg) {	
		return null;
	}
	
});

// Source: src/GePhyState.js

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



// Source: src/GeLevel.js

var GeLevel = Class.create(GeObject, {
	initialize: function($super, parent, path) {
		$super(parent);
		this.path = path;
		this.cell_size = 256;
	},
});

// Source: src/GeTree.js

/*# > Object < #*/
var GeBound = Class.create(GeObject, {
    /*# > Method < #*/
    initialize: function($super, parent) {
        $super();
        this.parent = parent;
    },
    add: function(bound) {
        this[bound.type] = bound;
    },
    get: function(type) {
        return this[type];
    }
});

// Source: src/GeTreeNode.js

/*# > Object < #*/var GeTreeNode = Class.create(GeObject, {    /*# > Method < #*/    initialize: function($super, parent) {        $super();        this.set_parent(parent);        this.childs = new Array();        this._init(parent);        Log.w("[" + this.id + "] Creating node tree: " + this.type);    },    /*# > Method < #*/    _init: function(parent) {        this.type = "basic";        this.bPhysUpdate = false;        this.bRedraw = false;    },    /*# > Method < #*/    set_parent: function(parent) {        this.parent = parent;    },    /*# > Method < #*/    set_physUpdate: function(bool) {        this.bPhysUpdate = bool;    },    /*# > Method < #*/    set_redraw: function(bool) {        this.bRedraw = bool;    },    /*# > Method < #*/    hide: function() {        this.set_redraw(false);        this.childs.each(function(item) {            item.hide();        });    },    /*# > Method < #*/    unhide: function() {        this.set_redraw(true);        this.childs.each(function(item) {            item.unhide();        });    },    /*# > Method < #*/    hidden: function() {        return !this.bRedraw;    },    /*# > Method < #*/    freeze: function() {        this.set_physUpdate(false);        this.childs.each(function(item) {            item.freeze();        });    },    /*# > Method < #*/    unfreeze: function() {        this.set_physUpdate(true);        this.childs.each(function(item) {            item.unfreeze();        });    },    /*# > Method < #*/    frozen: function() {        return !this.bPhysUpdate;    },    /*# > Method < #*/    get_parent: function() {        return this.parent;    },    /*# > Method < #*/    get_childs: function() {        return this.childs;    },    /*# > Method < #*/    add_child: function(node) {        this.childs.push(node);        node.parent = this;    },	enable_physics: function() {		if (!this.phys) {			this.phys = new GePhysState(this);		}	},    /*# > Method < #*/    update: function(dt) {		//Log.w("Update " + this.core_id);        if (this.phys && !this.frozen()) {            this.phys.update(dt);            var c = this.collide();            if (c) {  c.correct(); 					  c.response(); }        }		if (this.postupdate) { this.postupdate(dt) };        this.childs.each(function(item) {            if (item.phys && !item.frozen()) {                item.phys.update(dt);                var c = item.collide();                if (c) {  c.correct();						  c.response(); }            }			if (item.postupdate) {				item.postupdate(dt);			}        });		    },	//postupdate: function(dt) {		//; // STUB	//},    /*# > Method < #*/    collide: function() {        if (this.frozen()) {            return null;        }        if (!this.bound) {           // Log.w("No bound for object " + this.id);			return null;        }        if (this.bound.shadow) {            this.bound.shadow.collide(ShoGE.Core.SG);        }        if (this.bound.circle) {            var c = this.bound.circle.collide(ShoGE.Core.SG);			//if (c) Log.w("Collide");			return c;		}		return null;    },    /*# > Method < #*/    draw: function(ctx) {        ctx.save();        if (this.gx && !this.hidden()) {			ctx.save();            this.gx.draw(ctx);			ctx.restore();        }        this.childs.each(function(item) {            if (item.gx && !item.hidden()) {                ctx.save();				item.gx.draw(ctx);				ctx.restore();            }        });        ctx.restore();    }});

// Source: src/GeTreeNode_Map.js

/*
    MAP Node
*/
/*# > Object < #*/
var GeGx_Map = Class.create({
    /*# > Method < #*/
    initialize: function(parent) {
        this.parent = parent;
    },
    /*# > Method < #*/
    draw: function(ctx) {
		//return;
        ctx.drawImage(ShoGE.Core.Images.get("map_green01.png").get(), 0, 0);
    },
});

/*# > Object < #*/
var GeTreeNode_Map = Class.create(GeTreeNode, {
    initialize: function($super, parent) {
        $super();
    },
    /*# > Method < #*/
    _init: function(parent) {
        this.type = "monster";
        this.gx = new GeGx_Map(this);
        this.unhide();
    },
});

// Source: src/GeTreeNode_Monster.js

/*# > Object < #*/
var GeTreeNode_Monster = Class.create(GeTreeNode, {
    initialize: function($super, parent) {
        $super(parent);
    },
    /*# > Method < #*/
    _init: function(parent) {
        this.type = "monster";
        this.unfreeze();
        this.unhide();
		this.enable_physics();
        this.phys.pos.x = Math.random()*1024;
        this.phys.pos.y = Math.random()*768;
        this.phys.velocity.x = Math.random()*10 ;
        this.phys.velocity.y = Math.random()*10;
        this.gx = new GeGx_Monster(this);
        this.bound = new GeBound(this);
        this.bound.add(new GeBoundingCircle(this, this.gx.width/2));
		
		/* DEBUG */
		var drawForce = new GeTreeNode_Vector(this, this.phys.force); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		drawForce.set_color("#AA00AA");
		//this.add_child(drawForce);
		
		drawForce = new GeTreeNode_Vector(this, this.phys.velocity); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		drawForce.set_color("#FF0000");
		this.add_child(drawForce);
		
		drawForce = new GeTreeNode_Vector(this, this.phys.velocity.normal()); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		var that = this
		drawForce.postupdate = function(dt) {
			that.vector = that.phys.velocity.normal();
		}
		drawForce.set_color("#0000AA");
		//drawForce.unfreeze();
		//drawForce.unhide();
		this.add_child(drawForce);
	},
});
/*# > Object < #*/
var GeGx_Monster = Class.create({
    /*# > Method < #*/
    initialize: function(parent) {
        this.parent = parent;
        this.width = 32;
        this.height = 32;
    },

    /*# > Method < #*/
    draw: function(ctx) {
        var phys = this.parent.phys;
        ctx.translate(phys.pos.x - 16, phys.pos.y - 16);
        ctx.drawImage(ShoGE.Core.Images.get("ball-blue-32x32.png").get(), 0, 0);
        ctx.drawImage(ShoGE.Core.Images.get("ball-cover-32x32.png").get(), 0, 0);
      //  ctx.drawImage(Core.Images.get("ball-infected-32x32.png").get(), 0, 0);
    },

});

// Source: src/GeTreeNode_Vector.js

var GeGx_Vector = Class.create({
    /*# > Method < #*/
    initialize: function(parent) {
        this.parent = parent;
        this.width = 32;
        this.height = 32;
		this.color = "#FF0000";
    },

    /*# > Method < #*/
    draw: function(ctx) {
        var phys = this.parent.phys;
		var B = phys.pos.clone().add(this.parent.vector.clone().mul(4));
		ctx.save();
		//ctx.fillStyle = this.color;
		//ctx.beginPath();
		ctx.moveTo(phys.pos.x, phys.pos.y);
		ctx.lineTo(B.x, B.y);
		//ctx.closePath();
		ctx.strokeStyle = this.color;
		ctx.stroke();
		//ctx.closePath();
		//ctx.fill();
		ctx.restore();
		//Log.w("Vector pos x: " + phys.pos.x + ", y: " + phys.pos.y + " To pos x: " + B.x + ", y: " + B.y);
    },

});
/*# > Object < #*/
var GeTreeNode_Vector = Class.create(GeTreeNode, {
    initialize: function($super, parent, vector) {
        $super(parent);
		//this.parent  = parent;
		this.vector = vector;
    },
	set_color: function(color) {
		this.gx.color = color;
	},
    /*# > Method < #*/
    _init: function(parent) {
		this.type = "vector";
        this.unfreeze();
        this.unhide();
		this.enable_physics();
        this.gx = new GeGx_Vector(this);
    },
});

// Source: src/GeTreeNode_Grid.js

var GeTreeNode_Grid = Class.create(GeTreeNode, {
	initialize: function($super, parent) {
		$super(parent);
	},
	_init: function(parent) {
		this.type = "grid";
		this.grid = new Array();
	},
	get: function(x, y) {
		if (!this.grid[x]) this.grid[x] = new Array();
		if (!this.grid[x][y]) {
			this.load(x,y);
		}
		return this.grid[x][y];
	},
	set: function(x, y, cell) {
		cell.x = x;
		cell.y = y;
		if (!this.grid[x]) {
			this.grid[x] = new Array();
		}
		this.grid[x][y] = cell;
		this.add_child(cell);
	},
	load: function(x, y) {
		var cell = new GeTreeNode_Cell(this, x, y);
		this.add_child(cell);
	},
});

// Source: src/GeTreeNode_Cell.js

var GeGx_Cell = Class.create({
    /*# > Method < #*/
    initialize: function(parent) {
        this.parent = parent;
		//this.tiles = new Array();
    },

    /*# > Method < #*/
    draw: function(ctx) {
		if (!this.parent.tiles) {
			return;
		}
		if (!this.cache) {
			//alert("building cache");
			this.cache = document.createElement('canvas');
			this.cache.width = 512;
			this.cache.height = 512;
			var lctx = this.cache.getContext('2d');
			lctx.save();
			
			for(var r = 0; r < 32; r ++) {
				for(var c = 0; c < 32; c ++) {
					lctx.save();
					lctx.translate(c*16, r*16);
					if (this.parent.tiles[r*32+c]) {
						lctx.drawImage(ShoGE.Core.Images.get("tile-on.png").get(), 0,0);
					} else {
						lctx.drawImage(ShoGE.Core.Images.get("tile-off.png").get(), 0,0);
					}
					lctx.restore();
				}	
			}
	
		}
				
		//ctx.translate(128, 128);
		ctx.drawImage(this.cache, 0,0);
	},

});

var GeTreeNode_Cell = Class.create(GeTreeNode, {

	initialize: function($super, parent, x, y) {
		$super(parent);
		this.x = x;
		this.y = y;
		this.is_loaded = false;
		this.load();
	},

	_init: function(parent) {
		this.type = "cell";
		this.gx = new GeGx_Cell(this);
		this.unhide();
	},

	load_shadow_info: function() {
		this.tiles = new Array();
		var canvas = document.createElement('canvas');
		canvas.width = ShoGE.Core.Level.cell_size;
		canvas.height = ShoGE.Core.Level.cell_size;
		var c = canvas.getContext('2d');
		c.width = this.img_shadow.width;
		c.height = this.img_shadow.height;
		c.drawImage(this.img_shadow, 0, 0);
		var id = c.getImageData(0,0,ShoGE.Core.Level.cell_size,ShoGE.Core.Level.cell_size);
		//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
 		var l = id.data.length / 4;
		var msg = "";
		this.tiles = new Array();
		var c = 0;
		
		for(var row = 0; row < 32; row++) {
	    	for (var i = 0; i < 32; i++) {
			  var step = (row *(id.width*4)) + (i*4) ;
	    	  var r = id.data[step];
	    	  var g = id.data[step + 1];
	    	  var b = id.data[step + 2];
			  var a = id.data[step + 3];
			  if (a) {
					this.tiles[row*32+i] = 1;
				}else {
					this.tiles[row*32+i] = 0;
				}			  
			}
		}
	},
	
	loaded: function(type) {
		this.is_loaded = true;
		if (type == 'shadow') {
			this.load_shadow_info();
		}
	},
	
	get_level_path: function() {
		return "level/" + ShoGE.Core.Level.path + "/";
	},
	
	get_cell_path: function(x, y) {
		return "cells/" + x + "-" + y + "-";
	},
	
	load: function() {
		this.is_loaded = false;
		this.img_shadow = new Image();
		var that = this;
		this.img_shadow.onload = function() { that.loaded('shadow'); }	
		this.img_shadow.src = this.get_level_path() + this.get_cell_path(this.x, this.y) + "shadow.png";
	}
});

// Source: src/GeTreeNode_Collection.js

var GeTreeNode_Collection = Class.create(GeTreeNode, {
	initialize: function($super, parent, name) {
		$super(parent);
		this.name;
	},
	_init: function(parent) {
        this.type = "collection";
	},
	update: function($super, dt) {
	//alert("update");
		this.childs.each(function(item) {
			item.update(dt);
		});
	},
	draw: function($super, ctx) {
		this.childs.each(function(item) {
			item.draw(ctx);
		});
	},
	collide: function($super) {
		this.childs.each(function(item) {
			return item.collide();
		});
	}
});

// Source: src/GeTreeNode_Block.js

var GeTreeNode_Block = Class.create(GeTreeNode, {
	initialize: function($super, parent, pos, u, v) {
		$super(parent);
		this._init(pos, u, v);
	},
	_init: function(pos, u, v) {
        this.type = "block";
		this.phys = new GePhysState(this);
		this.phys.pos = pos;
		this.bound = new GeBound(this);
        this.bound.add(new GeBoundingBox(this, u, v));
	},
	
});

// Source: src/GeTreeNode_Coordinate.js

/*# > Object < #*/
var GeTreeNode_Coordinate = Class.create(GeTreeNode, {
    initialize: function($super, parent, vector) {
        $super(parent);
		//this.parent  = parent;
		this.vector = vector;
    },
    /*# > Method < #*/
    _init: function(parent) {
		this.type = "coordinate";
        this.unfreeze();
        this.unhide();
		this.enable_physics();
		var u = new GeTreeNode_Vector(this, new Vector2D(1,0));
		u.set_color("#FF0000");
		var v = new GeTreeNode_Vector(this, new Vector2D(0,1));
		v.set_color("#0000FF");
		this.add_child(u);
		this.add_child(v);
	},
});

// Source: src/GeCamera.js

var GeCamera = Class.create(GeTreeNode, {
	initialize: function($super, parent, pos) {
		$super(parent);
		if (pos) {
			this.pos = pos;
		} else {
			this.pos = new GePosition();
		}
	},
	_init: function(parent) {
		this.type = "camera";
	},
	track: function(node) {
		this.tracked = node;
	
	},
	untrack: function() {
		this.tracked = null;
	},
	update: function(dt) {
		this.trac
	}
});


// Source: src/GeRenderer.js

var GeRenderer = Class.create(GeObject, {
	initialize: function($super, parent, screen, camera, width, height) {
		$super();
		this.camera = camera;
		this.parent = parent;
		this.screen = screen;
		this.width = width;
		this.height = height;
		this.FPS = 0;
		var date = new Date();
		this.lastFrameTime = date.getTime();
		this.frameCount = 0;
	},
	draw: function() {
		this.screen.init_buffer();
		var ctx = this.screen.buffer.getContext('2d');	
		ctx.save();
		if (this.camera) {
			ctx.translate(this.screen.width / 2, this.screen.height / 2);
			ctx.translate(-this.camera.pos.x, -this.camera.pos.y);
		}
		this.parent.SG.draw(ctx);
		ctx.restore();
		var date = new Date();
		var ctime = date.getTime();
		var d = ctime - this.lastFrameTime;			
		if (d >= 1000.0) {
			this.FPS = (this.frameCount + this.FPS) / 2.0;
			this.lastFrameTime = ctime + (d - 1000);
			this.frameCount = 0;
			
		}
		this.frameCount++;	
		this.screen.swap();	
	}
});

// Source: src/GeCore.js

var GeCore = Class.create({
	
	/* -[meth]- */
	initialize: function() {
		var date = new Date();
		this.bgcolor = "rgb(0,0,0)";
		this.step = 0;
		this.timer = null;
		this.t = 0;
		this.startTime = null;
		this.currentTime = date.getTime();
		this.dt = 12;
		this.accumulator = 0;
		this.lastDraw = this.currentTime;
	},
	
	/* -[meth]- */
	init: function(width, height) {
		var date = new Date();
		
		this.init_global_variables();
		
		this.Screen = new GeScreen(this,"GameScreen", width,height);
		this.Screen.clear(this.bgcolor);
		this.Screen2 = new GeScreen(this,"GameScreen3", width/2,height/2);
		this.Screen2.clear(this.bgcolor);
		this.Mouse = new GeMouse();
		this.Images = new GeMediaPool();
		this.SG = new GeTreeNode_Collection(null, "World");
		this.SgStatic = new GeTreeNode_Collection(this.SG, "static");
		this.SG.add_child(this.SgStatic);
		this.SgStatic.add_child(new GeTreeNode_Coordinate(this.SgStatic));
		this.SgDynamic = new GeTreeNode_Collection(this.SG, "dynamic");
		this.SG.add_child(this.SgDynamic);
		this.load_ressources();
		this.Renderer = new GeRenderer(this, this.Screen, null, width, height);
		this.Renderer2 = new GeRenderer(this, this.Screen2, this.camera, width/2, height/2);
		this.Level = new GeLevel(this, 'darks');
		this.Grid = new GeTreeNode_Grid(this);
		this.SG.add_child(this.Grid);
		//this.Grid.set(1,1, new GeTreeNode_Cell(parent));
		this.Grid.get(0,0);
		this.start();
	},
	
	init_global_variables: function() {
		Log = new GeLog("GameLog");
	},
	/* -[meth]- */
	load_ressources: function() {
		this.Images.add("alpha-1x1.png");
		this.Images.add("ball-blue-32x32.png");
		this.Images.add("ball-cover-32x32.png");
		this.Images.add("ball-infected-32x32.png");
		this.Images.add("lvl-test-shadow.png");
		this.Images.add("map_green01.png");
		this.Images.add("tile-on.png");
		this.Images.add("tile-off.png");
		
		var m = null;
		for(var i = 0; i < 20; i++) {
			m = new GeTreeNode_Monster(null);
			this.SgDynamic.add_child(m);
		}
		this.camera = new GeCamera(parent, m.phys.pos);
		//this.camera.pos.orientation = m.phys.force; 
		this.SgStatic.add_child(new GeTreeNode_Block(
			new Vector2D(264,50),
			new Vector2D(128,0),
			new Vector2D(0,50)
		));
		this.SgStatic.add_child(this.camera);
		var map = new GeTreeNode_Map(null);
		//this.SgStatic.add_child(map);
		
	},

	/* -[meth]- */
	start: function() {
		var that = this;
		this.startTime = Date.now();
		this.lastFrameTime = Date.now();
		
		Log.w("--- Starting Game Engine");
		// Render HTML Elemet (Updating html element is an heavy process)
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.html_update();
		}, 0.1);
		// Our Game engine loop
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, 0.000001);
	},
	html_update: function(){
		$('GameFPS').innerHTML = Math.round(this.Renderer.FPS);
		$('GameFPS3').innerHTML = Math.round(this.Renderer2.FPS);
	},
	/* -[meth]- */
	loop: function() {	
		var newTime = Date.now();
		var frameTime = newTime - this.currentTime;
		
		this.currentTime = newTime;
		this.accumulator  += frameTime;
		while(this.accumulator >= this.dt) {
			this.accumulator -= this.dt;
			this.t += this.dt;
			this.SG.update(this.dt);
		}
		this.Renderer.draw();
		this.Renderer2.draw();
	},
});	

// Source: src/GeInitGlobals.js

/*
	Main
*/
ShoGE.Core = new GeCore();
