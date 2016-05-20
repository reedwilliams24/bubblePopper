var Game = require('./game');
var GameView = require('./gameView');

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
