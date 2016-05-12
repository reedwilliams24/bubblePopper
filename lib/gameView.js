var GameView = function(game, ctx){
  this.ctx = ctx;
  this.game = game;
};

GameView.prototype.start = function () {
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
  $(window).on("keydown", this.handleKeyEvent.bind(this));
};

GameView.prototype.animate = function (time) {
  var timeDelta = time - this.lastTime;
  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.KEYS = {
  32: "Space",
  37: "Left",
  39: "Right"
};

GameView.prototype.handleKeyEvent = function (e) {
  if (GameView.KEYS[e.keyCode]) {
    this.game.handleKeyEvent(GameView.KEYS[e.keyCode]);
  }
};


module.exports = GameView;
