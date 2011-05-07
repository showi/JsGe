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