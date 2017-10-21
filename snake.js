//Snake Object
var snake = new Snake();
var oldSnakeXID;
var oldSnakeYID;
function Snake(){
  //position
  this.x = 0;
  this.y = 0;

  //id
  this.xID = 0;
  this.yID = 0;

  this.color = "rgb(0,0,0)";

  this.facing = "up";

  this.snakeBody = [];
}

function SnakeBody(xID, yID){
  //position
  this.x = xID * gridSize;
  this.y = yID * gridSize;

  //id
  this.xID = xID;
  this.yID = yID;

  this.color = "rgb(0,0,0)";
}

//edit after defining grid ! TODO
function addBody(snake){
  snake.snakeBody.push(new SnakeBody(oldSnakeXID, oldSnakeYID));
}


function renderSnakeBody(){
  for(var i; i < snake.snakeBody.length ; i++){
    ctx.fillStyle = snake.color;
    ctx.fillRect(snake.snakeBody.x, snake.snakeBody.y, gridSize, gridSize);
  }
}