//----- ---[src/GeArray2D.js]--- -----
var GeArray2D = Class.create({
initialize: function(width, height) {
if (!width) { throw("GeArray2D: Cannot calcul array index without array width");}
this.width = width;
this.height = height;
this.data = new Array();
},
get: function(x,y) {
return this.data[x*this.width + this.y];
},
set: function(x,y, data) {
this.data[x*this.width + this.y] = data;
},
});
//----- ---[src/GeLinkedList.js]--- -----
var GeLinkedList_Iterator = Class.create({
initialize: function(ll) {
this.ll = ll;
this.current = ll.head;
},
next: function() {
if (!this.current) return null;
var elm = this.current;
this.current = this.current.next;
return elm;
},
prev: function() {
if (!this.current) return null;
var elm = this.current;
this.current = this.current.prev;
return elm;
},
reset_head: function() {
this.current = this.ll.head;
},
reset_tail: function() {
this.current = this.ll.tail;
}
});
var GeLinkedList_Element = Class.create({
initialize: function(data) {
this.prev = null;
this.next = null;
this.data = data;
},
});
var GeLinkedList = Class.create({
initialize: function() {
this.head = null;
this.tail = null;
},
iterator: function() {
return new GeLinkedList_Iterator(this);
},
add: function(data) {
var elm = new GeLinkedList_Element(data);
if (!this.head && !this.tail) {
this.head = elm;
this.tail = elm;
} else {
this.tail.next = elm;
elm.prev = this.tail;
this.tail = elm;
} 
return elm;
},


remove: function(remElm) {
var it = new GeLinkedList_Iterator(this);
var elm;
while(elm = it.next()) {
if (elm == remElm) {
if (elm == this.head) {
this.head = elm.next;
}
if (elm == this.tail) {
this.tail = elm.prev;
}
if (elm.prev) {
elm.prev.next = elm.next;	
}
if (elm.next) {
elm.next.prev = elm.prev;
}
elm.prev = null;
elm.next = null;
return elm;
return 1;
}
}
return 0;
},
});
//----- ---[src/GeGlobals.js]--- -----
var ShoGE = new Object();
//----- ---[src/GeVar.js]--- -----
var GeVar = Class.create({
initialize: function(value, dl, ul) {
this.ulimit = ul;
this.dlimit = dl;
this.flag = 0;
this.set(value);
},
set_ulimit: function(limit) {
this.ulimit = limit;
this._ulimit(limit);
},
set_dlimit: function(limit) {
this.dlimit = limit;
this._dlimit(limit);
},
set: function(value) {
this.value = value;
if (this.ulimit != null) {
this._ulimit(this.ulimit);	
}
if (this.dlimit != null) {
this._dlimit(this.dlimit);
}
},
get: function() {
return this.value;
},
_ulimit: function (limit) {
if(this.value > limit) {
this.flag = 1;
this.value = limit;
} else {
this.flag = 0;
}
},
_dlimit: function (limit) {
if(this.value < limit) {
this.flag = -1;
this.value = limit;
} else {
this.flag = 0;
}
},
inc: function(inc) {
this.set(this.value + inc);
},
dec: function(dec) {
this.set(this.value - inc);
}
});
//----- ---[src/GeGenID.js]--- -----
var GeGenID = Class.create({
initialize: function() {
this.id = 0;
},
get: function() {
return this.id++;
}
});
ShoGE.GenID = new GeGenID();
//----- ---[src/GeObject.js]--- -----
var GeObject = Class.create({
initialize: function(parent) {
this.core_id = ShoGE.GenID.get();
this.parent = parent;
},
set_parent: function(parent) {
this.parent = parent;
},
get_root: function() {
if (this.parent) {
return this.parent.get_root();
} else {
return this;
}
}
});
//----- ---[src/GeLog.js]--- -----
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
if (this.count >100) {
this.count = 1;
this.elm.innerHTML = "";
}
var date = new Date();
this.elm.innerHTML += "[" + date.getTime() + "] " + msg + "<br>";
this.count++;
}
});
//----- ---[src/GeVector2D.js]--- -----
var Vector2D = Class.create({
initialize: function(x, y) {
this.set(x, y);
return this;
},
is_vector: function(v) {
if (v instanceof Vector2D) {
return true;
}
return false;
},
set: function(x, y) {
this.x = x;
this.y = y;
},
clone: function() {
return new Vector2D(this.x, this.y);
},
equals: function(v) {
if (this.x != v.x || this.y != v.y) {
return false;
}
return true;
},
mag: function() {
return Math.sqrt(this.x * this.x + this.y * this.y);
},
add: function(b) {
this.x += b.x;
this.y += b.y;
return this;
},
sub: function(b) {
this.x -= b.x;
this.y -= b.y;
return this;
},
inv: function() {
this.x = - this.x;
this.y = - this.y;
return this;
},
mul: function(b) {
this.x *= b;
this.y *= b;
return this;
},
dist: function (b) {
var dist = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
return dist;
},
dot: function(b) {
return this.x * b.x + this.y * b.y;
},
angle: function(v) {
return Math.PI/180 * Math.acos(this.dot(v));
},
angled: function(v) {
return Math.acos(this.dot(v));  
},
normalize: function() {
var m = this.mag();
if (m != 0) {
this.x /= m;
this.y /= m;
}
return this;
},
link: function(A, B) {
this.x = B.x - A.x;
this.y = B.y - A.y;
return this;
},
normal: function() {
var v = new Vector2D(0,0);
v.x = - this.y;
v.y =  this.x;
return v;
},
proj: function(b) {
var dp = this.dot(b);
var p = new Vector2D(0,0);
p.x = (dp / (b.x * b.x + b.y * b.y)) * b.x;
p.y = (dp / (b.x * b.x + b.y * b.y)) * b.y;
return p;
},
invX: function() {
this.x = - this.x;
},
invY: function() {
this.y = - this.y;
},
});
//----- ---[src/GeScreen.js]--- -----
var GeScreen = Class.create(GeObject, {
initialize: function(parent, id, width, height) {
this.id = id;
this.parent = parent;
this.width = width;
this.height = height;
this.canvas = document.getElementById(id);
if (!this.canvas.getContext || !this.canvas.getContext('2d')){
alert("HTML 5 canvas may be not supported on your system");
exit(1);
}
this.ctx = this.canvas.getContext('2d');
this.init_buffer(); 
},
get_layer: function(id) {
if (id < 0) {
id = 0;
}
if (id > 10) {
id = 10;
}
if (this.layers[id]) {
return this.layers[id];
}
var c = document.createElement('canvas');
this.layers[id] = c.getContext('2d');
},
init_buffer: function() {
this.layers = new Array();
var b = document.createElement('canvas');
b.width = this.width;
b.height = this.height;
this.buffer = b;
var ctx = b.getContext('2d');
this.clear("rgb(50,50,50");


},
swap: function() {
this.ctx.drawImage(this.buffer, 0, 0);
},
clear: function(color) {
this.ctx.save();
this.ctx.fillStyle = color;
this.ctx.fillRect (0, 0, this.width, this.height);
this.ctx.restore();
}
});
//----- ---[src/GeMouse.js]--- -----
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
});
},
});
//----- ---[src/GeImagePool.js]--- -----
var GeMedia_Image = Class.create(GeObject, {
initialize: function($super, parent, src) {
$super(parent);
if (src) {
this.set(src);
}
},
set: function(src) {
this.img = new Image();
this.img.src = src;
this.loaded = false;
var that = this;
this.img.onload = function() {
that.loaded = true;
ShoGE.w("Image '" + that.img.src + " loaded");
that.parent.total_loaded++;
};
},
get: function() {
return this.img;
},
});
var GeMediaPool = Class.create(GeObject, {
initialize: function($super, id) {
$super(parent);
this.pool = new Array();
this.path = "res/img/";
this.nothing = new GeMedia_Image(this, this.path + "nothing.png");
this.total = 0;
this.total_loaded = 0;
},
add: function(src) {
if (this.pool[src]) {
ShoGE.w("Image '" + src + " already in pool");
return null;
}
ShoGE.w("Image added: " + src);
this.pool[src] = new GeMedia_Image(this, this.path + src);
return this.pool[src];
},
get: function(src) {
if (!this.pool[src]) { throw("GeImagePool: Trying to get invalid image: " + src); }
if (!this.pool[src].loaded) {
return this.nothing;
}
return this.pool[src];
},
is_loading: function() {
return !(this.total - this.total_loaded);
}
});
//----- ---[src/GeWaitLoading.js]--- -----
var GeWaitLoading = Class.create(GeObject, {
initialize: function($super, parent, screen, pool) {
this.set_parent(parent);
this.screen = screen;
this.pool = pool;
},
is_loading: function() {
return this.pool.is_loading();
},
draw: function() {
this.screen.init_buffer();
var ctx = this.screen.buffer.getContext('2d');	
ctx.save();
ctx.fillText("Loading images...", 10, 10);
ctx.restore();
this.screen.swap();
}
});
//----- ---[src/GeCollision.js]--- -----
var GeCollision = Class.create({
initialize: function(parent, type, objA, objB) {
this.parent = parent;
this.type = type;
this.A = objA;
this.B = objB;
this.calcNormal()
},
calcNormal: function() {
if (this.type == 'cc') {
var wallNormal = new Vector2D(0,0).link(this.A.phys.pos, this.B.phys.pos);
this.wallNormal = wallNormal.normalize();
}
},
correct: function() {
if (this.type == 'cc') {
}
},
correct_cc: function() {
var wN = this.wallNormal.clone();
wN.mul(this.delta);
this.A.phys.pos.sub(wN);
},
response: function() {
if (this.type == 'cc') {
this.response_cc();
}
},
response_cc: function() {
this.A.phys.velocity.inv();
this.B.phys.velocity.inv();
return;
var delta = this.A.phys.pos.link(this.A.phys.pos, this.B.phys.pos);
var d = delta.mag();
var mtd = delta.clone().mul((this.dist - d )/ d);
var v = this.A.phys.velocity.clone().sub(this.B.phys.velocity);
var vn = v.dot(mtd.clone().normalize());
if (vn > 0.0) return;
var ConstantRestitution = 0.5; 
var i = (-(1.0 + ConstantRestitution) * vn) / (this.A.phys.invmass + this.B.phys.invmass);
var impulse = mtd.mul(i);


},
});
//----- ---[src/GeBounding.js]--- -----
var GeBounding = Class.create({
initialize: function(parent) {
this.type = 'base';
this.parent = parent;
},
});
//----- ---[src/GeBoundingShadow.js]--- -----
var GeBound_Shadow = Class.create(GeBounding, {
initialize: function($super, parent) {
$super(parent);
this.type = 'shadow';
this.shadow = document.createElement('canvas');		
},
collide: function(map) {
var ctx = this.shadow.getContext('2d');		
this.shadow.width = this.parent.gx.width;
this.shadow.height = this.parent.gx.height;
var dwi = this.shadow.width / 2;
var dhe = this.shadow.height / 2;
var cposx =  -this.parent.phys.pos.x + dwi;
var cposy =  -this.parent.phys.pos.y + dhe
ctx.save();
ctx.save();
ctx.translate( cposx, cposy);
this.parent.gx.draw(ctx);
ctx.restore();
ctx.globalCompositeOperation = 'source-in';
var posX = this.parent.phys.pos.x - dwi;
if (posX < 0) {
posX = 0;
} else if (posX > this.shadow.width) {
posX = this.shadow.width;
}			
var posY = this.parent.phys.pos.y - dhe;
if (posY < 0) {
posY = 0;
} else if (posY > this.shadow.height) {
posY = this.shadow.height;
}
if (posX > 640 - this.shadow.width) {
posX = 640 - this.shadow.width;
}
if (posY > 480 - this.shadow.height) {
posY = 480 - this.shadow.height;
}
ctx.drawImage(Core.Images.get("lvl-test-shadow.png").get(), 
posX, posY,
this.shadow.width, this.shadow.height,
0, 0, this.shadow.width, this.shadow.height);
ctx.restore();
//var buffer = ctx2.data;


var c2 = document.createElement('canvas');
ctx2 = c2.getContext('2d');
c2.height = this.shadow.height;
c2.width = this.shadow.width;
ctx2.fillStyle = "rgba(250,250,250, 0)";
ctx2.fillRect (0, 0, 32, 32);
ctx2.drawImage(this.shadow, 0, 0);
var cs = document.getElementById('GameScreen2').getContext('2d')
cs.fillStyle = "rgba(250,50,250, 1)";
cs.fillRect (0, 0, 32, 32);
cs.drawImage(c2, 0, 0);
},
});
//----- ---[src/GeBoundingCircle.js]--- -----
var GeBoundingCircle = Class.create(GeBounding, {
initialize: function($super, parent, radius) {
$super(parent);
this.type = 'circle';
this.radius = radius;
},
check_cc: function(node) {
if (this.parent == node) {
return null;
}
var tradius = this.radius + node.bound.circle.radius;
var dist = this.parent.phys.pos.dist(node.phys.pos);
var delta = dist - tradius;
if (delta < 1) {
var c = new GeCollision(parent, 'cc', this.parent, node);
c.tradius = tradius;
c.dist = dist;
c.delta = -delta;
return c;
} else {
return null;
}
return null;
},
collide: function(node) {	
var c = null;
if (node.bound) {
if (node.bound.circle) {
if (c = this.check_cc(node)) {
return c;
}
} else if (node.bound.box) {


}
}
var it = node.childs.iterator();
var child;
while(child = it.next()) {
if (c = this.collide(child.data)) {
return c;
} 
}
return null;
}
});
//----- ---[src/GeBoundingBox.js]--- -----
var GeBoundingBox = Class.create(GeBounding, {
initialize: function($super, parent, u, v) {
$super(parent);
this.type = 'box';
this.u = u;
this.v = v
},
collide: function(sg) {	
return null;
}
});
//----- ---[src/GePhyState.js]--- -----
var GePosition = Class.create(Vector2D, {
initialize: function($super, x, y, orientation) {
$super(x, y);
if (orientation) {
this.orientation = orientation;
} else {
this.orientation = new Vector2D(0, 1);
}
},
});


