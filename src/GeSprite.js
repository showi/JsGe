var GeSpriteAnimation = Class.create({
	initialize: function(parent, name, row, frames) {
		this.parent = parent;
		this.name = name;
		this.row = row;
		this.frames = frames;
	},

});
var GeSprite = Class.create(  {
	initialize: function(parent, name, x, y) {
		this.parent = parent;
		this.name = name;
		this.offset = new Vector2D(x, y);
		this.animations = new Hash();
	},

	set_animation: function(name, row, col) {
		this.animations.set(name,
			new GeSpriteAnimation(this, name, row, col, frames)
		);
	}
});

var GeSpriteSet = Class.create({
	
	initialize: function(file, width, height) {
		this.set_file(file);
		this.anims = new Hash();
		this.set_width(width);
		this.set_height(height);
		this.set_interval(1);
	},
	preload_ressources: function(pool) {
		pool.add(this.file);
	},
	/* Getter/Setter */
	set_file: function(f) {
		this.file = f;
	},

	get_file: function() {
		return this.file;
	},	
	
	set_width: function(l) {
		this.width = l;
	},

	get_width: function() {
		return this.width;
	},	
	
	set_height: function(l) {
		this.height = l;
	},
	
	get_height: function() {
		return this.height;
	},	
	
	set_interval: function(l) {
		this.interval = l;
	},
	
	get_interval: function() {
		return this.interval;
	},			
	/* Add animation */
	set_sprite: function (name, posx, posy) {
		this.anims.set(name,
				new GeSprite(this, name, posx, posy)
		);
		return this.anims.get(name);
	},
	
});