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