var GePhysState = Class.create({
initialize: function(parent) {
this.parent = parent;
this.pos = new GePosition(0.0, 0.0, null);
this.velocity = new Vector2D(0.0,0.0);
this.force = new Vector2D(0.0, 0.0);
this.movable = false;
this.solid = false;
this.set_mass(10.0);
this.width = 32;
this.height = 32;
this.minval = 0.00001;
},
get_force: function() {
return this.force();
},
set_mass: function(mass) {
this.mass = mass;
this.invmass = 1.0 / mass;
},
setPosX: function(x) {
this.pos.x = x;
},
setPosY: function(y) {
this.pos.y = y;
},
getPosX: function() {
return this.pos.x;
},
getPosY: function() {
return this.pos.y;
},
isSolid: function() {
return this.solid;
},
setSolid: function(bSolid) {
this.solid = bSolid;
},
isMovable: function() {
return this.movable;
},
setMovable: function(bMovable) {
this.movable = bMovable;
},
applyForce: function(force) {
if (!this.force) {
this.force = new Vector2D(0,0);
}
this.force.add(force);
},
update: function(dt) {
if (this.force) {
this.force.set(0,0);
var m = this.force.clone();
m.mul(this.invmass).mul(dt);
if (Math.abs(m.x) < this.minval) m.x = 0;
if (Math.abs(m.y) < this.minval) m.y = 0;
this.velocity.add(m);


}
if (Math.abs(this.velocity.x) < this.minval) {
this.velocity.x = 0;
}
if (Math.abs(this.velocity.y) < this.minval) {
this.velocity.y = 0;
}
if (this.velocity.x == 0 && this.velocity.y == 0) {
this.parent.freeze();
}
this.pos.add(this.velocity);


this.grid_bounding();
this.pos.x = Math.round(this.pos.x);
this.pos.y = Math.round(this.pos.y);
},
grid_bounding: function() {
if (!this.parent.bound || !this.parent.bound.grid) {
return;
}
var ccell = this.parent.get_parent('cell');
if (!ccell) { return; }
var maxcellX = ccell.x * ccell.parent.cell_size + ccell.parent.cell_size;
var maxcellY = ccell.y * ccell.parent.cell_size + ccell.parent.cell_size;
if (this.pos.x < 0 || this.pos.x > maxcellX) {
this.velocity.invX();
}
if (this.pos.y < 0 || this.pos.y > maxcellY) {
this.velocity.invY();
}
}
});
//----- ---[src/GeLevel.js]--- -----
var GeLevel = Class.create(GeObject, {
initialize: function($super, parent, path) {
$super(parent);
this.path = path;
this.cell_size = 256;
},
});
//----- ---[src/GeTree.js]--- -----

