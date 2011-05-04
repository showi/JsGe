var GeGenID = Class.create({
	initialize: function() {
		this.id = 0;
	},
	get: function() {
		return this.id++;
	}
});
var GenID = new GeGenID();

var GeTreeNode = Class.create({
	initialize: function(parent) {
		this.id = GenID.get();
		this.set_parent(parent);
		this.childs = new Array();
		this.bPhysUpdate = true;
		this._init();
		Log.w("[" + this.id + "] Creating node tree: " + this.type);
	},
	_init: function(parent) {
		this.type = "basic"; 		
	},
	set_parent: function(parent) {
		this.parent = parent;
	},
	get_parent: function() {
		return this.parent;
	},
	get_childs: function() {
		return this.childs;
	},
	add_child: function(node) {
		this.childs.push(node);
		node.parent = this;
	},
	update: function(dt) {
		if (this.phys) {
			this.phys.update(dt);
			this.collide();
		}
		this.childs.each(function(item) {
			if (item.phys) {
				item.phys.update(dt);
				item.collide();
			}
		});
	},
	collide: function() {
		if (!this.bound) {
			Log.w("No bound for object " + this.id);
		}
		if (this.bound.shadow) {
			//Log.w("Bounding Shadow for object " + this.id);
			this.bound.shadow.collide();
			
		}
	},
	draw: function(ctx) {
		ctx.save();
		if (this.gx) {
			this.gx.draw(ctx);
		}
		this.childs.each(function(item) {
			if (item.gx) {
				item.gx.draw(ctx);
			}
		});
		ctx.restore();
	}
	
});
var GeGx_Monster = Class.create({
	initialize: function(parent) {
		this.parent = parent;
		this.width = 32;
		this.height = 32;
	},
	draw: function(ctx) {
		var phys = this.parent.phys;
		ctx.save();
		ctx.translate(phys.pos.x - 16, phys.pos.y - 16);
		ctx.drawImage(Core.Images.get("ball-blue-32x32.png").get(), 0, 0);
		ctx.drawImage(Core.Images.get("ball-cover-32x32.png").get(), 0, 0);
		//ctx.drawImage(Core.Images.get("ball-infected-32x32.png").get(), 0, 0);
		ctx.restore();
	},
});
var GeBound = Class.create({
			initialize: function(parent) {
				this.parent = parent;
			},
			add: function(bound) {
				this[bound.type] = bound;
			},
			get: function(type) {
				return this[type];
			}
		});
		
var GeTreeNode_Monster = Class.create(GeTreeNode, {
	_init: function(parent) {
		this.type = "monster";
		this.phys = new GePhysState(this);
		this.phys.pos.x = Math.random()*640;
		this.phys.pos.y = Math.random()*480;
		this.phys.force.x = Math.random() / 2;
		this.phys.force.y = Math.random() / 2;
		this.gx = new GeGx_Monster(this);
		this.bound = new GeBound(this);
		//this.bound.add(new GeBound_Shadow(this));
	},
});

var GeGx_Map = Class.create({
	initialize: function(parent) {
		this.parent = parent;
	},
	draw: function(ctx) {
		var phys = this.parent.phys;
		ctx.save();
		//ctx.translate(0, 0);
		ctx.drawImage(Core.Images.get("lvl-test-shadow.png").get(), 0, 0);
		ctx.restore();
	},
});
var GeTreeNode_Map = Class.create(GeTreeNode, {
	_init: function(parent) {
		this.type = "monster";
		//this.phys = new GePhysState(this);
		//this.phys.pos.x = Math.random()*640;
		//this.phys.pos.y = Math.random()*480;
		//this.phys.force.x = Math.random()*0.1;
		//this.phys.velocity.y = Math.random()*0.1;
		this.gx = new GeGx_Map(this);
	},
});