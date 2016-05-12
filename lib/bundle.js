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
	var GameView = __webpack_require__(4);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  canvasEl.addEventListener('click', game.shootBubble.bind(game), false);
	  new GameView(game, ctx).start();
	
	  var $gameInfo = $('.gameInfo');
	  var $scoreBoard = $('.gameScoreContainer');
	
	  $('<label id="scoreValue" value="128">TEST SCORE</label>').appendTo($gameInfo);
	
	  $('<input id="restart" type="button" value="restart" />').click(function(){
	    game.reset();
	  }).appendTo($gameInfo);
	  $('<input id="solve" type="button" value="solve" />').click(function(){
	    // game = new Game($root);
	  }).appendTo($gameInfo);
	  $('<input id="info" type="button" value="info" />').click(function(){
	
	  }).appendTo($gameInfo);
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Bubble = __webpack_require__(2);
	
	var Game = function () {
	  this.bubbles = [];
	  this.shootingBubble = null;
	  this.bubbleShot = false;
	  this.bubbleColors = ["#008744", "#0057e7", "#d62d20", "#ffa700", "#fff4e6"];
	  this.onDeckBubbles = [];
	  this.innerBubbles = [];
	  this.fallingBubbles = 0;
	  this.bubblesPopping = 0;
	  this.addBubbles();
	};
	
	Game.BACKGROUND_COLOR = "grey";
	Game.DIM_X = 600;
	Game.DIM_Y = 1000;
	Game.FPS = 32;
	Game.NUM_BUBBLES = 12;
	Game.NUM_ROWS = 8;
	Game.BUBBLE_RADIUS = 25;
	Game.BUBBLE_GAP = 12.5*Math.cos(45);
	Game.SHOOTING_POS = [Game.DIM_X/2,Game.DIM_Y*.9];
	Game.ON_DECK_ONE_POS = [Game.DIM_X*.35,Game.DIM_Y*.95];
	Game.ON_DECK_TWO_POS = [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95];
	
	Game.prototype.reset = function () {
	  this.bubbles = [];
	  this.shootingBubble = null;
	  this.bubbleShot = false;
	  this.bubbleColors = ["#008744", "#0057e7", "#d62d20", "#ffa700", "#fff4e6"];
	  this.onDeckBubbles = [];
	  this.innerBubbles = [];
	  this.fallingBubbles = 0;
	  this.bubblesPopping = 0;
	  this.addBubbles();
	};
	
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
	  return [].concat(
	    this.bubbles, this.shootingBubble, this.onDeckBubbles, this.innerBubbles);
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
	  if (this.fallingBubbles === 0 && this.bubblesPopping === 0) {
	    this.moveBubble(delta);
	    this.checkCollisions();
	  } else {
	    console.log('bubbles are falling/popping');
	  }
	};
	
	Game.prototype.moveBubble = function (delta) {
	  if (this.bubbleShot && this.fallingBubbles === 0 && this.bubblesPopping === 0) {
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
	
	  if (this.shootingBubble.pos[1] <= Game.BUBBLE_RADIUS/2) {
	    var directionBoost = 0;
	
	    if (this.shootingBubble.vel[0] < 0) {
	      directionBoost -= this.shootingBubble.radius;
	    } else {
	      directionBoost += this.shootingBubble.radius;
	    }
	
	    this.shootingBubble.pos[0] = directionBoost+Game.BUBBLE_RADIUS*2*(
	      Math.round((this.shootingBubble.pos[0])/50));
	    this.shootingBubble.pos[1] = Game.BUBBLE_RADIUS;
	
	    this.bubbles.push(this.shootingBubble);
	    this.popBubbles(this.shootingBubble);
	  }
	};
	
	Game.prototype.stickBubble = function(otherBubble){
	  this.bubbleShot = false;
	
	  var theta = Math.atan(
	    (otherBubble.pos[1] - this.shootingBubble.pos[1]) /
	      (this.shootingBubble.pos[0] - otherBubble.pos[0])
	  );
	
	  if (theta < 0) {
	    if (this.shootingBubble.pos[0] > otherBubble.pos[0]) {
	      theta+=2*Math.PI;
	    } else {
	      theta+=Math.PI;
	    }
	  } else {
	    if (this.shootingBubble.pos[0] < otherBubble.pos[0]) {
	      theta+=Math.PI;
	    }
	  }
	
	  if (theta >= 11*Math.PI/6 || theta <= Math.PI/6) {
	    //DIRECTLY TO THE RIGHT
	    this.shootingBubble.pos[0] = otherBubble.pos[0] + 2*Game.BUBBLE_RADIUS;
	    this.shootingBubble.pos[1] = otherBubble.pos[1];
	  } else if (theta <= 3*Math.PI/6) {
	    //UP AND TO THE RIGHT
	    this.shootingBubble.pos[0] = otherBubble.pos[0] + Game.BUBBLE_RADIUS;
	    this.shootingBubble.pos[1] =
	      otherBubble.pos[1] - Game.BUBBLE_RADIUS*2 + Game.BUBBLE_GAP;
	  } else if (theta <= 5*Math.PI/6) {
	    //UP AND TO THE LEFT
	    this.shootingBubble.pos[0] = otherBubble.pos[0] - Game.BUBBLE_RADIUS;
	    this.shootingBubble.pos[1] =
	    otherBubble.pos[1] - Game.BUBBLE_RADIUS*2 + Game.BUBBLE_GAP;
	  } else if (theta <= 7*Math.PI/6) {
	    //DIRECTLY TO THE LEFT
	    this.shootingBubble.pos[0] = otherBubble.pos[0] - 2*Game.BUBBLE_RADIUS;
	    this.shootingBubble.pos[1] = otherBubble.pos[1];
	  } else if (theta <= 9*Math.PI/6) {
	    //DOWN AND TO THE LEFT
	    this.shootingBubble.pos[0] = otherBubble.pos[0] - Game.BUBBLE_RADIUS;
	    this.shootingBubble.pos[1] =
	    otherBubble.pos[1] + Game.BUBBLE_RADIUS*2 - Game.BUBBLE_GAP;
	  } else {
	    //DOWN AND TO THE RIGHT
	    this.shootingBubble.pos[0] = otherBubble.pos[0] + Game.BUBBLE_RADIUS;
	    this.shootingBubble.pos[1] =
	      otherBubble.pos[1] + Game.BUBBLE_RADIUS*2 - Game.BUBBLE_GAP;
	  }
	
	  // if (theta >= 15*Math.PI/8 || theta <= Math.PI/8) {
	  //   //DIRECTLY TO THE RIGHT
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0] + 2*Game.BUBBLE_RADIUS;
	  //   this.shootingBubble.pos[1] = otherBubble.pos[1];
	  // } else if (theta <= 3*Math.PI/8) {
	  //   //UP AND TO THE RIGHT
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0] + Game.BUBBLE_RADIUS;
	  //   this.shootingBubble.pos[1] =
	  //     otherBubble.pos[1] - Game.BUBBLE_RADIUS*2 + Game.BUBBLE_GAP;
	  // } else if (theta <= 5*Math.PI/8) {
	  //   //DIRECTLY ABOVE
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0];
	  //   this.shootingBubble.pos[1] = otherBubble.pos[1] - 2*Game.BUBBLE_RADIUS;
	  // } else if (theta <= 7*Math.PI/8) {
	  //   //UP AND TO THE LEFT
	  //   console.log('up to the left');
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0] - Game.BUBBLE_RADIUS;
	  //   this.shootingBubble.pos[1] =
	  //     otherBubble.pos[1] - Game.BUBBLE_RADIUS*2 + Game.BUBBLE_GAP;
	  // } else if (theta <= 9*Math.PI/8) {
	  //   //DIRECTLY TO THE LEFT
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0] - 2*Game.BUBBLE_RADIUS;
	  //   this.shootingBubble.pos[1] = otherBubble.pos[1];
	  // } else if (theta <= 11*Math.PI/8) {
	  //   //DOWN AND TO THE LEFT
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0] - Game.BUBBLE_RADIUS;
	  //   this.shootingBubble.pos[1] =
	  //     otherBubble.pos[1] + Game.BUBBLE_RADIUS*2 - Game.BUBBLE_GAP;
	  // } else if (theta <= 13*Math.PI/8) {
	  //   //DIRECTLY BELOW
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0];
	  //   this.shootingBubble.pos[1] = otherBubble.pos[1] + 2*Game.BUBBLE_RADIUS;
	  // } else {
	  //   //DOWN AND TO THE RIGHT
	  //   this.shootingBubble.pos[0] = otherBubble.pos[0] + Game.BUBBLE_RADIUS;
	  //   this.shootingBubble.pos[1] =
	  //     otherBubble.pos[1] + Game.BUBBLE_RADIUS*2 - Game.BUBBLE_GAP;
	  // }
	
	  this.bubbles.push(this.shootingBubble);
	  this.popBubbles(this.shootingBubble);
	  this.rotateShootingBubbles();
	};
	
	Game.prototype.rotateShootingBubbles = function () {
	  this.onDeckBubbles[1].pos = this.onDeckBubbles[0].pos;
	  this.onDeckBubbles[0].pos = Game.SHOOTING_POS;
	  this.shootingBubble = this.onDeckBubbles.shift();
	
	  this.addOnDeckBubble(new Bubble({
	    game: this,
	    pos: [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95],
	    radius: Game.BUBBLE_RADIUS,
	    color: this.bubbleColors[
	      Math.floor(Math.random()*this.bubbleColors.length)]
	  }));
	};
	
	Game.prototype.shootBubble = function (e) {
	  if (this.fallingBubbles > 0 || this.bubblesPopping > 0 || this.bubbleShot) {
	    console.log('bubbles are falling/popping!');
	    return null;
	  }
	
	  var theta = Math.atan(
	    (e.offsetY - this.shootingBubble.pos[1]) /
	      (e.offsetX - this.shootingBubble.pos[0])
	  );
	
	  console.log(e.layerX);
	
	  var magnitude = 25;
	
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
	
	Game.prototype.hitWall = function (pos) {
	  return (pos[0] <= Game.BUBBLE_RADIUS ||
	    pos[0] > Game.DIM_X - Game.BUBBLE_RADIUS);
	};
	
	Game.prototype.popBubbles = function (shootingBubble) {
	
	  var bubbleCluster = [];
	  var newTouchingBubbles = [shootingBubble];
	
	  while (newTouchingBubbles.length > 0) {
	    var bubble = newTouchingBubbles.shift();
	    bubbleCluster.push(bubble);
	
	    var allTouchingBubbles = this.touchingBubbles(bubble);
	    for (var i = 0; i < allTouchingBubbles.length; i++) {
	      if (bubble.color === allTouchingBubbles[i].color &&
	        bubbleCluster.indexOf(allTouchingBubbles[i]) === -1 &&
	        newTouchingBubbles.indexOf(allTouchingBubbles[i]) === -1) {
	        newTouchingBubbles.push(allTouchingBubbles[i]);
	      }
	    }
	  }
	
	  if (bubbleCluster.length >= 3) {
	    for (var j = 0; j < bubbleCluster.length; j++) {
	      bubbleCluster[j].remove();
	    }
	
	    window.setTimeout(function(){
	      this.removeStrandedBubbles();
	    }.bind(this), 400);
	  }
	
	  this.colorCheck();
	};
	
	Game.prototype.touchingBubbles = function (bubble) {
	  var touchingBubbles = [];
	  for (var i = 0; i < this.bubbles.length; i++) {
	    if (bubble.isTouching(this.bubbles[i])) {
	      touchingBubbles.push(this.bubbles[i]);
	    }
	  }
	  return touchingBubbles;
	};
	
	Game.prototype.animateBubblePops = function (bubble, innerBubble) {
	  bubble.radius *= 1.02;
	  innerBubble.radius += 3;
	  if (bubble.radius < Game.BUBBLE_RADIUS*1.20 || innerBubble.radius < Game.BUBBLE_RADIUS*.75) {
	    requestAnimationFrame(function(){
	      this.animateBubblePops(bubble, innerBubble);
	    }.bind(this));
	  } else {
	    this.bubbles.splice(this.bubbles.indexOf(bubble),1);
	    this.innerBubbles.splice(this.innerBubbles.indexOf(innerBubble),1);
	    this.bubblesPopping -= 1;
	    if (this.fallingBubbles > 0) {
	      this.fallingBubbles -= 1;
	    }
	  }
	};
	
	Game.prototype.remove = function (bubble) {
	  this.bubblesPopping += 1;
	  var innerBubbleOptions = {
	    color: Game.BACKGROUND_COLOR,
	    pos: bubble.pos,
	    radius: 0,
	    vel: [0,0]
	  };
	  var innerBubble = new Bubble(innerBubbleOptions);
	  this.innerBubbles.push(innerBubble);
	
	  this.animateBubblePops(bubble, innerBubble);
	  // this.bubbles.splice(this.bubbles.indexOf(bubble),1);
	};
	
	Game.prototype.animateStrandedBubblePop = function (bubble, innerBubble) {
	  if (bubble.pos[1] < Game.SHOOTING_POS[1]) {
	    console.log(bubble.vel[1]);
	    bubble.pos[1] *= 1.015;
	    requestAnimationFrame(function(){
	      this.animateStrandedBubblePop(bubble);
	    }.bind(this));
	  } else {
	    this.remove(bubble);
	  }
	};
	
	Game.prototype.removeStrandedBubble = function (bubble) {
	  this.fallingBubbles += 1;
	  this.animateStrandedBubblePop(bubble);
	};
	
	Game.prototype.colorCheck = function () {
	  var colorCount = [];
	  for (var i = 0; i < this.bubbleColors.length; i++) {
	    var count = 0;
	    for (var j = 0; j < this.allBubbles().length; j++) {
	      if (this.bubbleColors[i] === this.allBubbles()[j].color) {
	        count+=1;
	      }
	    }
	    colorCount.push(count);
	  }
	
	  for (var k = 0; k < colorCount.length; k++) {
	    if (colorCount[k] === 0) {
	      this.bubbleColors.splice(k, 1);
	    }
	  }
	};
	
	Game.prototype.removeStrandedBubbles = function () {
	  var bubbleCluster = [];
	  var newTouchingBubbles = [];
	
	  for (var i = 0; i < this.bubbles.length; i++) {
	    if (this.bubbles[i].pos[1] <= Game.BUBBLE_RADIUS) {
	      newTouchingBubbles.push(this.bubbles[i]);
	    }
	  }
	
	  while (newTouchingBubbles.length > 0) {
	    var bubble = newTouchingBubbles.shift();
	    bubbleCluster.push(bubble);
	
	    var allTouchingBubbles = this.touchingBubbles(bubble);
	    for (var j = 0; j < allTouchingBubbles.length; j++) {
	      if (bubbleCluster.indexOf(allTouchingBubbles[j]) === -1 &&
	        newTouchingBubbles.indexOf(allTouchingBubbles[j]) === -1) {
	        newTouchingBubbles.push(allTouchingBubbles[j]);
	      }
	    }
	  }
	
	  var strandedBubbleCount = this.bubbles.length - bubbleCluster.length;
	  // while (strandedBubbleCount > 0) {
	  for (var k = 0; k < this.bubbles.length; k++) {
	    if (bubbleCluster.indexOf(this.bubbles[k]) === -1) {
	      console.log(k);
	      console.log(this.bubbles[k]);
	      this.bubbles[k].removeStrandedBubble();
	    }
	  }
	  strandedBubbleCount -= 1;
	  // }
	};
	
	module.exports = Game;
	window.game = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Game = __webpack_require__(1);
	
	var DEFAULTS = {
	  COLORS: ["#008744", "#0057e7", "#d62d20", "#ffa700", "#fff4e6"],
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  distance: function (pos1, pos2){
	    return Math.sqrt(
	      Math.pow(pos1[0]-pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map