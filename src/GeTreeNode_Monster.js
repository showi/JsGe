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
        this.phys.pos.x = Math.round(Math.random()*512);
        this.phys.pos.y = Math.round(Math.random()*512);
		var minus = 1;
		if (Math.random() > 0.5) {
			minus = -1
		}
        this.phys.velocity.x = Math.random() * minus *10 ;
		minus = 1;
		if (Math.random() > 0.5) {
			minus = -1
		}
        this.phys.velocity.y = Math.random()* minus * 10;
		
        this.gx = new GeGx_Monster(this);
        this.bound = new GeBound(this);
        this.bound.add(new GeBoundingCircle(this, this.gx.width/2));
		this.bound.grid = 1;
		
		/* DEBUG */
		var drawForce = new GeTreeNode_Vector(this, this.phys.force); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		drawForce.set_color("#AA00AA");
		//this.add_child(drawForce);
		
		drawForce = new GeTreeNode_Vector(this, this.phys.velocity); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		drawForce.set_color("#FF0000");
		//this.add_child(drawForce);
		
		drawForce = new GeTreeNode_Vector(this, this.phys.velocity.normal()); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		var that = this
		drawForce.postupdate = function(dt) {
			that.vector = that.phys.velocity.normal();
		}
		//drawForce.set_color("#0000AA");
		//drawForce.unfreeze();
		//drawForce.unhide();
		//this.add_child(drawForce);
	},

	preload_ressources: function($super) {
		ShoGE.w("Loading monster ressources");
		ShoGE.Core.Images.add("ball-blue-32x32.png");
		ShoGE.Core.Images.add("ball-cover-32x32.png");
		ShoGE.Core.Images.add("ball-infected-32x32.png");
		//$super();
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
		var pos = phys.interpolate();
        ctx.translate(pos.x - 16, pos.y - 16);
        ctx.drawImage(ShoGE.Core.Images.get("ball-blue-32x32.png").get(), 0, 0);
        ctx.drawImage(ShoGE.Core.Images.get("ball-cover-32x32.png").get(), 0, 0);
		ctx.drawImage(ShoGE.Core.Images.get("ball-infected-32x32.png").get(), 0, 0);
    },
});
