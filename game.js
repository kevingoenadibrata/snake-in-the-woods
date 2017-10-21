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
var points = 0;
var gameSpeed = 100;

var bgColor = "rgb(255,255,255)";
var defaultBgColor = "rgb(255,255,255)";

var r = 255;
var g = 255;
var b = 255;

var snake = new Snake();


function setup(){

  keyListener();
  initGrids();
  putFood();
  cnvs.width = 640;
  cnvs.height = 640;
  setPos(snake, 10, 10);
  snake.snakeBody.push(new SnakeBody(snake.xID, snake.yID+1));
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
  for(var i = 0; i < snake.snakeBody.length; i++){
    console.log("masuk kok");
    ctx.fillStyle = snake.snakeBody[i].color;
    ctx.fillRect(snake.snakeBody[i].x, snake.snakeBody[i].y, gridSize, gridSize);
  }
  renderGrids();
}

function restart(){
  playGame = true;
  setPos(snake, 10, 10);
  changeDir('up');
  render();
  points = 0;
  bgColor = defaultBgColor;
  putFood();
  deleteBody(snake);
}

//mangan syek
function update(){
  if(playGame) move();
  if(snake.xID == food.xID && snake.yID == food.yID){
    addBody(snake);
    darken();
    putFood();
    points++;
  }
  document.getElementById('points').innerHTML = points;
}

//direction
function move(){
  var dx = 0;
  var dy = 0;
  if(snake.facing == "left" && snake.xID - 1 >= 0 && playGame){
    dx = -1;
    snake.facing = "left";
  }// left
  else if(snake.facing == "up" && snake.yID - 1 >= 0 && playGame){
    dy = -1;
    snake.facing = "up";
  }// up
  else if(snake.facing == "right" && snake.xID + 1 < gridCount && playGame){
    dx = 1;
    snake.facing = "right";
  }// right
  else if(snake.facing == "down" && snake.yID + 1 < gridCount && playGame){
    dy = 1;
    snake.facing = "down";
  }//down
  else{
    //gameOver
    playGame = false;
    //console.log('game over!');
  }

  if(playGame){
    // move
    for(var i = snake.snakeBody.length-1; i >= 1; i--){
      setPos(snake.snakeBody[i], snake.snakeBody[i-1].xID, snake.snakeBody[i-1].yID)
    }
    setPos(snake.snakeBody[0], snake.xID, snake.yID);
    setPos(snake, snake.xID+dx, snake.yID+dy);
    render();
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

function darken(){
  r = Math.floor(r * 0.9);
  g = Math.floor(g * 0.9);
  b = Math.floor(b * 0.9);
  bgColor = "rgb(" + r + "," + g + "," + b + ")";
  console.log(bgColor);
  // document.getElementById("c").style.backgroundColor = bgColor;
}
