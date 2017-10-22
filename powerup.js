
var powerUpPresent = false;
var powerUp = new powerUp();

function powerUp(){
  this.x = 0;
  this.y = 0;

  this.xID = 0;
  this.yID = 0;

  this.color = "rgb(207, 160, 56)";
}

function putPowerUp(){
  var xPos, yPos;
  do{
    xPos = Math.floor(Math.random() * gridCount);
    yPos = Math.floor(Math.random() * gridCount);
  } while(!grids[xPos][yPos]);
  powerUpPresent = true;
  setPos(powerUp, xPos, yPos);
}
