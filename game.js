//game logic

var cnvs = document.getElementById("c");
var ctx = cnvs.getContext('2d');

var highScore = 0;

var snakeUpImg = document.getElementById("snake-up-img");
var snakeDownImg = document.getElementById("snake-down-img");
var snakeLeftImg = document.getElementById("snake-left-img");
var snakeRightImg = document.getElementById("snake-right-img");
var sushiImg = document.getElementById("sushi-img");
var rotSushiImg = document.getElementById("rot-sushi-img");
var powerupImg = document.getElementById("power-up-img");
var mapImg = document.getElementById("map-img");
var labelInf = document.getElementById("label-inf");

var rotChance = 0.1;
var toggleRot = false;

var headImg = snakeUpImg;
var foodImg = sushiImg;

var rotIsPresent = false;
var playGame = true;
var foodPresent = false;
var points = 0;
var gameSpeed = 100;
var multi = 0.8;
var timerDefault = 3;
var timer = timerDefault;
var checkPoint = 4;

var bgColor = "rgba(0,0,0,0)";
var defaultBgColor = "rgba(0,0,0,0)";

var counter = 1;

var r = 255;
var maxR = 255;
var minR = 150;
var defaultR = 255;
var bounceCount = 0;

var snake = new Snake();

var toDark = false;

var keyInput = ['up'];

function setup(){
  toggleRot = document.getElementById("toggleRot").checked;
  checkCookie();
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
  ctx.drawImage(mapImg, 0, 0, cnvs.width, cnvs.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0,0,cnvs.width, cnvs.height);
  ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize);
  ctx.drawImage(headImg, snake.x, snake.y, gridSize, gridSize);

  if(powerUpPresent){
    ctx.drawImage(powerupImg, powerUp.x, powerUp.y , gridSize, gridSize);
  }

  for(var i = 0; i < snake.snakeBody.length; i++){
    ctx.fillStyle = snake.snakeBody[i].color;
    ctx.fillRect(snake.snakeBody[i].x, snake.snakeBody[i].y, gridSize, gridSize);
  }
  renderGrids();
}

function restart(){
  toggleRot = document.getElementById("toggleRot").checked;
  if(!toggleRot){
    rotChance = 0;
  }
  playGame = true;
  setPos(snake, 10, 10);
  changeDir('up');
  render();
  points = 0;
  timer = timerDefault;
  rotIsPresent = false;
  powerUpPresent = false;
  bgColor = defaultBgColor;
  render();
  putFood();
  //reset color
  r = 255;
  deleteBody(snake);
  snake.snakeBody.push(new SnakeBody(snake.xID, snake.yID+1));
  food.isRot = 0;
  snake.infected = 0;
  labelInf.style.display = "none";
}

//mangan syek
function update(){
  if(!toggleRot){
    rotChance = 0;
  } else {
    rotChance = 0.1;
  }

  if(playGame){
    changeDir();
    move();
    disableSwitch();
  } else {
    enableSwitch();
  }

  if(points == checkPoint){
    if(!powerUpPresent && chance(0.5)){
      putPowerUp();
    }
    checkPoint += 4;
  }
  if(points > checkPoint) checkPoint += 4;

  if(snake.xID == powerUp.xID && snake.yID == powerUp.yID){
    r += 100;
    powerUpPresent = false;
    setPos(powerUp, -1, -1);
    darken();
  }

  if(snake.xID == food.xID && snake.yID == food.yID){
    if(rotIsPresent){
      timer = timerDefault;
      rotIsPresent = false;
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
    document.getElementById('timer').style.display = "block";
    labelInf.innerHTML ="INFECTED!";
    labelInf.style.display = "block";
    timer -= 0.1
    timer = timer.toFixed(1);
    document.getElementById('timer').innerHTML = timer;
    document.getElementsByClassName('container')[0].style.backgroundColor = "#0a8341";
    if(timer <= 0){
      snake.isInfected = false;
      timer = timerDefault;
      document.getElementById('timer').style.display = "none";
      labelInf.style.display = "none";
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
  }

  if(playGame){
    // move
    for(var i = snake.snakeBody.length-1; i >= 1; i--){
      setPos(snake.snakeBody[i], snake.snakeBody[i-1].xID, snake.snakeBody[i-1].yID)
    }
    setPos(snake.snakeBody[0], snake.xID, snake.yID);
    setPos(snake, snake.xID+dx, snake.yID+dy);
    render();
    disableSwitch();
  }
  else{
    bgColor = defaultBgColor;
    render();
    document.getElementById('timer').style.display = "none";
    labelInf.style.display = "none";

    labelInf.innerHTML ="GAME OVER</br>Press SPACE to play again";
    labelInf.style.display = "block";
    snake.isInfected = false;
    timer = timerDefault;
    document.getElementsByClassName('container')[0].style.backgroundColor = "rgb(55, 66, 77)";
    if(points > highScore) {
      setCookie("highScore", points, 365);
      highScore = points;
      document.getElementById("highScore").innerHTML = highScore;
    }
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


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function checkCookie() {
  highScore = getCookie("highScore");
  if (highScore != "") {
    highScore = getCookie("highScore");
  } else {
    highScore = 0;
    setCookie("highScore", 0, 365);
  }
  document.getElementById("highScore").innerHTML = highScore;
}

function darken(){
  r = Math.floor(r * 0.8);
  bgColor = "rgba(0,0,0," + (1-(r/255)).toFixed(2) + ")";

  // document.getElementById("c").style.backgroundColor = bgColor;
}

function checkBodyHit(x, y){
  if(!grids[x][y]) return false;
  else return true;
}

function chance(x){
  return Math.random() < x;
}

function disableSwitch(){
  document.getElementById("toggleRot").disabled = true;
}

function enableSwitch(){
  console.log("ENABLED");
  document.getElementById("toggleRot").disabled = false;
}