
var foodEaten = 0;
var food = new Food();

function Food(){
  this.x = 0;
  this.y = 0;

  this.xID = 0;
  this.yID = 0;

  this.color = "rgb(207, 160, 56)";
}

function putFood(){
  var xPos, yPos;
  do{
    xPos = Math.floor(Math.random() * gridCount);
    yPos = Math.floor(Math.random() * gridCount);
  } while(!grids[xPos][yPos]);
  foodPresent = true;
  setPos(food, xPos, yPos);
}