/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  canvasEl.addEventListener('click', game.shootBubble.bind(game), false);
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Bubble = __webpack_require__(3);
	
	var Game = function () {
	  this.bubbles = [];
	  this.shootingBubble = null;
	  this.bubbleShot = false;
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
	  if (this.bubbleShot) {
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
	  this.bubbleShot = false;
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
	
	Game.prototype.shootBubble = function (e) {
	  var theta = Math.atan(
	    (e.y - this.shootingBubble.pos[1]) /
	      (e.x - this.shootingBubble.pos[0])
	  );
	
	  var magnitude = 10;
	
	  if (theta > 0) {
	    this.shootingBubble.vel[0] = Math.cos(theta+Math.PI)*magnitude;
	  } else {
	    this.shootingBubble.vel[0] = Math.cos(theta)*magnitude;
	  }
	
	
	  this.shootingBubble.vel[1] = -Math.sqrt(
	    Math.pow(Math.sin(theta)*magnitude,2)
	  );
	
	  this.bubbleShot = true;
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var GameView = function(game, ctx){
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function () {
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function (time) {
	  var timeDelta = time - this.lastTime;
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	
	var DEFAULTS = {
	  COLORS: ["#008744", "#0057e7", "#d62d20", "#ffa700", "#fff4e6"],
	  SPEED: 4
	};
	
	var Bubble = function (options){
	  this.color = DEFAULTS.COLORS[
	    Math.floor(Math.random()*DEFAULTS.COLORS.length)];
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.vel = [0.5,-3];
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
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	Bubble.prototype.move = function (timeDelta) {
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	    // offsetX = this.vel[0] * velocityScale,
	    // offsetY = this.vel[1] * velocityScale;
	    offsetX = this.vel[0],
	    offsetY = this.vel[1];
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	};
	
	Bubble.prototype.isCollidedWith = function (otherBubble) {
	  var centerDistance = Util.distance(this.pos, otherBubble.pos);
	  return centerDistance < (this.radius + otherBubble.radius);
	};
	
	Bubble.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = Bubble;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	  distance: function (pos1, pos2){
	    return Math.sqrt(
	      Math.pow(pos1[0]-pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  }
	};
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map