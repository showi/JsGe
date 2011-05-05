var GeLog = Class.create(GeObject, {
	initialize: function($super, id) {
		$super();
		this.elm = document.getElementById(id);
		this.count = 0;
		
	},
	w: function(msg) {
		if(!this.elm) {
			return;
		}
		if (this.count > 20) {
			this.count = 1;
			this.elm.innerHTML = "";
		}
		var date = new Date();
		this.elm.innerHTML += "[" + date.getTime() + "] " + msg + "<br>";
		this.count++;
	}
});

var Log;
var log;