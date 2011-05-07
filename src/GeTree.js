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

/*# > Object < #*/
var GeTreeNode = Class.create(GeObject, {
    /*# > Method < #*/
    initialize: function($super, parent) {
        $super();
        this.set_parent(parent);
        this.childs = new Array();
        this._init(parent);
        Log.w("[" + this.id + "] Creating node tree: " + this.type);
    },

    /*# > Method < #*/
    _init: function(parent) {
        this.type = "basic";
        this.bPhysUpdate = false;
        this.bRedraw = false;
    },

    /*# > Method < #*/
    set_parent: function(parent) {
        this.parent = parent;
    },

    /*# > Method < #*/
    set_physUpdate: function(bool) {
        this.bPhysUpdate = bool;
    },

    /*# > Method < #*/
    set_redraw: function(bool) {
        this.bRedraw = bool;
    },

    /*# > Method < #*/
    hide: function() {
        this.set_redraw(false);
        this.childs.each(function(item) {
            item.hide();
        });
    },

    /*# > Method < #*/
    unhide: function() {
        this.set_redraw(true);
        this.childs.each(function(item) {
            item.unhide();
        });
    },

    /*# > Method < #*/
    hidden: function() {
        return !this.bRedraw;
    },

    /*# > Method < #*/
    freeze: function() {
        this.set_physUpdate(false);
        this.childs.each(function(item) {
            item.freeze();
        });
    },

    /*# > Method < #*/
    unfreeze: function() {
        this.set_physUpdate(true);
        this.childs.each(function(item) {
            item.unfreeze();
        });
    },

    /*# > Method < #*/
    frozen: function() {
        return !this.bPhysUpdate;
    },

    /*# > Method < #*/
    get_parent: function() {
        return this.parent;
    },

    /*# > Method < #*/
    get_childs: function() {
        return this.childs;
    },

    /*# > Method < #*/
    add_child: function(node) {
        this.childs.push(node);
        node.parent = this;
    },
	enable_physics: function() {
		if (!this.phys) {
			this.phys = new GePhysState(this);
		}
	},

    /*# > Method < #*/
    update: function(dt) {
		//Log.w("Update " + this.core_id);
        if (this.phys && !this.frozen()) {
            this.phys.update(dt);
            var c = this.collide();
            if (c) {  c.correct(); 
					  c.response(); }
        }
		if (this.postupdate) { this.postupdate(dt) };
        this.childs.each(function(item) {
            if (item.phys && !item.frozen()) {
                item.phys.update(dt);
                var c = item.collide();
                if (c) {  c.correct();
						  c.response(); }
            }
			if (item.postupdate) {
				item.postupdate(dt);
			}
        });
		
    },
	//postupdate: function(dt) {
		//; // STUB
	//},
    /*# > Method < #*/
    collide: function() {
        if (this.frozen()) {
            return null;
        }
        if (!this.bound) {
           // Log.w("No bound for object " + this.id);
			return null;
        }
        if (this.bound.shadow) {
            this.bound.shadow.collide(ShoGE.Core.SG);
        }
        if (this.bound.circle) {
            var c = this.bound.circle.collide(ShoGE.Core.SG);
			//if (c) Log.w("Collide");
			return c;
		}
		return null;
    },

    /*# > Method < #*/
    draw: function(ctx) {
        ctx.save();
        if (this.gx && !this.hidden()) {
			ctx.save();
            this.gx.draw(ctx);
			ctx.restore();
        }
        this.childs.each(function(item) {
            if (item.gx && !item.hidden()) {
                ctx.save();
				item.gx.draw(ctx);
				ctx.restore();
            }
        });
        ctx.restore();
    }

});


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