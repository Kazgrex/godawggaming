/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
  /**
   * constructor
   */
  init : function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(4, 15);
	this.body.setFriction(1,0);
	// enable the keyboard
  me.input.bindKey(me.input.KEY.LEFT, "left");
  me.input.bindKey(me.input.KEY.RIGHT, "right");
  me.input.bindKey(me.input.KEY.UP, "jump", true);
  //me.input.bindKey(me.input.KEY.X, "flip");
  
  
  me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.UP);
  me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, me.input.KEY.UP);
  //me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.DOWN}, me.input.KEY.DOWN);
  //me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_3}, me.input.KEY.DOWN);
 //me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_4}, me.input.KEY.DOWN);
  me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.LEFT}, me.input.KEY.LEFT);
  me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.RIGHT}, me.input.KEY.RIGHT);

  // map axes
  me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
  me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5}, me.input.KEY.RIGHT);
  me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation("walk",  [ 1, 2, 3, 4, 5, 6]);

    // define a standing animation (using the first frame)
    this.renderable.addAnimation("stand",  [0, 0, 0]);
	
	//define a jumping animation
	this.renderable.addAnimation("jump", [7]);

    // set the standing animation as default
    this.renderable.setCurrentAnimation("stand");
	
  },

  /**
 * update the player pos
 */
update : function (dt) {
//add flip gravity
/*         if (me.input.isKeyPressed('flip'))
        {
            // set current vel to the maximum defined value
            // gravity will then do the rest
            this.body.gravity = -this.body.gravity;
            this.renderable.flipY(this.body.gravity < 0);
        } */
  if (me.input.isKeyPressed('left')) {
    // flip the sprite on horizontal axis
    this.renderable.flipX(true);

    // update the entity velocity
    this.body.vel.x -= this.body.accel.x * me.timer.tick;

    // change to the walking animation
    if (!this.renderable.isCurrentAnimation("walk") ) {
                  this.renderable.setCurrentAnimation("walk");
              }
  }
  else if (me.input.isKeyPressed('right')) {
    // unflip the sprite
    this.renderable.flipX(false);

    // update the entity velocity
    this.body.vel.x += this.body.accel.x * me.timer.tick;

    // change to the walking animation
     if (!this.renderable.isCurrentAnimation("walk") ) {
                  this.renderable.setCurrentAnimation("walk");
              }
  }
     
		 if (me.input.isKeyPressed("jump")) {
            
			  this.renderable.setCurrentAnimation("jump");

            if (this.multipleJump <= 2 && this.body.gravity > 0) {
                // easy "math" for double jump
              this.body.vel.y -= (this.body.maxVel.y * this.multipleJump++) * me.timer.tick;
			  this.body.jumping = true;
              me.audio.play("jump", false);
            }else if(this.multipleJump <= 2 && this.body.gravity < 0) {
			this.body.vel.y = (this.body.maxVel.y * this.multipleJump++) * me.timer.tick;
			}
			
        }
		 if (this.body.jumping || this.body.falling){
            this.renderable.setCurrentAnimation("jump");
        }
        else if (!this.body.falling && !this.body.jumping) {
            // reset the multipleJump flag if on the ground
            this.multipleJump = 1;
        }
        else if (this.body.falling && this.multipleJump < 2) {
            // reset the multipleJump flag if falling
            this.multipleJump = 2;
        }

  // apply physics to the body (this moves the entity)
  this.body.update(dt);
  
          // check if we fell into a hole
        if (!this.inViewport && (this.pos.y > me.video.renderer.getHeight()) && (this.body.gravity > 0)) {
            // if yes reset the game
            me.game.world.removeChild(this);
            me.game.viewport.fadeIn("#fff", 150, function(){
                me.audio.play("die", false);
                me.state.change(me.state.GAMEOVER);
                me.game.viewport.fadeOut("#fff", 150);
            });
            return true;
        } else if(!this.inViewport && (this.pos.y < me.video.renderer.getHeight()) && (this.body.gravity < 0)) {
            // if yes reset the game
            me.game.world.removeChild(this);
            me.game.viewport.fadeIn("#fff", 150, function(){
                me.audio.play("die", false);
                me.state.change(me.state.GAMEOVER);
                me.game.viewport.fadeOut("#fff", 150);
            });
            return true;
        } 
  // handle collisions against other shapes
  me.collision.check(this);

 // check if we moved (a "stand" animation would definitely be cleaner)
        if (this.body && this.body.vel.x == 0 && this.body.vel.y == 0) {
            if (!this.renderable.isCurrentAnimation("stand")) {
                this.renderable.setCurrentAnimation("stand");
            }
        }
        this._super(me.Entity, 'update', [dt]);
        return true;

    },

/**
 * colision handler
 */
