var _ = require('underscore')

var fibs = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

var Cell = function (value, loc, clicked, clickable) {
  this.value = value || this.randomFib();
  this.loc = loc;
  this.clicked = clicked || false;
  this.clickable = true;
  this.Id = Math.ceil(Math.random()*10000);
 };

Cell.prototype.randomFib = function () {
  var percent = Math.ceil(Math.random() * 100);
  if (percent < 4) return fibs[0];
  if (percent < 8) return fibs[1];
  if (percent < 12) return fibs[2];
  if (percent < 30) return fibs[3];
  if (percent < 45) return fibs[4];
  if (percent < 58) return fibs[5];
  if (percent < 68) return fibs[6];
  if (percent < 78) return fibs[7];
  if (percent < 85) return fibs[8];
  if (percent < 88) return fibs[9];
  if (percent < 92) return fibs[10];
  if (percent < 96) return fibs[11];

  return fibs[5];
};

var Board = function(size) {
  this.size = size;
  this.cells = this.createNewBoard(size);
  this.path = [];
  this.success = false;
  this.curr = undefined;
  this.next = undefined;
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

Board.prototype.setNextOption = function () {
  if (this.path.length >= 2) {
    this.next = this.path[this.path.length - 1].value + this.path[this.path.length - 2].value
  } else {
    this.next = undefined;
  }
  console.log(this.next)
}


Board.prototype.restrictToSurrounding = function (loc) {
  this.cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.loc[0] >= loc[0] - 1 && cell.loc[0] <= loc[0] + 1 && cell.loc[1] >= loc[1] - 1 && cell.loc[1] <= loc[1] + 1) {
        if (this.next === undefined || cell.value === this.next) cell.clickable = true;
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
    this.setNextOption();
    if (this.path.length >= 3) {
      this.success = true;
    }
    this.restrictToSurrounding(loc);
  } else {
  //go back one step in this.path
    this.path.pop();
    this.setNextOption();
    if (this.path.length !== 0) {
      this.restrictToSurrounding(this.path[this.path.length - 1].loc)
    } else {
      this.cells.forEach((row) => {
        row.forEach((cell) => {
         cell.clickable = true;
        })
      })
    }
  }
  return this;
};

Board.prototype.updateScore = function () {
  this.score += this.path.reduce((tot, cell) => tot + cell.value, 0) * Math.pow(this.path.length, 2);
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
      cell.clickable = true;
      cell.clicked = false;
    })
  })
  this.path = [];
}


export default Board;