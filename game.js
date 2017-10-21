//game logic

var cnvs = document.getElementById("c");
var ctx = cnvs.getContext('2d');

var playGame = true;
var foodPresent = false;
var gridSize = 32;
var points = 0;

var bgColor = "rgb(255,255,255)";

function setup(){
  keyListener();
  initGrids();
  putFood();
  cnvs.width = 640;
  cnvs.height = 640;
  setPos(snake, 6, 6);
  render();
  setInterval(update, 100);

}

function keyListener(){
  window.addEventListener('keydown', function (e) {
      if(e.keyCode == 37 && playGame){if(snake.facing != 'right')changeDir('left');} //left
      else if(e.keyCode == 38 && playGame){if(snake.facing != 'down')changeDir('up');} //up
      else if(e.keyCode == 39 && playGame){if(snake.facing != 'left')changeDir('right');} //right
      else if(e.keyCode == 40 && playGame){if(snake.facing != 'up')changeDir('down');} //down
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
  ctx.fillStyle = snake.color;
  ctx.fillRect(snake.x, snake.y, gridSize, gridSize);
  renderSnakeBody();

  renderGrids();
}

function restart(){
  playGame = true;
  setPos(snake, 6, 6);
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
  oldSnakeXID = snake.x;
  oldSnakeYID = snake.y;
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
}
