const X_CLASS="x";
const O_CLASS="o";
const cellElements=document.querySelectorAll('[data-cell]');
const board=document.getElementById("board");
const cells=[...Array(9).keys()]
const WINNING_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById("restartButton");
let isGameOver=true;
const oRadio = document.getElementById("o");
const xRadio = document.getElementById("x");


class Player {
  constructor(symbol) {
    this.symbol=symbol;
  }
  
  symbol() {
    return this.symbol;  
  }
  
  setBoard() {
    // set board
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(this.symbol);
  }
  
  move(cell,occupied) {
    const cellIdx=Array.from(cellElements).indexOf(cell);
    if (occupied.includes(cellIdx)) {
      return false;
    }
    cell.classList.add(this.symbol);
    occupied.push(cellIdx);
    return true;
  }
  
  isWin() {
    return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(this.symbol);
    });
  });
  }
  
  isDraw(occupied) {
    return occupied.length==9? true : false;
  }
  
  gameStatus(occupied) {
    if (this.isWin()) {
      return "win";
    } else if (this.isDraw(occupied)) {
      return "draw"
    } else {
      return "";
    }
  }
}

var player;
var computer;
var occupied;

//startGame();
restartButton.addEventListener('click',startGame);

function startGame() {
  cellElements.forEach(cell => {
  cell.classList.remove(X_CLASS);
  cell.classList.remove(O_CLASS);
  cell.addEventListener('click', playerMove, {once:true});
 });
  winningMessageElement.classList.remove('show');
  // set players
  //o = document.getElementById("o");
  playerSymbol=oRadio.checked?"o":"x";
  computerSymbol=oRadio.checked?"x":"o";
  player = new Player(playerSymbol);
  computer = new Player(computerSymbol);
  isGameOver=false;
  player.setBoard();
  occupied=[];
  // randomly decide which player goes first
  if (Math.floor(Math.random()*100)%2==0) {
    alert("Computer goes first!")
    computerMove();
  } else {
    alert("You go first!")
  }
}

function playerMove(e) {
  if (isGameOver) {
    return;
  }
  const cell=e.target;
  if (player.move(cell,occupied)) {
    const status=player.gameStatus(occupied);
    if (status!="") {
      endGame(status, true);
    } else {
      computerMove();
    }
  }
}

function computerMove() {
  if (isGameOver) {
    return;
  }
  // move to random empty position
  const avail=cells.filter(index => !occupied.includes(index));
  const randomPos=avail[Math.floor(Math.random()*avail.length)];
  computer.move(cellElements[randomPos],occupied);
  //occupied.push(randomPos);
  //alert(occupied)
  const status=computer.gameStatus(occupied);
  if (status!="") {
    endGame(status, false);
  }
}

function endGame(status, isPlayer) {
  if (status=="win") {
    winningMessageTextElement.innerText = `${isPlayer? "You win!" : "Better luck next time!"}`;
  } else {
    winningMessageTextElement.innerText = "Draw!";
  }
  winningMessageElement.classList.add('show');
  isGameOver=true;
}