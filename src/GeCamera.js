var GeCamera = Class.create(GeEntity, {
	initialize: function($super, parent, target) {
		$super(parent);
		this.track(target);
	},
	
	track: function(node) {
		this.tracked = node;
	},
	
	untrack: function() {
		this.tracked = null;
	},
	
	draw: function(renderer) {
		if (this.tracked) {
			//var ctx = renderer.getContext();
			//ctx.rotate(45);//Math.PI);
			if (this.tracked.parent) {
			var p = this.tracked.parent.Position;
			var minX = (1024 / 2);
			var col = this.tracked.parent.col;
			var row = this.tracked.parent.row;
			var x =  col -row;
			var y =  (col +row) /2;
				//renderer.translate(-p.getX(), -p.getY());
				renderer.translate(-x*32,y*32);
			}
	
		}
	},
});
