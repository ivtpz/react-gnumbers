fibs = [1, 1];
for (var i = 0; i < 10; i++) {
  fibs.push(fibs[i] + fibs[i + 1]);
}

var Cell = function (value, loc, clicked, clickable) {
  this.value = value || this.randomFib();
  this.loc = loc;
  this.clicked = clicked || false;
  this.clickable = clickable || true;
};

Cell.prototype.randomFib = function () {
  let percent = Math.ceil(Math.random() * 100);
  if (percent < 50) return fibs[1];
  if (percent < 70) return fibs[2];
  if (percent < 85) return fibs[3];
  if (percent < 95) return fibs[4];
  return fibs[5];
};

var Board = function(size) {
  this.size = size;
  this.cells = this.createNewBoard(size);
};

Board.prototype.createNewBoard = function (size) {
  let board = []
  for (var i = 0; i < size; i++) {
    board.push([]);
    for(var j = 0; j < size; j++) {
      board[i].push(new Cell(null, [i, j]));
    }
  }
  return board;
};

this.state = { 
  path: []
}


