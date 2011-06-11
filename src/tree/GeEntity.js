var GeEntity = Class.create(GeNode, {

	initialize: function($super, parent) 
	{
		$super(parent);
		this.setType("#ENTITY#", "#ENTITY#");
		this.Position = new GeVector3D(0,0,0);
		this.u = new GeVector3D(1,0,0);
		this.v = new GeVector3D(0,1,0);
		this.setNeedRedraw(true);
	},
	
	setNeedRedraw: function(b) 
	{
		this.bNeedRedraw = b;
	},
	
	needRedraw: function() 
	{
		return this.bNeedRedraw;
	},
	
	enable: function($super, c, object) {
		switch(c) {
			case 'physic':
				//ShoGE.w("Enable physic");
				this.Physic = new GePhysic(this);
			break;
			case 'ai':
				//ShoGE.w("Enable physic");
				this.AI = object;
			break;
			case 'canvas':
				//ShoGE.w("Enable canvas");
				this.canvas = object;
			break;
			default:
				$super(c, object);
			
		}
	},
	
	setU: function(x, y, z) 
	{
		this.u.set(x,y,z);
	},
	
	setV: function(x, y, z) 
	{
		this.v.set(x,y,z);
	},
	
	hookPreUpdate: function(that) {
		ShoGE.w("PreUpdate");
	},
	
	update: function(dt) 
	{
		this.traverseDown(function(that) {
			//that.hookPreUpdate(that);
			if (that.Physic) {
				that.Physic.update(dt);
			}
			if (that.AI) {
	//ShoGE.w("Update");
		
	//that.AI.update(dt);
			}
			//that.hookPostUpdate(that);
		});
	},
	
	draw: function(renderer) 
	{
		renderer.save()
		this.traverseDown(function(that) {
			if (that.AI) {
				that.AI.update(1);
			}
			if (that.Position) {
				
				//renderer.translate(that.Position.getX(), that.Position.getY());
			}
			if (that.canvas) {
				that.canvas.draw(renderer);
			}
		});
		renderer.restore();
	},
	
	preload_ressources: function() 
	{
		; // Stub
	},
	
	post_rendering: function() { ; },
	
	prettyPrint: function($super) {
		var msg = $super();
		msg+= "Position: " + this.Position.prettyPrint();
		return msg;
	}
});
