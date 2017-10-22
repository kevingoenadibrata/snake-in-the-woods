//Snake Object
var snake = new Snake();

function Snake(){
  //position
  this.x = 0;
  this.y = 0;

  //id
  this.xID = 0;
  this.yID = 0;

  this.isInfected = false;

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
  snake.snakeBody.push(new SnakeBody());
}

function deleteBody(snake){
  // for(var i = 0; i < snake.snakeBody.length - 1 ; i++){
  //   var snek = snake.snakeBody[i];
  // }
  snake.snakeBody = [];
}
