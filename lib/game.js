var Bubble = require('./bubble');

var Game = function () {
  this.bubbles = [];
  this.shootingBubble = null;
  this.onDeckBubbles = [];
  this.addBubbles();
};

Game.BACKGROUND_COLOR = "grey";
Game.DIM_X = 600;
Game.DIM_Y = 1000;
Game.FPS = 32;
Game.NUM_BUBBLES = 12;
Game.NUM_ROWS = 8;
Game.BUBBLE_RADIUS = 25;
Game.BUBBLE_GAP = 7;
Game.SHOOTING_POS = [Game.DIM_X/2,Game.DIM_Y*.9];
Game.ON_DECK_ONE_POS = [Game.DIM_X*.35,Game.DIM_Y*.95];
Game.ON_DECK_TWO_POS = [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95];

Game.prototype.add = function (bubble) {
  this.bubbles.push(bubble);
};

Game.prototype.addShootingBubble = function (bubble) {
  this.shootingBubble = bubble;
};

Game.prototype.addOnDeckBubble = function (bubble) {
  this.onDeckBubbles.push(bubble);
};

Game.prototype.addBubbles = function () {
  for (var row = 0; row < Game.NUM_ROWS; row++) {
    for (var i = 0; i < Game.NUM_BUBBLES-row%2; i++) {
      this.add(new Bubble({
        game: this,
        pos: [
          i*Game.BUBBLE_RADIUS*2+Game.BUBBLE_RADIUS+row%2*Game.BUBBLE_RADIUS,
          (row*Game.BUBBLE_RADIUS*2+Game.BUBBLE_RADIUS)-Game.BUBBLE_GAP*row],
        radius: Game.BUBBLE_RADIUS
      }));
    }
  }
  //On Deck Bubbles
  this.addShootingBubble(new Bubble({
    game: this,
    pos: Game.SHOOTING_POS,
    radius: Game.BUBBLE_RADIUS
  }));

  this.addOnDeckBubble(new Bubble({
    game: this,
    pos: Game.ON_DECK_ONE_POS,
    radius: Game.BUBBLE_RADIUS
  }));

  this.addOnDeckBubble(new Bubble({
    game: this,
    pos: Game.ON_DECK_TWO_POS,
    radius: Game.BUBBLE_RADIUS
  }));
};

Game.prototype.allBubbles = function () {
  return [].concat(this.bubbles, this.shootingBubble, this.onDeckBubbles);
};

Game.prototype.draw = function (ctx) {
  // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BACKGROUND_COLOR;
  ctx.fillRect(0,0, Game.DIM_X, Game.DIM_Y);

  //Bottom panel with bubbles on deck
  ctx.fillStyle = "darkgrey";
  ctx.fillRect(0,Game.DIM_Y*.90, Game.DIM_X, Game.DIM_Y);

  this.allBubbles().forEach(function(bubble){
    bubble.draw(ctx);
  });

};

Game.prototype.step = function (delta) {
  this.moveBubble(delta);
  this.checkCollisions();
};

Game.prototype.moveBubble = function (delta) {
  if (this.shootingBubble) {
    this.shootingBubble.move(delta);
  }

};

Game.prototype.checkCollisions = function () {
  var game = this;

  for (var i = 0; i < this.bubbles.length; i++) {
    if (this.shootingBubble.isCollidedWith(this.bubbles[i])) {
      this.stickBubble(this.bubbles[i]);
      break;
    }
  }
};

Game.prototype.stickBubble = function(otherBubble){
  //Left or right of the other bubble
  if (this.shootingBubble.pos[0] < otherBubble.pos[0]) {
    this.shootingBubble.pos[0] = otherBubble.pos[0] - Game.BUBBLE_RADIUS;
  } else {
    this.shootingBubble.pos[0] = otherBubble.pos[0] + Game.BUBBLE_RADIUS;
  }

  //Top or bottom of the other bubble
  if (this.shootingBubble.pos[1] > otherBubble.pos[1]) {
    this.shootingBubble.pos[1] =
      otherBubble.pos[1] + Game.BUBBLE_RADIUS*2 - Game.BUBBLE_GAP;
  } else {
    this.shootingBubble.pos[1] =
      otherBubble.pos[1] - Game.BUBBLE_RADIUS*2 + Game.BUBBLE_GAP;
  }

  this.bubbles.push(this.shootingBubble);
  this.rotateShootingBubbles();
};

Game.prototype.rotateShootingBubbles = function () {
  this.onDeckBubbles[1].pos = this.onDeckBubbles[0].pos;
  this.onDeckBubbles[0].pos = Game.SHOOTING_POS;
  this.shootingBubble = this.onDeckBubbles.shift();

  this.addOnDeckBubble(new Bubble({
    game: this,
    pos: [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95],
    radius: Game.BUBBLE_RADIUS
  }));
};

// Game.prototype.addOnDeckBubble = function () {
//   this.addOnDeckBubble(new Bubble({
//     game: this,
//     pos: [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95],
//     radius: Game.BUBBLE_RADIUS
//   }));
// };

module.exports = Game;
