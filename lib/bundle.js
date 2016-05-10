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
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Bubble = __webpack_require__(3);
	
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
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map