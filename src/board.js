var _ = require('underscore')

var fibs = [1, 1];
for (var i = 0; i < 6; i++) {
  fibs.push(fibs[i] + fibs[i + 1]);
}

var Cell = function (value, loc, clicked, clickable) {
  this.value = value || this.randomFib();
  this.loc = loc;
  this.clicked = clicked || false;
  this.clickable = clickable || this.value === 1 ? true : false;
};

Cell.prototype.randomFib = function () {
  var percent = Math.ceil(Math.random() * 100);
  if (percent < 50) return fibs[1];
  if (percent < 70) return fibs[2];
  if (percent < 85) return fibs[3];
  if (percent < 95) return fibs[4];
  return fibs[5];
};

var Board = function(size) {
  this.size = size;
  this.cells = this.createNewBoard(size);
  this.path = [];
  this.success = false;
  this.fibs = fibs;
  this.score = 0;
};

Board.prototype.createNewBoard = function (size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for(var j = 0; j < size; j++) {
      board[i].push(new Cell(null, [i, j]));
    }
  }
  return board;
};


Board.prototype.restrictToSurrounding = function (loc) {
  this.cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.loc[0] >= loc[0] - 1 && cell.loc[0] <= loc[0] + 1 && cell.loc[1] >= loc[1] - 1 && cell.loc[1] <= loc[1] + 1) {
        if (cell.value === fibs[this.path.length]) cell.clickable = true;
        if (cell.loc[0] + cell.loc[1] === loc[0] + loc[1] || cell.loc[0] - cell.loc[1] === loc[0] - loc[1]) {
          cell.clickable = false;
          this.cells[loc[0]][loc[1]].clickable = true;
          if (this.path.length > 1) {
            for (var i = this.path.length - 2; i >= 0; i--)
            this.path[i].clickable = false;
          }
        }
      } else {
        cell.clickable = false;
      }
    })
  })
};

Board.prototype.setClickOptions = function (loc) {
  var square = this.cells[loc[0]][loc[1]];
  square.clicked = !square.clicked;
  //if square was turned on, only allow clicking in adjacent squares
  if (square.clicked) {
    this.path.push(square);
    if (this.path.length >= 3) {
      this.success = true;
    }
    this.restrictToSurrounding(loc);
  } else {
  //go back one step in this.path
    this.path.pop();
    if (this.path.length !== 0) {
      this.restrictToSurrounding(this.path[this.path.length - 1].loc)
    } else {
      this.cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value === 1) {
            cell.clickable = true;
          } else {
            cell.clickable = false;
          }
        })
      })
    }
  }
  return this;
};

Board.prototype.updateScore = function () {
  this.score += Math.pow(this.path[this.path.length - 1].value, 2);
}

Board.prototype.update = function () {

  //update data
  var shiftCells = [];

  this.path.sort((a, b) => {
    return a.loc[0] - b.loc[0];
  }).forEach((item) => {
    if(!_.contains(shiftCells, item.locID)) shiftCells.push(item.locID)
    var row = item.loc[0];
    var col = item.loc[1];
    this.cells[row][col] = undefined;
    row--;
    while (row >= 0 && this.cells[row][col] !== undefined) {
      this.cells[row + 1][col] = this.cells[row][col];
      this.cells[row + 1][col].loc = [row + 1, col];
      this.cells[row + 1][col].locID = (row + 1).toString() + col.toString();
      this.cells[row][col] = undefined;
      if(!_.contains(shiftCells, row.toString() + col.toString())) shiftCells.push(row.toString() + col.toString());
      row--;
    }
  });


  for (var i = 0; i < this.cells.length ; i++) {
    for(var j = 0; j < this.cells[i].length; j++) {
      if (this.cells[i][j] === undefined) {
        this.cells[i][j] = new Cell(null, [i, j])
      }
    }
  }
}

Board.prototype.checkOptions = function () {
  var done = true;
  this.cells.forEach((row) => {row.forEach((cell) => {
      if (!cell.clicked && cell.clickable) {
        done = false;
      }
    })
  })
  return done;
}

Board.prototype.reset = function () {
  this.success = false;
  this.cells.forEach((row) => {
    row.forEach((cell) => {
      cell.clickable = cell.value === 1 ? true : false;
      cell.clicked = false;
    })
  })
  this.path = [];
}


export default Board;