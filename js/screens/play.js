

game.PlayScreen = me.ScreenObject.extend({
  /**
   * action to perform on state change
   */
  onResetEvent : function () {
    // load a level
    me.levelDirector.loadLevel("area01");

    // reset the score
    game.data.score = 0;
	
	//reset the health
	game.data.health = 3;
	
	// play the audio track
  me.audio.playTrack("dst-inertexponent");

    // add our HUD to the game world
    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);
  },
  
  /* this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (game.data.health <= 0) {
        // play something on tap / enter
        // this will unlock audio on mobile devices
       
        me.state.change(me.state.OVER);
      }
    }); */

  /**
   * action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function () {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
	// stop the current audio track
  me.audio.stopTrack();
  }
});