onCollision : function (response, other) {
  switch (response.b.body.collisionType) {
        case me.collision.types.WORLD_SHAPE:
      // Simulate a platform object
      if (other.type === "platform") {
        if (this.body.falling &&
          !me.input.isKeyPressed('down') &&

          // Shortest overlap would move the player upward
          (response.overlapV.y > 0) &&

          // The velocity is reasonably fast enough to have penetrated to the overlap depth
          (~~this.body.vel.y >= ~~response.overlapV.y)
        ) {
          // Disable collision on the x axis
          response.overlapV.x = 0;

          // Repond to the platform (it is solid)
          return true;
        }

        // Do not respond to the platform (pass through)
        return false;
      } else if(other.type === "spike") {
		  this.dead();
	  } 
      break;
	  
	case me.collision.types.ACTION_OBJECT:
				if(other.type === "flip") {
					this.body.gravity = -this.body.gravity;
					this.renderable.flipY(this.body.gravity < 0);
				}
				break;		

   case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    },

 hurt : function () {
        if (!this.renderable.isFlickering())
        {
         this.renderable.flicker(1000);
		me.game.viewport.fadeIn("#FFFFFF", 75);
		me.audio.play("hurt");
		game.data.health -= 1;
        }else{
			if( game.data.health <= 0)
			{
				me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);
				me.game.world.removeChild(this);
				me.game.viewport.fadeIn("#fff", 150, function(){
                me.state.change(me.state.GAMEOVER);
				me.audio.play("die", false);
                me.game.viewport.fadeOut("#fff", 150);
			})
		}
    }
 },
 
  dead : function () {
        if (!this.renderable.isFlickering())
        {
         this.renderable.flicker(1000);
		 me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);
		me.game.viewport.fadeIn("#FFFFFF", 75);
		//me.audio.play("hurt");
		game.data.health -= 3;
        }else{
			if( game.data.health<= 0)
			{
				me.game.world.removeChild(this);
				me.game.viewport.fadeIn("#fff", 150, function(){
                me.state.change(me.state.GAMEOVER);
				me.audio.play("die", false);
                me.game.viewport.fadeOut("#fff", 150);
			})
		}	
    }
 }  
})  
/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected
	
	// play a "coin collected" sound
  me.audio.play("cling");
  
	// give some score
	game.data.score += 250;
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);

    return false
  }
})

game.FlipEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
	this.body.collisionType = me.collision.types.ACTION_OBJECT;
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected
	
	// play a "coin collected" sound
  me.audio.play("flip");

  
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);

    return false
  }
})
/**
 * an enemy Entity
 */
game.EnemyEntity = me.Entity.extend({
  init: function (x, y, settings) {
 

    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;

    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
   // settings.width = settings.spritewidth;
    //settings.height = settings.spriteheight;

    // redefine the default shape (used to define path) with a shape matching the renderable
    settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
	
	this.renderable.addAnimation("dead", [6]);

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX   = x + width - settings.framewidth
    this.pos.x  = x + width - settings.framewidth;
	
	this.body.gravity = settings.gravity || me.sys.gravity;

    // to remember which side we were walking
    this.walkLeft = false;

    // walking & jumping speed
    this.body.setVelocity(4, 6);
	// set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
	// a specific flag to recognize these enemies
    this.isMovingEnemy = true;

	// don't update the entities when out of the viewport
     this.alwaysUpdate = false;

  },

  /**
   * update the enemy pos
   */
  update : function (dt) {

    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
      }
      else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      }

      // make it walk
      this.renderable.flipX(this.walkLeft);
      this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    }
    else {
      this.body.vel.x = 0;
    }

    // update the body movement
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
   
onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
       this.alive = false;
            //avoid further collision and delete it
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            // set dead animation
           this.renderable.setCurrentAnimation("dead");
			me.audio.play("stomp");
            // make it flicker and call destroy once timer finished
            var self = this;
            this.renderable.flicker(750, function () {
                me.game.world.removeChild(self);
				 });
				 game.data.score += 250;
      }
      return false;
    }
    // Make all other objects solid
    return true;
  }
});
  game.FlyEnemyEntity = game.EnemyEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // super constructor
        this._super(game.EnemyEntity, "init", [x, y, settings]);
		this.renderable.addAnimation("walk",  [ 0, 1, 2, 3, 4, 5]);
		this.renderable.addAnimation ("dead", [6]);
		this.renderable.setCurrentAnimation("walk");

    }
  
});

  game.SlowEnemyEntity = game.EnemyEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // super constructor
        this._super(game.EnemyEntity, "init", [x, y, settings]);
		// walking & jumping speed
		this.body.setVelocity(2, 6);
		this.renderable.addAnimation("walk",  [ 0, 1, 2, 3, 4]);
		this.renderable.addAnimation ("dead", [5]);
		this.renderable.setCurrentAnimation("walk");
    }
  
});

  game.ChaseEnemyEntity = game.EnemyEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // super constructor
        this._super(game.EnemyEntity, "init", [x, y, settings]);
		this.renderable.addAnimation("walk",  [ 0, 1, 2, 3, 4, 5]);
		this.renderable.addAnimation ("dead", [6]);
		this.renderable.setCurrentAnimation("walk");
    }
  
});
  
  

