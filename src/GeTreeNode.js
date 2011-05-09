var GeTreeNode = Class.create(GeObject, {
    initialize: function($super, parent) {
        $super(parent);
        this.set_parent(parent);
        this.childs = new GeLinkedList();
		this.iterator = this.childs.iterator();
        this._init(parent);
        //ShoGE.w("[" + this.core_id + "] Creating node tree: " + this.type);
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
		//var it = this.childs.iterator();
		var child;
		while(child = this.iterator.next()) {
            child.data.hide();
        }
    },

	
    unhide: function() {
        this.set_redraw(true);
		this.iterator.reset_head();
		//var it = this.childs.iterator();
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
 		//var it = this.childs.iterator();
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
       //	ShoGE.Core.Grid.replace(this);
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
