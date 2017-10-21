//game logic

var cnvs = document.getElementById("c");
var ctx = cnvs.getContext('2d');

var snakeUpImg = document.getElementById("snake-up-img");
var snakeDownImg = document.getElementById("snake-down-img");
var snakeLeftImg = document.getElementById("snake-left-img");
var snakeRightImg = document.getElementById("snake-right-img");
var headImg = snakeUpImg;

var playGame = true;
var foodPresent = false;
var gridSize = 32;
var points = 0;
var gameSpeed = 300;
var headAngle = 180;

var bgColor = "rgb(255,255,255)";

function setup(){
  keyListener();
  initGrids();
  putFood();
  cnvs.width = 640;
  cnvs.height = 640;
  setPos(snake, 10, 10);
  render();
  setInterval(update, gameSpeed);

}

function keyListener(){
  window.addEventListener('keydown', function (e) {
      if(e.keyCode == 37 && snake.facing != 'right' && playGame){changeDir('left');} //left
      else if(e.keyCode == 38 && snake.facing != 'down' && playGame){changeDir('up');} //up
      else if(e.keyCode == 39 && snake.facing != 'left' && playGame){changeDir('right');} //right
      else if(e.keyCode == 40 && snake.facing != 'up' && playGame){changeDir('down');} //down
      else if(e.keyCode == 32 && !playGame){restart();} //restart game
  })
}

function setPos(object, xID, yID){
  object.xID = xID;
  object.yID = yID;
  object.x = xID * gridSize;
  object.y = yID * gridSize;
}

function render(){
  ctx.fillStyle = bgColor;
  ctx.fillRect(0,0,cnvs.width, cnvs.height);
  ctx.fillStyle = food.color;
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
  // ctx.fillStyle = snake.color;
  // ctx.fillRect(snake.x, snake.y, gridSize, gridSize);
  ctx.drawImage(headImg, snake.x, snake.y, gridSize, gridSize);


  renderGrids();
}

function restart(){
  playGame = true;
  setPos(snake, 10, 10);
  changeDir('up');
  render();
}

function update(){
  move();
  if(snake.xID == food.xID && snake.yID == food.yID){
    putFood();
    points++;
    document.getElementById('points').innerHTML = points;
  }
}
//direction
function move(){
  if(snake.facing == "left" && snake.xID - 1 >= 0 && playGame){
    setPos(snake, snake.xID-1, snake.yID);
    snake.facing = "left";
    render();
  }// left
  else if(snake.facing == "up" && snake.yID - 1 >= 0 && playGame){
    setPos(snake, snake.xID, snake.yID-1);
    snake.facing = "up";
    render();
  }// up
  else if(snake.facing == "right" && snake.xID + 1 < gridCount && playGame){
    setPos(snake, snake.xID+1, snake.yID);
    snake.facing = "right";
    render();
  }// right
  else if(snake.facing == "down" && snake.yID + 1 < gridCount && playGame){
    setPos(snake, snake.xID, snake.yID+1);
    snake.facing = "down";
    render();
  }//down
  else{
    //gameOver
    playGame = false;
    console.log('game over!');
  }
}

function changeDir(face){
  snake.facing = face;
  if(snake.facing == "left"){
    headImg = snakeLeftImg;
  }// left
  else if(snake.facing == "up"){
    headImg = snakeUpImg;
  }// up
  else if(snake.facing == "right"){
    headImg = snakeRightImg;
  }// right
  else if(snake.facing == "down"){
    headImg = snakeDownImg;
  }//down
}
