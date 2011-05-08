var GeLevel = Class.create(GeObject, {
	initialize: function($super, parent, path) {
		$super(parent);
		this.path = path;
		this.cell_size = 256;
		this.loaded = false;
	},
	
	load: function(level) {
		ShoGE.w("Loading level info with AJAX");
		var that = this;
		new Ajax.Request('level/' + level + "/levelInfo.json",
		{
			method:'get',
			onSuccess: function(transport){
				//alert(json ? Object.inspect(json) : "no JSON object");
				var data = transport.responseText; // || "no response text";
				that.data = data.evalJSON(true);
				that.preload_ressources();
			},
			onFailure: function(){ ShoGE.w("Cannot load level info"); }
		});
	},	
	preload_ressources: function() {
		if (!this.data) {throw("Cannot preload leve ressources without data");}
		ShoGE.w("Loading ressources for level " + this.data.name);
		this.loaded = true;
	}
});