var GeBound = Class.create(GeObject, {

initialize: function($super, parent) {
$super();
this.parent = parent;
},
add: function(bound) {
this[bound.type] = bound;
},
get: function(type) {
return this[type];
}
});
//----- ---[src/GeTreeNode.js]--- -----
var GeTreeNode = Class.create(GeObject, {
initialize: function($super, parent) {
$super(parent);
this.set_parent(parent);
this.childs = new GeLinkedList();
this.iterator = this.childs.iterator();
this._init(parent);
ShoGE.w("[" + this.core_id + "] Creating node tree: " + this.type);
},
_init: function(parent) {
this.type = "basic";
this.bPhysUpdate = false;
this.bRedraw = false;
},
set_parent: function(parent) {
this.parent = parent;
},
set_physUpdate: function(bool) {
this.bPhysUpdate = bool;
},
set_redraw: function(bool) {
this.bRedraw = bool;
},
hide: function() {
this.set_redraw(false);
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.hide();
}
},
unhide: function() {
this.set_redraw(true);
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.unhide();
}
},
hidden: function() {
return !this.bRedraw;
},
freeze: function() {
this.set_physUpdate(false);
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.freeze();
}
},
unfreeze: function() {
this.set_physUpdate(true);
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.unfreeze();
}
},
frozen: function() {
return !this.bPhysUpdate;
},
get_parent: function() {
return this.parent;
},
get_childs: function() {
return this.childs;
},
add_child: function(node) {
node.parent = this;
this.childs.add(node);
},
get_parent: function(type) {
if (!this.parent) {
return null;
}
if (this.parent.type == type) {
return this.parent;
}
return this.parent.get_parent(type);
},
enable_physics: function() {
if (!this.phys) {
this.phys = new GePhysState(this);
}
},
update: function(dt) {
if (this.phys && !this.frozen()) {
this.phys.update(dt);
var c = this.collide();
if (c) {  c.correct(); 
c.response(); }
}
if (this.postupdate) { this.postupdate(dt) };
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.update(dt);
}
},
collide: function() {
if (this.frozen()) {
return null;
}
if (!this.bound) {
return null;
}
if (this.bound.shadow) {
this.bound.shadow.collide(ShoGE.Core.SG);
}
if (this.bound.circle) {
return this.bound.circle.collide(ShoGE.Core.SG);
}
return null;
},
preload_ressources: function() {
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.preload_ressources();
}
},
draw: function(ctx) {
ctx.save();
if (this.gx && !this.hidden()) {
ctx.save();
this.gx.draw(ctx);
ctx.restore();
}
this.iterator.reset_head();
var child;
while(child = this.iterator.next()) {
child.data.draw(ctx);
}
ctx.restore();
}
});
//----- ---[src/GeTreeNode_Map.js]--- -----



