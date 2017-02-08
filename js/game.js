/* game namespace */
var game = {
  /**
   * an object where to store game global data
   */
  data : {
    score : 0
  },

   data : {
	health : 3
  },
  
	data : {
		clock : 59
	},
  // Run on page load.
  onload : function () {
    // Initialize the video.
    if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod : "fit"})) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (me.game.HASH.debug === true) {
      window.onReady(function () {
        me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
      });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);
	
	

    // Load the resources.
    me.loader.preload(game.resources);
	


    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
/**
 * callback when everything is loaded
 */
loaded : function () {
  // set the "Play/Ingame" Screen Object
  me.state.set(me.state.MENU, new game.TitleScreen());

  // set the "Play/Ingame" Screen Object
  me.state.set(me.state.PLAY, new game.PlayScreen());
  
  //set the "Game Over" Screen Object
   me.state.set(me.state.GAMEOVER, new game.OverScreen());

  // set a global fading transition for the screen
  me.state.transition("fade", "#FFFFFF", 250);

  // register our player entity in the object pool
  me.pool.register("mainPlayer", game.PlayerEntity);
  me.pool.register("CoinEntity", game.CoinEntity);
  me.pool.register("EnemyEntity", game.EnemyEntity);
  me.pool.register("FlyEnemyEntity", game.FlyEnemyEntity);
  me.pool.register("SlowEnemyEntity", game.SlowEnemyEntity);

 

  

  // display the menu title
  me.state.change(me.state.MENU);
}


};