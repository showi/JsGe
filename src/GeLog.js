var GeLog = Class.create({
	initialize: function(id) {
		this.elm = document.getElementById(id);
		this.count = 0;
		
	},
	w: function(msg) {
		if(!this.elm) {
			return;
		}
		if (this.count > 9) {
			this.count = 1;
			this.elm.innerHTML = "";
		}
		date = new Date();
		this.elm.innerHTML += "[" + date.getTime() + "] " + msg + "<br>";
		this.count++;
	}
});

var Log;
var log;