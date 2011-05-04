/*# > Object < #*/
var GeBound = Class.create({
	/*# > Method < #*/
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
		
/*# > Object < #*/		
var GeTreeNode = Class.create(GeObject, {
	/*# > Method < #*/
	initialize: function($super, parent) {
		$super();
		this.id = GenID.get();
		this.set_parent(parent);
		this.childs = new Array();
		
		this._init();
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
	
	/*# > Method < #*/
	update: function(dt) {
		if (this.phys && !this.frozen()) {
			this.phys.update(dt);
			this.collide();
		}
		this.childs.each(function(item) {
			if (item.phys && !item.frozen()) {
				item.phys.update(dt);
				item.collide();
			}
		});
	},
	
	/*# > Method < #*/
	collide: function() {
		if (!this.bound) {
			Log.w("No bound for object " + this.id);
		}
		if (this.bound.shadow) {
			//Log.w("Bounding Shadow for object " + this.id);
			this.bound.shadow.collide();
			
		}
	},
	
	/*# > Method < #*/
	draw: function(ctx) {
		ctx.save();
		if (this.gx && !this.hidden()) {
			this.gx.draw(ctx);
		}
		this.childs.each(function(item) {
			if (item.gx && !item.hidden()) {
				item.gx.draw(ctx);
			}
		});
		ctx.restore();
	}
	
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
		ctx.save();
		ctx.translate(phys.pos.x - 16, phys.pos.y - 16);
		ctx.drawImage(Core.Images.get("ball-blue-32x32.png").get(), 0, 0);
		ctx.drawImage(Core.Images.get("ball-cover-32x32.png").get(), 0, 0);
		//ctx.drawImage(Core.Images.get("ball-infected-32x32.png").get(), 0, 0);
		ctx.restore();
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
		ctx.save();
		ctx.drawImage(Core.Images.get("lvl-test-shadow.png").get(), 0, 0);
		ctx.restore();
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