class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
      this.HEIGHT = HEIGHT
      this.WIDTH = WIDTH
      this.board = []
      this.currPlayer = p1
      this.p1 = p1
      this.p2 = p2
      this.makeBoard()
      this.makeHtmlBoard()
  }
  makeBoard() {
      for (let y = 0; y < this.HEIGHT; y++) {
          this.board.push(Array.from({ length: this.WIDTH}))
      }
  }
  makeHtmlBoard() {
      const htmlBoard = document.getElementById('board')
      
      const top = document.createElement('tr')
      top.setAttribute('id', 'column-top')

      //bind this to Game instance for the handleClick method
      this.handleClickBoundToGame = this.handleClick.bind(this)
      top.addEventListener('click', this.handleClickBoundToGame)
    
      for (let x = 0; x < this.WIDTH; x++) {
          const headCell = document.createElement('td')
          headCell.setAttribute('id', x)
          top.append(headCell)
      }

      htmlBoard.append(top)

      for (let y = 0; y < this.HEIGHT; y++) {
          const row = document.createElement('tr')

          for (let x = 0; x < this.WIDTH; x++) {
              const cell = document.createElement('td');
              cell.setAttribute('id', `${y}-${x}`);
              row.append(cell);
            }

          htmlBoard.append(row)
      }
  }
  findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
      return null
  }
  placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.top = -50 * (y + 2);
      piece.style.backgroundColor = this.currPlayer.color
    
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
  }
  endGame(msg) {
      setTimeout(() => {alert(msg)}, 100)
      const top = document.getElementById('column-top')
      top.removeEventListener('click', this.handleClickBoundToGame)
  }
  handleClick(evt) {
      const x = +evt.target.id
      const y = this.findSpotForCol(x)

      if (y === null) {
          return
      }

      this.board[y][x] = this.currPlayer
      this.placeInTable(y,x)

      if (this.checkForWin()) {
          return this.endGame(`Player ${this.currPlayer.color} won!`)
      }

      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }

      this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1
  }
  checkForWin() {
      function _win(cells) {
        return cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.HEIGHT &&
              x >= 0 &&
              x < this.WIDTH &&
              this.board[y][x] === this.currPlayer
          )
      }
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
          
          if (_win.call(this, horiz) || _win.call(this, vert) || _win.call(this, diagDR) || _win.call(this, diagDL)) {
            return true;
          }
        }
      }
  }
}

class Player {
    constructor(color) {
        this.color = color
    }
}

startbtn = document.querySelector('#startbtn').addEventListener('click', () => {
    let p1Color = document.querySelector('#p1-color')
    let p2Color = document.querySelector('#p2-color')
    let p1 = new Player(p1Color.value)
    let p2 = new Player(p2Color.value)
    new Game(p1, p2)
})