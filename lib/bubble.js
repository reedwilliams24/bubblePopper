var Util = require('./util');
var Game = require('./game');

// 008744
// ["#008744", "#1976D2", "#d62d20", "#ffa700", "#fff4e6"]
//green, blue, red, yellow, purple
var DEFAULTS = {
  // COLORS: ["#FFFFF0", "#1976D2", "#D53820", "#FFEA00", "#F48FB1"],
  COLORS: ["#0056A8", "#FDFFFC", "#32936F", "#E83F6F", "#FF9F1C"],
  SPEED: 100
};

var Bubble = function (options){
  this.color = options.color || DEFAULTS.COLORS[
    Math.floor(Math.random()*DEFAULTS.COLORS.length)];
  this.pos = options.pos;
  this.radius = options.radius;
  this.vel = [0.5,-3];
  options.speed = options.speed || DEFAULTS.SPEED;
  this.game = options.game;
};

Bubble.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.shadowColor='black';
  ctx.shadowBlur = 1;
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Bubble.prototype.move = function (timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    // offsetX = this.vel[0] * velocityScale,
    // offsetY = this.vel[1] * velocityScale;
    offsetX = this.vel[0],
    offsetY = this.vel[1];

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  if (this.game.hitWall(this.pos)) {
    this.vel[0] *= -1;
  }
};

Bubble.prototype.isCollidedWith = function (otherBubble) {
  var centerDistance = Util.distance(this.pos, otherBubble.pos);
  return centerDistance < (this.radius + otherBubble.radius);
};

Bubble.prototype.remove = function () {
  this.game.remove(this);
};

Bubble.prototype.removeStrandedBubble = function () {
  this.game.removeStrandedBubble(this);
};

Bubble.prototype.isTouching = function (otherBubble) {
  var centerDistance = Util.distance(this.pos, otherBubble.pos);

  if (centerDistance < this.radius*2*1.05 && centerDistance > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = Bubble;
window.game = Game;
