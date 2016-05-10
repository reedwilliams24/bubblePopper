// var Util = require('./util');
// var MovingObject = require('./movingObject');

var DEFAULTS = {
  COLORS: ["#008744", "#0057e7", "#d62d20", "#ffa700", "#fff4e6"],
  SPEED: 4
};

var Bubble = function (options){
  this.color = DEFAULTS.COLORS[Math.floor(Math.random()*DEFAULTS.COLORS.length)];
  this.pos = options.pos;
  this.radius = options.radius;
  // options.vel = options.vel || DEFAULTS.COLOR;
  options.speed = options.speed || DEFAULTS.SPEED;
  this.game = options.game;
};

Bubble.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

module.exports = Bubble;
