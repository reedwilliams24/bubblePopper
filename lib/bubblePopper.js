var Game = require('./game');
var GameView = require('./gameView');

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();
  canvasEl.addEventListener('click', game.shootBubble.bind(game), false);
  new GameView(game, ctx).start();
});
