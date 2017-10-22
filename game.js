//game logic

var cnvs = document.getElementById("c");
var ctx = cnvs.getContext('2d');

var snakeUpImg = document.getElementById("snake-up-img");
var snakeDownImg = document.getElementById("snake-down-img");
var snakeLeftImg = document.getElementById("snake-left-img");
var snakeRightImg = document.getElementById("snake-right-img");
var sushiImg = document.getElementById("sushi-img");
var rotSushiImg = document.getElementById("rot-sushi-img");

var headImg = snakeUpImg;
var foodImg = sushiImg;

var rotIsPresent = false;

var playGame = true;
var foodPresent = false;
var points = 0;
var gameSpeed = 100;
var multi = 0.8;
var bounce = false;
var timerDefault = 3;
var timer = timerDefault;

var bgColor = "rgb(255,255,255)";
var defaultBgColor = "rgb(255,255,255)";

var r = 255;
var maxR = 255;
var minR = 150;
var defaultR = 255;
var bounceCount = 0;

var snake = new Snake();

var toDark = false;

var keyInput = ['up'];

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
      if(e.keyCode == 37 && snake.facing != 'right' && playGame){
        if(snake.isInfected){
          setInput('right');
        } else {
          setInput('left');
        }
      } //left
      else if(e.keyCode == 38 && snake.facing != 'down' && playGame){
        if(snake.isInfected){
          setInput('down');
        } else {
          setInput('up');
        }
      } //up
      else if(e.keyCode == 39 && snake.facing != 'left' && playGame){
        if(snake.isInfected){
          setInput('left');
        } else {
          setInput('right');
        }
      } //right
      else if(e.keyCode == 40 && snake.facing != 'up' && playGame){
        if(snake.isInfected){
          setInput('up');
        } else {
          setInput('down');
        }
      } //down
      else if(e.keyCode == 32 && !playGame){restart();} //restart game
      else if(e.keyCode == 81 ){snake.isInfected = true;} //restart game
  })
}

function setPos(object, xID, yID){
  object.xID = xID;
  object.yID = yID;
  object.x = xID * gridSize;
  object.y = yID * gridSize;
}

function render(){
  ctx.fillStyle= "white";
  ctx.fillRect(0,0,cnvs.width, cnvs.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0,0,cnvs.width, cnvs.height);
  ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize)

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
  //reset color
  r = 255;
  deleteBody(snake);
  snake.snakeBody.push(new SnakeBody(snake.xID, snake.yID+1));
}

//mangan syek
function update(){
  if(playGame){
    changeDir();
    move();
  }
  if(snake.xID == food.xID && snake.yID == food.yID){
    if(rotIsPresent){
      timer = timerDefault;
      rotIsPresent = false;
      console.log(food);
      snake.isInfected = true;
    }
    addBody(snake);
    darken();
    putFood();
    points++;
  }
  document.getElementById('points').innerHTML = points;

  var brightness = (r / defaultR * 100 );
  brightness = brightness.toFixed(1);
  document.getElementById('brightness').innerHTML = brightness + "%";

  if(snake.isInfected){
    document.getElementById('timer').style.display = "initial";
    timer -= 0.1
    timer = timer.toFixed(1);
    document.getElementById('timer').innerHTML = timer;
    document.getElementsByClassName('container')[0].style.backgroundColor = "rgb(24, 187, 74)";
    if(timer <= 0){
      snake.isInfected = false;
      timer = timerDefault;
      document.getElementById('timer').style.display = "none";
      document.getElementsByClassName('container')[0].style.backgroundColor = "rgb(55, 66, 77)";
    }
  }
}

//direction
function move(){
  var dx = 0;
  var dy = 0;
  if(snake.facing == "left" && snake.xID - 1 >= 0 && playGame){
    dx = -1;
    snake.facing = "left";
    playGame = checkBodyHit(snake.xID + dx, snake.yID + dy);
  }// left
  else if(snake.facing == "up" && snake.yID - 1 >= 0 && playGame){
    dy = -1;
    snake.facing = "up";
    playGame = checkBodyHit(snake.xID + dx, snake.yID + dy);
  }// up
  else if(snake.facing == "right" && snake.xID + 1 < gridCount && playGame){
    dx = 1;
    snake.facing = "right";
    playGame = checkBodyHit(snake.xID + dx, snake.yID + dy);
  }// right
  else if(snake.facing == "down" && snake.yID + 1 < gridCount && playGame){
    dy = 1;
    snake.facing = "down";
    playGame = checkBodyHit(snake.xID + dx, snake.yID + dy);
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

function changeDir(){
  var nextMove;
  if(keyInput.length != 0){
    nextMove = keyInput.shift();
  }
  else{
    nextMove = snake.facing;
  }

  snake.facing = nextMove;
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

function setInput(face){
  if(face == 'left' || face == 'right'){
    if(keyInput.length == 0){
      if(snake.facing == 'up' || snake.facing == 'down'){
        keyInput.push(face);
      }
    }
    else if(keyInput[keyInput.length-1] == 'down' || keyInput[keyInput.length-1] == 'up' ){
      keyInput.push(face);
    }
  }
  else{
    if(keyInput.length == 0){
      if(snake.facing == 'left' || snake.facing == 'right'){
        keyInput.push(face);
      }
    }
    else if(keyInput[keyInput.length-1] == 'left' || keyInput[keyInput.length-1] == 'right' ){
      keyInput.push(face);
    }
  }
}

function darken(){
  r = Math.floor(r * 0.8);
  bgColor = "rgba(0,0,0," + (1-(r/255)).toFixed(2) + ")";

  console.log(bgColor);
  console.log(1-(r/255));
  // document.getElementById("c").style.backgroundColor = bgColor;
}

function checkBodyHit(x, y){
  if(!grids[x][y]) return false;
  else return true;
}

function chance(x){
  return Math.random() < x;
}
