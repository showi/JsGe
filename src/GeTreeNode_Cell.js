var GeTreeNode_Cell = Class.create(GeTreeNode, {

	initialize: function($super, parent, x, y) {
		$super(parent);
		this.x = x;
		this.y = y;
		//alert(this.x + ", " + this.y);
		this.is_loaded = false;
		this.load();
	},

	_init: function(parent) {
		this.type = "cell";
		this.gx = new GeGx_Cell(this);
		this.unhide();
	},

	load_shadow_info: function() {
		//this.tiles = new Array();
		var canvas = document.createElement('canvas');
		canvas.width = ShoGE.Core.Level.cell_size;
		canvas.height = ShoGE.Core.Level.cell_size;
		var c = canvas.getContext('2d');
		c.width = this.img_shadow.width;
		c.height = this.img_shadow.height;
		c.drawImage(this.img_shadow, 0, 0);
		var id = c.getImageData(0,0,ShoGE.Core.Level.cell_size,ShoGE.Core.Level.cell_size);
		//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
 		var l = id.data.length / 4;
		var msg = "";
		this.tiles = new Array();
		var c = 0;
		
		for(var row = 0; row < 32; row++) {
	    	for (var i = 0; i < 32; i++) {
			  var step = (row *(id.width*4)) + (i*4) ;
	    	  var r = id.data[step];
	    	  var g = id.data[step + 1];
	    	  var b = id.data[step + 2];
			  var a = id.data[step + 3];
			  if (a) {
					this.tiles[row*32+i] = 1;
				}else {
					this.tiles[row*32+i] = 0;
				}			  
			}
		}
	},
	
	loaded: function(type) {
		this.is_loaded = true;
		if (type == 'shadow') {
			this.load_shadow_info();
		}
	},
	
	get_level_path: function() {
		return "level/" + ShoGE.Core.Level.path + "/";
	},
	
	get_cell_path: function(x, y) {
		return "cells/" + x + "-" + y + "-";
	},
	
	load: function() {
		this.is_loaded = false;
		this.img_shadow = new Image();
		var that = this;
		var src = this.get_level_path() + this.get_cell_path(this.x, this.y) + "shadow.png";
		ShoGE.Core.Images.add("../../" + src);
		this.img_shadow.onload = function() { that.loaded('shadow'); }	
		this.img_shadow.src = src;
	},
	
	preload_ressources: function($super) {
		ShoGE.Core.Images.add("tile-on.png");
		ShoGE.Core.Images.add("tile-off.png");
		$super();
	},
});

var GeGx_Cell = Class.create({

    initialize: function(parent) {
        this.parent = parent;
		//this.tiles = new Array();
    },

    draw: function(ctx) {
		if (!this.parent.tiles) {
			return;
		}
		if (!this.cache) {
			//alert("building cache");
			this.cache = document.createElement('canvas');
			this.cache.width = 512;
			this.cache.height = 512;
			var lctx = this.cache.getContext('2d');
			lctx.save();
			
			for(var r = 0; r < 32; r ++) {
				for(var c = 0; c < 32; c ++) {
					lctx.save();
					lctx.translate(c*16, r*16);
					if (this.parent.tiles[r*32+c]) {
						lctx.drawImage(ShoGE.Core.Images.get("tile-on.png").get(), 0,0);
					} else {
						lctx.drawImage(ShoGE.Core.Images.get("tile-off.png").get(), 0,0);
					}
					lctx.restore();
				}	
			}
	
		}
		
		ctx.translate(this.parent.x * 512, this.parent.y * 512);
		ctx.drawImage(this.cache, 0,0);
		if (!ShoGE.Core.Images.get("tile-on.png").loaded && !ShoGE.Core.Images.get("tile-on.png").loaded) {
			this.cache = null;
		}
	},
});
