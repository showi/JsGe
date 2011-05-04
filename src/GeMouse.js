var GeMouse = Class.create({
	initialize: function(id) {
		this.pos = new Vector2D(0 , 0);
		this._init();
	},
	_init: function() {
		var that = this;
		Event.observe('GameScreen', 'click', function(event) {
			var gs = $('GameScreen');
			that.pos.x = Event.pointerX(event);
			that.pos.y = Event.pointerY(event);
			$('clickatX').innerHTML = that.pos.x;
			$('clickatY').innerHTML = that.pos.y;
			Log.w("Clicked at: " +  that.pos.x + ", "  + that.pos.y);
		});
	},
});
