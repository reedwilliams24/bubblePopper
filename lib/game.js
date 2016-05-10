var Bubble = require('./bubble');

var Game = function () {
  this.bubbles = [];
  this.addBubbles();
};

Game.BACKGROUND_COLOR = "grey";
Game.DIM_X = 600;
Game.DIM_Y = 1000;
Game.FPS = 32;
Game.NUM_BUBBLES = 12;
Game.NUM_ROWS = 8;
Game.BUBBLE_RADIUS = 25;

Game.prototype.add = function (object) {
  this.bubbles.push(object);
};

Game.prototype.addBubbles = function () {
  for (var row = 0; row < Game.NUM_ROWS; row++) {
    for (var i = 0; i < Game.NUM_BUBBLES-row%2; i++) {
      this.add(new Bubble({
        game: this,
        pos: [i*Game.BUBBLE_RADIUS*2+Game.BUBBLE_RADIUS+row%2*Game.BUBBLE_RADIUS,
          row*Game.BUBBLE_RADIUS*2+Game.BUBBLE_RADIUS],
        radius: Game.BUBBLE_RADIUS
      }));
    }
  }
  //On Deck Bubbles
  this.add(new Bubble({
    game: this,
    pos: [Game.DIM_X/2,Game.DIM_Y*.9],
    radius: Game.BUBBLE_RADIUS
  }));

  this.add(new Bubble({
    game: this,
    pos: [Game.DIM_X*.35,Game.DIM_Y*.95],
    radius: Game.BUBBLE_RADIUS
  }));

  this.add(new Bubble({
    game: this,
    pos: [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95],
    radius: Game.BUBBLE_RADIUS
  }));
};

Game.prototype.draw = function (ctx) {
  // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BACKGROUND_COLOR;
  ctx.fillRect(0,0, Game.DIM_X, Game.DIM_Y);

  //Bottom panel with bubbles on deck
  ctx.fillStyle = "darkgrey";
  ctx.fillRect(0,Game.DIM_Y*.90, Game.DIM_X, Game.DIM_Y);

  this.bubbles.forEach(function(bubble){
    bubble.draw(ctx);
  });

};

Game.prototype.step = function (delta) {
  // this.moveObjects(delta);
  // this.checkCollisions();
};

module.exports = Game;
