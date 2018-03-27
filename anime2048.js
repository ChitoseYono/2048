function showNumAnime(i, j, number){

    var numbercell = $('#number'+i+j);

    numbercell.css('background-color', getNumberBgColor(number));
    numbercell.css('color', getNumberColor(number));
    numbercell.css("font-size", 0.6*cellSideLength+'px');
    numbercell.text(number);

    numbercell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j),
    },50);
}

function showMoveAnime(fromX, fromY ,toX ,toY){

    var numbercell = $('#number'+ fromX+ fromY);
    numbercell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top: getPosTop(toX, toY),
        left: getPosLeft(toX, toY),
    },200);
    
}

function updateScore(score) {
    $('#score').text(score);
  }
