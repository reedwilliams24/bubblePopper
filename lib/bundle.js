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
	  // canvasEl.addEventListener('click', game.shootBubble.bind(game), false);
	  new GameView(game, ctx).start();
	
	  var $gameInfo = $('.gameInfo');
	  var $scoreBoard = $('.gameScoreContainer');
	
	  $('<label id="scoreValue">0 points</label>').appendTo($gameInfo);
	
	  $('<input id="restart" type="button" value="restart" />').click(function(){
	    game.reset();
	    $('#restart').blur();
	  }).appendTo($gameInfo);
	  // $('<input id="solve" type="button" value="solve" />').click(function(){
	  //   // game = new Game($root);
	  // }).appendTo($gameInfo);
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
	  //this.bubbleColors = ["#008000", "#00BCD4", "#d62d20", "#ffa700", "#fff4e6"];
	  this.bubbleColors = ["#0056A8", "#FDFFFC", "#32936F", "#E83F6F", "#FF9F1C"];
	  // #29B6F6
	  // 0057e7
	  this.onDeckBubbles = [];
	  this.innerBubbles = [];
	  this.fallingBubbles = 0;
	  this.bubblesPopping = 0;
	  this.points = 0;
	  this.pointerAngle = 90;
	  this.pointerPosition = [300, 0];
	  this.angleInterval = 0;
	  this.addBubbles();
	};
	
	Game.BACKGROUND_COLOR = "grey";
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_BUBBLES = 12;
	Game.NUM_ROWS = 6 ;
	Game.BUBBLE_RADIUS = 21;
	Game.DIM_X = Game.NUM_BUBBLES*Game.BUBBLE_RADIUS*2;
	Game.BUBBLE_GAP = Game.BUBBLE_RADIUS/2*Math.cos(45);
	Game.SHOOTING_POS = [Game.DIM_X/2,Game.DIM_Y*.9];
	Game.ON_DECK_ONE_POS = [Game.DIM_X*.35,Game.DIM_Y*.95];
	Game.ON_DECK_TWO_POS = [Game.DIM_X*.35-Game.BUBBLE_RADIUS*2-5,Game.DIM_Y*.95];
	
	Game.prototype.reset = function () {
	  this.bubbles = [];
	  this.shootingBubble = null;
	  this.bubbleShot = false;
	  this.bubbleColors = ["#0056A8", "#FDFFFC", "#32936F", "#E83F6F", "#FF9F1C"];
	  this.onDeckBubbles = [];
	  this.innerBubbles = [];
	  this.fallingBubbles = 0;
	  this.bubblesPopping = 0;
	  this.points = 0;
	  this.pointerAngle = 90;
	  this.angleInterval = 0;
	  this.gameOver = false;
	
	  $('#scoreValue').text(this.points.toString() + " points");
	  $('#winnerBanner').remove();
	  $('#loserBanner').remove();
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
	
	  //Background image
	  var image = document.getElementById('backgroundImage');
	  var image2 = document.getElementById('backgroundImage2');
	  var image3 = document.getElementById('backgroundImage3');
	  var image4 = document.getElementById('backgroundImage4');
	
	  // ctx.drawImage(image, 0, -100);
	  // ctx.drawImage(image2, -150, 0, Game.DIM_X + 325, Game.DIM_Y + 200);
	  // ctx.drawImage(image2, 0, 0, 852*1.3, 480*1.3);
	  // ctx.drawImage(image3, 0, -100);
	  ctx.drawImage(image4, -70, 0);
	
	  this.allBubbles().forEach(function(bubble){
	    bubble.draw(ctx);
	  });
	
	  var y = 50 * Math.sin(this.pointerAngle*Math.PI/180);
	  var x = -50 * Math.cos(this.pointerAngle*Math.PI/180);
	  this.pointerPosition = [Game.SHOOTING_POS[0] + x, Game.SHOOTING_POS[1] - y];
	
	  ctx.beginPath();
	  ctx.moveTo(Game.SHOOTING_POS[0], Game.SHOOTING_POS[1]);
	  ctx.lineTo(this.pointerPosition[0], this.pointerPosition[1]);
	  ctx.stroke();
	
	};
	
	Game.prototype.step = function (delta) {
	  if (this.fallingBubbles === 0 && this.bubblesPopping === 0 && !this.gameOver) {
	    this.moveBubble(delta);
	    this.checkCollisions();
	  }
	  if (this.bubbles.length === 0 && !this.gameOver) {
	    this.gameOver = true;
	    $('h2').after("<p id=winnerBanner>Winner!</p>");
	  }
	};
	
	Game.prototype.moveBubble = function (delta) {
	  if (this.bubbleShot && this.fallingBubbles === 0 &&
	    this.bubblesPopping === 0) {
	    this.shootingBubble.move(delta);
	  }
	
	};
	
	Game.prototype.checkCollisions = function () {
	
	  for (var i = 0; i < this.bubbles.length; i++) {
	    if (this.shootingBubble.isCollidedWith(this.bubbles[i])) {
	      this.stickBubble(this.bubbles[i]);
	      break;
	    }
	  }
	
	  if (this.shootingBubble.pos[1] <= Game.BUBBLE_RADIUS*2) {
	    this.stickBubbleToTop();
	  }
	};
	
	Game.prototype.stickBubbleToTop = function () {
	  this.bubbleShot = false;
	  var directionBoost = 0;
	
	  if (this.shootingBubble.vel[0] < 0) {
	    directionBoost -= this.shootingBubble.radius;
	  } else {
	    directionBoost += this.shootingBubble.radius;
	  }
	
	  this.shootingBubble.pos[0] = directionBoost+Game.BUBBLE_RADIUS*2*(
	    Math.round((this.shootingBubble.pos[0])/(Game.BUBBLE_RADIUS*2)));
	  this.shootingBubble.pos[1] = Game.BUBBLE_RADIUS;
	
	  this.bubbles.push(this.shootingBubble);
	  this.popBubbles(this.shootingBubble);
	  this.rotateShootingBubbles();
	};
	
	Game.prototype.stickBubble = function(otherBubble){
	  this.bubbleShot = false;
	
	  var theta = Math.atan(
	    (otherBubble.pos[1] - this.shootingBubble.pos[1]) /
	      (this.shootingBubble.pos[0] - otherBubble.pos[0])
	  );
	
	  if (this.shootingBubble.pos[0] === otherBubble.pos[0]) {
	
	    this.shootingBubble.pos[0] += [-1,1][Math.round(Math.random())];
	
	    theta = Math.atan(
	      (otherBubble.pos[1] - this.shootingBubble.pos[1]) /
	        (this.shootingBubble.pos[0] - otherBubble.pos[0])
	    );
	  }
	
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
	
	  this.bubbles.push(this.shootingBubble);
	  this.popBubbles(this.shootingBubble);
	  this.rotateShootingBubbles();
	
	  for (var i = 0; i < this.bubbles.length; i++) {
	    if (this.bubbles[i].pos[1] >= Game.SHOOTING_POS[1] - Game.BUBBLE_RADIUS) {
	      this.gameOver = true;
	      $('h2').after("<p id=loserBanner>Game Over</p>");
	      break;
	    }
	  }
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
	
	Game.prototype.shootBubble = function () {
	  if (this.fallingBubbles > 0 || this.bubblesPopping > 0 || this.bubbleShot) {
	    return null;
	  }
	
	  var theta = Math.atan(
	    (this.pointerPosition[1] - this.shootingBubble.pos[1]) /
	      (this.pointerPosition[0] - this.shootingBubble.pos[0])
	  );
	
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
	  return (pos[0] <= Game.BUBBLE_RADIUS*2 ||
	    pos[0] > Game.DIM_X - Game.BUBBLE_RADIUS*2);
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
	
	    this.updateScore(5*bubbleCluster.length+(bubbleCluster.length-3)*10);
	
	    window.setTimeout(function(){
	      this.removeStrandedBubbles();
	      this.colorCheck();
	    }.bind(this), 400);
	  } else {
	    this.colorCheck();
	  }
	
	};
	
	Game.prototype.updateScore = function (points) {
	  this.points += points;
	  $('#scoreValue').text(this.points.toString() + " points");
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
	  var popColor;
	  if (bubble.pos[1] <= 415) {
	    popColor = "#97F0FE";
	  } else {
	    popColor = '#79D33E';
	  }
	  var innerBubbleOptions = {
	    color: popColor,
	    pos: bubble.pos,
	    radius: 0,
	    vel: [0,0]
	  };
	  var innerBubble = new Bubble(innerBubbleOptions);
	  this.innerBubbles.push(innerBubble);
	
	  this.animateBubblePops(bubble, innerBubble);
	};
	
	Game.prototype.animateStrandedBubblePop = function (bubble, innerBubble) {
	  if (bubble.pos[1] < Game.SHOOTING_POS[1]) {
	    bubble.pos[1] *= 1.020;
	    requestAnimationFrame(function(){
	      this.animateStrandedBubblePop(bubble);
	    }.bind(this));
	  } else {
	    this.updateScore(10);
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
	
	  for (var k = 0; k < this.bubbles.length; k++) {
	    if (bubbleCluster.indexOf(this.bubbles[k]) === -1) {
	      this.bubbles[k].removeStrandedBubble();
	    }
	  }
	  strandedBubbleCount -= 1;
	};
	
	Game.prototype.handleKeyDownEvent = function (key) {
	  if (key === "Left" || key === "Right") {
	    this.startRotatingAngle(key);
	  } else {
	    this.shootBubble();
	  }
	};
	
	Game.prototype.handleKeyUpEvent = function (key) {
	  if (key === "Left" || key === "Right") {
	    this.stopRotatingAngle(key);
	  } else {
	    this.shootBubble();
	  }
	};
	
	Game.prototype.startRotatingAngle = function (direction) {
	  if (direction === "Left" && this.angleInterval === 0) {
	    this.angleInterval = setInterval(function(){
	      this.pointerAngle = Math.max(this.pointerAngle-.20, 5);
	    }.bind(this), 1);
	  } else if (direction === "Right" && this.angleInterval === 0){
	    this.angleInterval = setInterval(function(){
	      this.pointerAngle = Math.min(this.pointerAngle+.20, 175);
	    }.bind(this), 1);
	  }
	
	};
	
	Game.prototype.stopRotatingAngle = function (direction) {
	  clearInterval(this.angleInterval);
	  this.angleInterval = 0;
	};
	
	module.exports = Game;
	window.game = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Game = __webpack_require__(1);
	
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
	  $(window).on("keydown", this.handleKeyEvent.bind(this));
	  $(window).on("keyup", this.handleKeyEvent.bind(this));
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
	  if (e.type === "keydown") {
	    if (GameView.KEYS[e.keyCode]) {
	      this.game.handleKeyDownEvent(GameView.KEYS[e.keyCode]);
	    }
	  } else {
	    if (GameView.KEYS[e.keyCode] && GameView.KEYS[e.keyCode]!="Space") {
	      this.game.handleKeyUpEvent(GameView.KEYS[e.keyCode]);
	    }
	  }
	
	};
	
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map