var GeGx_Map = Class.create({

initialize: function(parent) {
this.parent = parent;
},

draw: function(ctx) {
ctx.drawImage(ShoGE.Core.Images.get("map_green01.png").get(), 0, 0);
},
});

var GeTreeNode_Map = Class.create(GeTreeNode, {
initialize: function($super, parent) {
$super();
},

_init: function(parent) {
this.type = "monster";
this.gx = new GeGx_Map(this);
this.unhide();
},
});
//----- ---[src/GeTreeNode_Monster.js]--- -----

var GeTreeNode_Monster = Class.create(GeTreeNode, {
initialize: function($super, parent) {
$super(parent);
},

_init: function(parent) {
this.type = "monster";
this.unfreeze();
this.unhide();
this.enable_physics();
this.phys.pos.x = Math.round(Math.random()*512);
this.phys.pos.y = Math.round(Math.random()*512);
var minus = 1;
if (Math.random() > 0.5) {
minus = -1
}
this.phys.velocity.x = Math.random()*10 * minus ;
minus = 1;
if (Math.random() > 0.5) {
minus = -1
}
this.phys.velocity.y = Math.random()*10 * minus;
this.gx = new GeGx_Monster(this);
this.bound = new GeBound(this);
this.bound.add(new GeBoundingCircle(this, this.gx.width/2));
this.bound.grid = 1;

var drawForce = new GeTreeNode_Vector(this, this.phys.force); 
drawForce.phys.pos = this.phys.pos;
drawForce.set_color("#AA00AA");
drawForce = new GeTreeNode_Vector(this, this.phys.velocity); 
drawForce.phys.pos = this.phys.pos;
drawForce.set_color("#FF0000");
this.add_child(drawForce);
drawForce = new GeTreeNode_Vector(this, this.phys.velocity.normal()); 
drawForce.phys.pos = this.phys.pos;
var that = this
drawForce.postupdate = function(dt) {
that.vector = that.phys.velocity.normal();
}
drawForce.set_color("#0000AA");
this.add_child(drawForce);
},
preload_ressources: function($super) {
ShoGE.w("Loading monster ressources");
ShoGE.Core.Images.add("ball-blue-32x32.png");
ShoGE.Core.Images.add("ball-cover-32x32.png");
$super();
},
});

