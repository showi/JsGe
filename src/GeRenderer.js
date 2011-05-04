var GeRenderer = Class.create({
	initialize: function(parent, id, width, height) {
		this.parent = parent;
		this.objects = new Array();
	},
	add: function(obj) {
		this.objects.push(obj);
	},
	update: function(dt) {
		var that = this;
		this.objects.each(function(item){
			item.update(dt);
			for (i = 0; i < that.objects.length; i++) {
				item.bounding.circle.collide(that.objects[i]);
			}
		});
	},
	draw: function() {
		this.parent.Screen.init_buffer();
		var ctx = this.parent.Screen.buffer.getContext('2d');
		this.objects.each(function(item){
			item.draw(ctx);
		});
		this.parent.Screen.swap();
	}
});