var board = new Array();
var conflicted = new Array();
var score = 0;

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
  forMobile();
  newgame();
});

function newgame() {
  //初始化棋盘格
  initGrid();
  //随机在两个格子生成数字
  generateOneNum();
  generateOneNum();
}

function forMobile() {

  if(documentWidth>500){
    gridWidth = 500;
    cellInterval = 20;
    cellSideLength = 100;
  }
  $("#grid").css("width", gridWidth - cellInterval*2);
  $("#grid").css("height", gridWidth - cellInterval*2);
  $("#grid").css("padding", cellInterval);
  $("#grid").css("border-radius", gridWidth * 0.02);
}

function initGrid() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridcell = $("#grid" + i + j); //用id获得相应的格子
      gridcell.css("top", getPosTop(i, j));
      gridcell.css("left", getPosLeft(i, j));
      gridcell.css("width", cellSideLength);
      gridcell.css("height", cellSideLength);
      gridcell.css("border-radius", cellSideLength * 0.02);
    }
  }
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    conflicted[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
      conflicted[i][j] = false;
    }

    score = 0;
  }

  updateScore(score);
  updateBoard();
}

function updateBoard() {
  $(".number-cell").remove();

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      $("#grid").append(
        '<div class="number-cell" id="number' + i + j + '"></div>'
      );

      var numbercell = $("#number" + i + j);

      if (board[i][j] == 0) {
        //若board为0，则不显示
        numbercell.css("width", "0px");
        numbercell.css("height", "0px");
        //放置中心
        numbercell.css("top", getPosTop(i, j) + cellSideLength/2);
        numbercell.css("left", getPosLeft(i, j) + cellSideLength/2);
      } else {
        //若board不为0，则显示
        numbercell.css("width", cellSideLength);
        numbercell.css("height", cellSideLength);
        numbercell.css("top", getPosTop(i, j));
        numbercell.css("left", getPosLeft(i, j));
        numbercell.css("background-color", getNumberBgColor(board[i][j]));
        numbercell.css("color", getNumberColor(board[i][j]));
        numbercell.css("font-size", getNumberFontSize(board[i][j]));
        numbercell.text(board[i][j]);
      }
      conflicted[i][j] = false;
    }
  }
  $('.number-cell').css("line-height",cellSideLength+'px');
}

function generateOneNum() {
  if (isNoSpace(board)) {
    return false;
  } else {
    //随机得到位置
    var haveSpace = new Array();
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          var temp = new Array(i, j);
          haveSpace.push(temp);
        }
      }
    }

    var pos = parseInt(Math.floor(Math.random() * haveSpace.length));
    var randx = haveSpace[pos][0];
    var randy = haveSpace[pos][1];

    //随机得到数字
    var randNum = Math.random() < 0.5 ? 2 : 4;
    board[randx][randy] = randNum;
    showNumAnime(randx, randy, randNum);
    return true;
  }
}

//用于监听键盘
$(document).keydown(function(event) {
  event.preventDefault();                   //取消了原来键盘的效果
  switch (event.keyCode) {
    case 37: //left
      if (moveLeft()) {
        setTimeout("generateOneNum()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 38: //up
      if (moveUp()) {
        setTimeout("generateOneNum()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
      s;
    case 39: //right
      if (moveRight()) {
        setTimeout("generateOneNum()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 40: //down
      if (moveDown()) {
        setTimeout("generateOneNum()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    default:
      //default
      break;
  }
});

//用于监听鼠标
document.addEventListener('touchstart',function(event){
  startx=event.touches[0].pageX;
  starty=event.touches[0].pageY;
});

//取消原来效果
document.addEventListener('touchmove',function(event){
  event.preventDefault();
})

document.addEventListener('touchend',function(event){
  endx=event.changedTouches[0].pageX;
  endy=event.changedTouches[0].pageY;

  var deltax = endx - startx;
  var deltay = endy - starty;

  //防止误触或点击BUG
  if(Math.abs(deltax)<0.1*documentWidth && (Math.abs(deltay)<0.1*documentWidth))
    return;

  //X方向进行
  if(Math.abs(deltax)>Math.abs(deltay)){
      if(deltax>0){
          //Right
          if (moveRight()) {
            setTimeout("generateOneNum()", 210);
            setTimeout("isgameover()", 300);
          }
      }else{
          //Left
          if (moveLeft()) {
            setTimeout("generateOneNum()", 210);
            setTimeout("isgameover()", 300);
          }
      }
  }else{
    if(deltay>0){
          //Down
          if (moveDown()) {
            setTimeout("generateOneNum()", 210);
            setTimeout("isgameover()", 300);
          }
    }else{
          //Up
          if (moveUp()) {
            setTimeout("generateOneNum()", 210);
            setTimeout("isgameover()", 300);
          }
    }
  }
});

function isgameover() {
  if (isNoSpace(board) && !canMove(board)) {
    gameover();
  }
}

function gameover() {
  alert("You loser!");
  newgame();
}

function moveLeft() {
  if (!canMoveLeft(board)) return false;

  for (var i = 0; i < 4; i++)
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          if (board[i][k] == 0 && noBlockHorizon(i, k, j, board)) {
            showMoveAnime(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[i][k] == board[i][j] &&
            noBlockHorizon(i, k, j, board) &&
            !conflicted[i][k]
          ) {
            showMoveAnime(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j] = 0;
            conflicted[i][k] = true;
            score += board[i][k];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoard()", 200);
  return true;
}

function moveRight() {
  if (!canMoveRight(board)) return false;

  for (var i = 3; i >= 0; i--)
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          if (board[i][k] == 0 && noBlockHorizon(i, j, k, board)) {
            showMoveAnime(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[i][k] == board[i][j] &&
            noBlockHorizon(i, j, k, board) &&
            !conflicted[i][k]
          ) {
            showMoveAnime(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j] = 0;
            conflicted[i][k] = true;
            score += board[i][k];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoard()", 200);
  return true;
}

function moveUp() {
  if (!canMoveUp(board)) return false;

  for (var j = 0; j < 4; j++)
    for (var i = 1; i < 4; i++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            showMoveAnime(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[k][j] == board[i][j] &&
            noBlockVertical(j, k, i, board) &&
            !conflicted[k][j]
          ) {
            showMoveAnime(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            conflicted[k][j] = true;
            score += board[k][j];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoard()", 200);
  return true;
}

function moveDown() {
  if (!canMoveDown(board)) return false;

  for (var j = 3; j >= 0; j--)
    for (var i = 2; i >= 0; i--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            showMoveAnime(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (
            board[k][j] == board[i][j] &&
            noBlockVertical(j, i, k, board) &&
            !conflicted[k][j]
          ) {
            showMoveAnime(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            conflicted[k][j] = true;
            score += board[k][j];
            updateScore(score);
            continue;
          }
        }
      }
    }

  setTimeout("updateBoard()", 200);
  return true;
}
