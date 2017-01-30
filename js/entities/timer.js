App = {
  load: function() {
    if(!me.video.init("app", 800, 600, false, 1.0)) {
      alert("Your browser does not support the canvas.");
      return;
    }

    me.loader.onload = this.loaded.bind(this);
    me.loader.preload([]);
    me.state.change(me.state.LOADING);
  },

  loaded: function() {
    me.state.set(me.state.PLAY, new PlayScreen());
    me.state.change(me.state.PLAY);
  }
}

var Manager = me.InvisibleEntity.extend({
  init: function() {
    // 5 minutes in milliseconds, count down to true
    this.timer = new TimerObject(5 * 60 * 1000, true, 10, 10, "timer");
    // start at 0, count up
    this.clock = new TimerObject(0, false, 700, 10, "clock");
  },

  update: function() {
    me.video.clearSurface(me.video.getScreenCanvas().getContext('2d'), '#000000');
    this.timer.update();
    this.clock.update();
  }
});

var TimerHUD = me.HUD_Item.extend({
  init: function(x, y) {
    this.parent(x, y);
    this.font = new me.Font("Arial", 16, "white");
  },

  draw: function(ctx, x, y) {
    this.font.draw(ctx, this.value, this.pos.x + x, this.pos.y + y);
  }
});

var TimerObject = (function() {
  function TimerObject(time, countdown, x, y, name) {
    this.time = time;
    this.countdown = countdown;
    this.x = x;
    this.y = y;
    this.name = name;
    me.game.HUD.addItem(name, new TimerHUD(this.x, this.y));
    me.game.HUD.setItemValue(name, this.convert());
    this.start_time = me.timer.getTime();
  }

  TimerObject.prototype.convert = function() {
    var x = this.time / 1000;
    var seconds = x % 60;
    x /= 60;
    var minutes = x % 60;
    return Math.floor(minutes) + ":" + Math.floor(seconds);
  }

  TimerObject.prototype.update = function() {
    if(this.countdown) {
      this.time -= (me.timer.getTime() - this.start_time);
    }
    else {
      this.time += (me.timer.getTime() - this.start_time);
    }
    me.game.HUD.setItemValue(this.name, this.convert());
  }

  return TimerObject;
})();

var PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    this.parent(true);
    me.game.addHUD(0, 0, 800, 600);
    me.game.add(new Manager(), 0);
    me.game.sort();
  },

  onDestroyEvent: function() {
    me.game.disableHUD();
  }
});

window.onReady(function() {
  App.load();
});