var GeGx_Monster = Class.create({

initialize: function(parent) {
this.parent = parent;
this.width = 32;
this.height = 32;
},

draw: function(ctx) {
var phys = this.parent.phys;
ctx.translate(phys.pos.x - 16, phys.pos.y - 16);
ctx.drawImage(ShoGE.Core.Images.get("ball-blue-32x32.png").get(), 0, 0);
ctx.drawImage(ShoGE.Core.Images.get("ball-cover-32x32.png").get(), 0, 0);
},
});
//----- ---[src/GeTreeNode_Vector.js]--- -----
var GeGx_Vector = Class.create({
initialize: function(parent) {
this.parent = parent;
this.width = 32;
this.height = 32;
this.color = "#FF0000";
},
draw: function(ctx) {
var phys = this.parent.phys;
var B = phys.pos.clone().add(this.parent.vector.clone().mul(4));
ctx.moveTo(phys.pos.x, phys.pos.y);
ctx.lineTo(B.x, B.y);
ctx.strokeStyle = this.color;
ctx.stroke();
},
});
var GeTreeNode_Vector = Class.create(GeTreeNode, {
initialize: function($super, parent, vector) {
$super(parent);
this.vector = vector;
},
set_color: function(color) {
this.gx.color = color;
},
_init: function(parent) {
this.type = "vector";
this.unfreeze();
this.unhide();
this.enable_physics();
this.gx = new GeGx_Vector(this);
},
});
//----- ---[src/GeTreeNode_Grid.js]--- -----
var GeTreeNode_Grid = Class.create(GeTreeNode, {
initialize: function($super, parent, width, height, cell_size) {
this.width = width;
this.height = height;
this.cell_size = cell_size;
$super(parent);
},
_init: function(parent) {
this.type = "grid";
this.grid = new GeArray2D(this.width, this.height);
this.load(0,0);
this.load(1,0);
this.load(0,1);
this.load(1,1);
},
get: function(x, y) {
return this.grid.get(x, y);
},
set: function(x, y, cell) {
cell.x = x;
cell.y = y;
this.grid.set(x, y, cell);
this.add_child(cell);
},
load: function(x, y) {
var cell = new GeTreeNode_Cell(this, x, y);
this.set(x, y, cell);
},
add: function(node) {
var x = Math.round(node.phys.pos.x / this.cell_size);
var y = Math.round(node.phys.pos.y / this.cell_size);
var cell = this.get(x, y)
cell.add_child(node);
},
replace: function(node) {
if (!node.bound || !node.bound.grid) {
return;
}
var ccell = node.get_parent('cell');
if (!ccell) { 
return; 
}
var x = Math.round(node.x / this.cell_size);
var y = Math.round(node.y / this.cell_size);
var ccell = node.get_parent('cell');
if (ccell.x == x && ccell.y == y) {
return;
}
var ncell;
if (ncell = this.get(x, y)) {
ccell.childs.remove(node);
ncell.add_child(node);
}
},
});
//----- ---[src/GeTreeNode_Cell.js]--- -----
var GeTreeNode_Cell = Class.create(GeTreeNode, {
initialize: function($super, parent, x, y) {
$super(parent);
this.x = x;
this.y = y;
this.is_loaded = false;
this.load();
},
_init: function(parent) {
this.type = "cell";
this.gx = new GeGx_Cell(this);
this.unhide();
},
load_shadow_info: function() {
var canvas = document.createElement('canvas');
canvas.width = ShoGE.Core.Level.cell_size;
canvas.height = ShoGE.Core.Level.cell_size;
var c = canvas.getContext('2d');
c.width = this.img_shadow.width;
c.height = this.img_shadow.height;
c.drawImage(this.img_shadow, 0, 0);
var id = c.getImageData(0,0,ShoGE.Core.Level.cell_size,ShoGE.Core.Level.cell_size);
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
},
draw: function(ctx) {
if (!this.parent.tiles) {
return;
}
if (!this.cache) {
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
//----- ---[src/GeTreeNode_Collection.js]--- -----
var GeTreeNode_Collection = Class.create(GeTreeNode, {
initialize: function($super, parent, name) {
$super(parent);
this.name;
},
_init: function(parent) {
this.type = "collection";
},
update: function($super, dt) {
var it = this.childs.iterator();
var child;
while(child = it.next()) {
child.data.update(dt);
}
},
collide: function($super) {
var it = this.childs.iterator();
var child;
while(child = it.next()) {
child.data.collide();
}
}
});
//----- ---[src/GeTreeNode_Block.js]--- -----
var GeTreeNode_Block = Class.create(GeTreeNode, {
initialize: function($super, parent, pos, u, v) {
$super(parent);
this._init(pos, u, v);
},
_init: function(pos, u, v) {
this.type = "block";
this.phys = new GePhysState(this);
this.phys.pos = pos;
this.bound = new GeBound(this);
this.bound.add(new GeBoundingBox(this, u, v));
},
});
//----- ---[src/GeTreeNode_Coordinate.js]--- -----
var GeTreeNode_Coordinate = Class.create(GeTreeNode, {
initialize: function($super, parent, vector) {
$super(parent);
this.vector = vector;
},
_init: function(parent) {
this.type = "coordinate";
this.unfreeze();
this.unhide();
this.enable_physics();
var u = new GeTreeNode_Vector(this, new Vector2D(1,0));
u.set_color("#FF0000");
var v = new GeTreeNode_Vector(this, new Vector2D(0,1));
v.set_color("#0000FF");
this.add_child(u);
this.add_child(v);
},
});
//----- ---[src/GeCamera.js]--- -----
var GeCamera = Class.create(GeTreeNode, {
initialize: function($super, parent, object) {
$super(parent);
if (object) {
this.object = object;
} else {
this.object = new GePosition(); 
}
},
_init: function(parent) {
this.type = "camera";
},
track: function(node) {
this.tracked = node;
},
untrack: function() {
this.tracked = null;
},
});
//----- ---[src/GeRenderer.js]--- -----
var GeRenderer = Class.create(GeObject, {
initialize: function($super, parent, screen, camera, width, height) {
$super();
this.camera = camera;
this.parent = parent;
this.screen = screen;
this.width = width;
this.height = height;
this.FPS = 0;
var date = new Date();
this.lastFrameTime = date.getTime();
this.frameCount = 0;
},
draw: function() {
this.screen.init_buffer();
var ctx = this.screen.buffer.getContext('2d');	
ctx.save();
if (this.camera) {
var o = new Vector2D(1, 0).angle(this.camera.object.phys.velocity);
ctx.translate(this.screen.width / 2, this.screen.height / 2);
ctx.translate(-this.camera.object.phys.pos.x, -this.camera.object.phys.pos.y);
}
ctx.scale(0.5, 0.5);
this.parent.SG.draw(ctx);
ctx.restore();
var date = new Date();
var ctime = date.getTime();
var d = ctime - this.lastFrameTime;			
if (d >= 1000.0) {
this.FPS = (this.frameCount + this.FPS) / 2.0;
this.lastFrameTime = ctime + (d - 1000);
this.frameCount = 0;
}
this.frameCount++;	
this.screen.swap();	
}
});
//----- ---[src/GeCore.js]--- -----
var GeCore = Class.create(GeObject, {
initialize: function($super, parent) {
this.set_parent(parent);
var date = new Date();
this.bgcolor = "rgb(0,0,0)";
this.step = 0;
this.timer = null;
this.t = 0;
this.startTime = null;
this.currentTime = date.getTime();
this.dt = 12;
this.accumulator = 0;
this.lastDraw = this.currentTime;
},
init: function(width, height) {
var date = new Date();
this.init_global_variables();
this.Screen = new GeScreen(this,"GameScreen", width,height);
this.Screen.clear(this.bgcolor);
this.Screen2 = new GeScreen(this,"GameScreen3", width/2,height/2);
this.Screen2.clear(this.bgcolor);
this.Mouse = new GeMouse();
this.Images = new GeMediaPool();
this.SG = new GeTreeNode_Collection(null, "World");
this.Renderer = new GeRenderer(this, this.Screen, null, width, height);
this.Level = new GeLevel(this, 'darks');
this.Grid = new GeTreeNode_Grid(this, 2,2, 512);
this.SG.add_child(this.Grid);
this.load_ressources();
this.ImageReady = new GeWaitLoading(parent, this.Screen, this.Images);
this.SG.preload_ressources();
this.start();
},
init_global_variables: function() {
Log = new GeLog("GameLog");
ShoGE.w = Log.w;
},
load_ressources: function() {
var m = null;
for(var i = 0; i < 10; i++) {
m = new GeTreeNode_Monster(null);
this.Grid.add(m);
}
this.camera = new GeCamera(parent, m);
this.SG.add_child(this.camera);
this.Renderer2 = new GeRenderer(this, this.Screen2, this.camera, this.width/2, this.height/2);
var map = new GeTreeNode_Map(null);
},
start: function() {
var that = this;
this.startTime = Date.now();
this.lastFrameTime = Date.now();
ShoGE.w("--- Starting Game Engine");
this.timer = new PeriodicalExecuter(function(pe) {	
that.html_update();
}, 0.01);
new PeriodicalExecuter(function(pe) {			
if (that.ImageReady.is_loading()) {
that.ImageReady.draw();
} else {
pe.stop();
that.start_loop();
}
}, 0.1);
},
html_update: function(){
$('GameFPS').innerHTML = Math.round(this.Renderer.FPS);
$('GameFPS3').innerHTML = Math.round(this.Renderer2.FPS);
},
start_loop: function() {
var that = this;
new PeriodicalExecuter(function(pe) {	
that.loop();
}, 0.0001);
},

loop: function() {	
var newTime = Date.now();
var frameTime = newTime - this.currentTime;
this.currentTime = newTime;
this.accumulator  += frameTime;
while(this.accumulator >= this.dt) {
this.accumulator -= this.dt;
this.t += this.dt;
this.SG.update(this.dt);
}
this.Renderer.draw();
this.Renderer2.draw();
},
});	
//----- ---[src/GeInitGlobals.js]--- -----


ShoGE.Core = new GeCore(null);
