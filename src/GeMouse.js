var GeMouse = Class.create({
	initialize: function(id) {
		this.pos = new Vector2D(0 , 0);
		this.elmID = 'GameScreen';
		this._init();
	},
	
	_init: function() {
		var that = this;
		Event.observe(this.elmID, 'mousemove', function(event) {
			that.pos.x =  Event.pointerX(event) - event.element().offsetLeft;
			that.pos.y =  Event.pointerY(event) - event.element().offsetTop;
		});
		Event.observe(this.elmID, 'click', function(event) {
			that.click = new Object();
			that.click.x = Event.pointerX(event) - event.element().offsetLeft;
			that.click.y = Event.pointerY(event) - event.element().offsetTop;
		});
	},
	
	get_click: function() {
		var click = this.click;
		this.click = null;
		return click;
	}
	
});
