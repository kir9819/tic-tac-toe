const X = 'x';
const O = 'o';

class Game {
  constructor() {
    this.games = [];
    this.points = [0, 0];
  }

  newRound(player) {
    let round = new Round(player);
    this.games.push(round);
    return round;
  }
}

class Cell {
  constructor(x, y) {
    this.value = null;
    this.x = x;
    this.y = y;
  }

  choose(player) {
    this.value = player;
  }
}

class Round {
  constructor(player) {
    this.player = player;
    this.history = [];
    this.field = [];
    this.size = 3;
    this.currTurn = O;
    this.nextTurn = X;

    this.turns = [];
    this.compTurns = [];

    for (let i = 0; i < 3; i++) {
      this.field[i] = [];
      for (let k = 0; k < 3; k++) {
        let cell = new Cell(i, k);
        this.field[i][k] = cell;
        this.turns.push(cell);
      }
    }

    this.result = null;
  }
  
  check() {
    let leftDiagonal = true;
    let rightDiagonal = true;
    
    let isComputerTurn = this.currTurn !== this.player;

    // for hard mode
    let leftDiagonalComp = '';
    let rightDiagonalComp = '';
    let leftDiagonalCompCell = null;
    let rightDiagonalCompCell = null;
    this.compTurns.length = 0;

    for (let i = 0; i < 3; i++) {
      let row = true;
      let column = true;

      let rowComp = '';
      let columnComp = '';
      let rowCompCell = null;
      let columnCompCell = null;

      for (let k = 0; k < 3; k++) {
        row &= this.field[i][k].value === this.currTurn;
        column &= this.field[k][i].value === this.currTurn;

        if (!isComputerTurn) {
          rowComp += this.field[i][k].value ? this.field[i][k].value : '';
          rowCompCell = this.field[i][k].value ? rowCompCell : this.field[i][k];
          columnComp += this.field[k][i].value ? this.field[k][i].value : '';
          columnCompCell = this.field[k][i].value ? columnCompCell : this.field[k][i];
        }
      }

      if (row || column) return true;

      if (!isComputerTurn) {
        if (rowComp.length === 2 && rowComp[0] === rowComp[1]) {
          if (rowComp[0] === this.player) this.compTurns.unshift(rowCompCell);
          else this.compTurns.push(rowCompCell);
        }
        if (columnComp.length === 2 && columnComp[0] === columnComp[1]) {
          if (columnComp[0] === this.player) this.compTurns.unshift(columnCompCell);
          else this.compTurns.push(columnCompCell);
        }
      }

      leftDiagonal &= this.field[i][i].value === this.currTurn;
      rightDiagonal &= this.field[i][2 - i].value === this.currTurn;

      if (!isComputerTurn) {
        leftDiagonalComp += this.field[i][i].value ? this.field[i][i].value : '';
        leftDiagonalCompCell = this.field[i][i].value ? leftDiagonalCompCell : this.field[i][i];
        rightDiagonalComp += this.field[i][2 - i].value ? this.field[i][2 - i].value : '';
        rightDiagonalCompCell = this.field[i][2 - i].value ? rightDiagonalCompCell : this.field[i][2 - i];
      }
    }
    
    if (leftDiagonal || rightDiagonal) return true;

    if (!isComputerTurn) {
      if (leftDiagonalComp.length === 2 && leftDiagonalComp[0] === leftDiagonalComp[1]) {
        if (leftDiagonalComp[0] === this.player) this.compTurns.unshift(leftDiagonalCompCell);
        else this.compTurns.push(leftDiagonalCompCell);
      }
      if (rightDiagonalComp.length === 2 && rightDiagonalComp[0] === rightDiagonalComp[1]) {
        if (rightDiagonalComp[0] === this.player) this.compTurns.unshift(rightDiagonalCompCell);
        else this.compTurns.push(rightDiagonalCompCell);
      }
    }

    return false;
  }

  computerTurn() {
    return this.turn(this.turns[getRandom(0,this.turns.length - 1)]);
  }
  computerHardTurn() {
    if (!this.history.length) return this.turn(this.field[1][1]);
    if (this.compTurns.length) return this.turn(this.compTurns.pop());
    return this.computerTurn();
  }


  turn(cell) {
    cell.choose(this.currTurn);
    this.history.push(this.field);
    this.turns.splice(this.turns.indexOf(cell), 1);
    if (this.check()) {
      this.result = this.player === this.currTurn ? 'player' : 'computer';
    } else {
      if (this.history.length === 9) {
        this.result = 'draw';
      } else {
        let temp = this.nextTurn;
        this.nextTurn = this.currTurn;
        this.currTurn = temp;
        this.result = 'next';
      }
    }
    return this.result;
  }
}

function  getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Game;