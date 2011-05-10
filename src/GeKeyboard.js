var GeKeys = new Object();
GeKeys.LEFT     = 37,
GeKeys.UP        = 38,
GeKeys.RIGHT  = 39,
GeKeys.DOWN  = 40;
GeKeys.ESC     = 27;
GeKeys.ENTER  = 13,
GeKeys.SPACE = 32;

var GeKeyboard_Key = Class.create(GeObject, {
	initialize: function($super, parent, keycode) {
		$super(parent);
		this.keyCode = keycode;
		this.down = 0;
		this.up = false;
	},
	keyUp: function() {
		//ShoGE.w("Keyup: " + this.keyCode);	
		this.up = true;
	},
	keyDown: function() {
		//ShoGE.w("Keydown: " + this.keyCode);
		this.down++;
	},
	is_active: function() {
		if (this.down && !this.up) {
			return true;
		} 
		return false;
	},
	is_complete: function() {
		if (this.down && this.up) {
			return true;
		}
	},
	reset: function() {
		this.down = 0;
		this.up = false;
	},
	get_string: function() {
		return "Key["+ this.keyCode  + "] Down: " + this.down + ", Up: " + this.up;
	},
	is: function(keyMap) {
		if (this.keyCode == keyMap) {
			return true;
		}
		return false;
	}
});

var GeKeyboard = Class.create(GeObject, {
	initialize: function($super, parent, id) {
		$super(parent);
		this.elmID = id;
		this.keys = new Hash();
		var k = GeKeys;
		this.keyFilter = new Array(k.LEFT, k.UP, k.RIGHT, k.DOWN, k.ESC, k.ENTER, k.SPACE);
		this._init();
	},
	_init: function() {
		var i, l;
		/* Init keys */
		for (i = 0, l = this.keyFilter.length; i < l; i++) {
			this.newKeyCode(this.keyFilter[i]);
		}
		var that = this;
		/* Watch keydown event */
		document.observe("keydown", function(e) {
			var key = that.keys.get(e.keyCode);
			if (!key) return;
			e.stop();
			key.keyDown();
		});
		/* Watch keyup event */
		document.observe("keyup", function(e) {
			var key = that.keys.get(e.keyCode);
			if (!key) return;
			e.stop();
			key.keyUp();
		});
	},
	newKeyCode: function(num) {
		if (!this.keys.get(num)) {
			ShoGE.w("Adding key: " + num);
			this.keys.set(num,
				new GeKeyboard_Key(this, num)
			);
		}
	},
	scan: function(func) {
		for (i = 0, l = this.keyFilter.length; i < l; i++) {
			func(this.keys.get(this.keyFilter[i]));
		}
	},
	reset: function() {
		for (i = 0, l = this.keyFilter.length; i < l; i++) {
			this.keys.get(this.keyFilter[i]).reset();
		}
	}
	
});