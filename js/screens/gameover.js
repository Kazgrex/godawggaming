/**
 * A Game Over screen
 */
game.OverScreen = me.ScreenObject.extend({
  /**
   * action to perform on state change
   */
  onResetEvent : function () {
    // title screen
    var backgroundImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('over_screen'),
        }
    );

    // position and scale to fit with the viewport size
    backgroundImage.anchorPoint.set(0, 0);
    backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);

    // add to the world container
    me.game.world.addChild(backgroundImage, 1);

    // change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.ENTER);
    me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, me.input.KEY.ENTER);
    me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        // play something on tap / enter
        // this will unlock audio on mobile devices
        me.audio.play("cling");
        me.state.change(me.state.MENU);
      }
    });
  },

  /**
   * action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function () {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindPointer(me.input.pointer.LEFT);
    me.event.unsubscribe(this.handler);
  }
});