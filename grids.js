//grids
var grids = [];
var gridCount = 20;

function initGrids(){
  for( var i = 0; i < gridCount ; i++){
    grids.push([]);
    for( var j = 0 ; j < gridCount ; j++){
      grids[i].push(true);
    }
  }
}

function clearGrids(){
  for( var i = 0; i < gridCount ; i++){
    for( var j = 0 ; j < gridCount ; j++){
      grids[i][j] = true;
    }
  }
}

function renderGrids(){
  clearGrids();
  grids[snake.xID][snake.yID] = false; //head
  for(var i = 0; i < snake.snakeBody.size; i++){
    grids[snake.snakeBody.xID][snake.snakeBody.yID] = false;
  }
}

function drawGrids(){
  var string = "";
  for( var j = 0; j < gridCount ; j++){
    for( var i = 0 ; i < gridCount ; i++){
      if(grids[i][j]){
        string = string + "*";
      }
      else{
        string = string + "0";
      }
    }
    string = string + "\n";
  }
  console.log(string);
}
