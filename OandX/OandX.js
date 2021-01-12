const X_CLASS="x";
const O_CLASS="o";
const cellElements=document.querySelectorAll('[data-cell]');
const board=document.getElementById("board");
const cells=[...Array(9).keys()];
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
  
var human;
var computer;
var gameBoard;

restartButton.addEventListener('click',startGame);

function startGame() {
  cellElements.forEach(cell => {
  cell.classList.remove(X_CLASS);
  cell.classList.remove(O_CLASS);
  cell.addEventListener('click', humanMove, {once:true});
 });
  winningMessageElement.classList.remove('show');
  // set players
  human = oRadio.checked?"o":"x";
  computer = oRadio.checked?"x":"o";
  isGameOver=false;
  setBoard(human);
  occupied=[];
  gameBoard=Array.from(Array(9).keys());
  // randomly decide which player goes first
  if (Math.floor(Math.random()*100)%2==0) {
    alert("Computer goes first!")
    computerMove();
  } else {
    alert("You go first!")
  }
}

// set board (hover over)
function setBoard(player) {
  // set board
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  board.classList.add(player);
}

// human player move if click on empty position
function humanMove(e) {
  if (isGameOver) {
    return;
  }
  const cell=e.target;
  if (move(human, cell)) {
    const status=gameStatus(human, computer, gameBoard);
    if (status!="") {
      endGame(status, true);
    } else {
      computerMove();
    }
  }
}

// Computer move according to algorithm
function computerMove() {
  if (isGameOver) {
    return;
  }
  
  // move to best position
  let nextPos;
  if (availPos(gameBoard).length==9) {
    // if empty board, move to corner positions
    nextPos=[0, 2, 6, 8][Math.floor(Math.random()*4)]
  } else {
    nextPos=bestPos();
  }
  //alert(nextPos)
  move(computer, cellElements[nextPos]);
  const status=gameStatus(computer, human, gameBoard);
  if (status!="") {
    endGame(status, false);
  }
}

// Make the move, and log to gameBoard
function move(player, cell) {
  const cellIdx=Array.from(cellElements).indexOf(cell);
  if (typeof gameBoard[cellIdx]!="number") {
    return false;
  }
  cell.classList.add(player);
  gameBoard[cellIdx]=player;
  return true;
}

// minimax algorithm
function minimax(player, opponent, testBoard) {
  var status = gameStatus(player, opponent, testBoard);
  
  if ((player==computer && status=="win") || (player==human && status=='lost')) {
    return {score: 10};
  } else if ((player==human && status=="win") || (player==computer && status=='lost')) {
    return {score: -10};
  //} else if (avail.length == 0) {
  } else if (status == "draw") {
    return {score: 0};
  }

  var avail = availPos(testBoard);
	var moves = [];
	for (var i = 0; i < avail.length; i++) {
		var move = {};
		move.pos = testBoard[avail[i]];
		testBoard[avail[i]] = player;
    
    var result = minimax(opponent, player, testBoard);
    move.score = result.score;
		testBoard[avail[i]] = move.pos;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

function bestPos() {
  return minimax(computer, human, gameBoard).pos;
  //return minimax(computer, gameBoard).index;
}

// position not taken by players
function availPos(baord) {
	return baord.filter(s => typeof s == 'number');
}

// check if player win
function checkWin(player, board) {
  let playerOccupied = board.reduce((a, e, i) => (e==player) ?  a.concat(i) : a, []);
  // true or false
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return playerOccupied.includes(index);
    });
  });
}

// check if it is draw
function checkDraw(board) {
  if (availPos(board).length == 0) {
    return true;
  } else {
    return false;
  }
}

// games status: win, draw, nothing
function gameStatus(player, opponent, board) {
  // games status
  if (checkWin(player, board)) {
    return "win";
  } else if (checkWin(opponent, board)) {
    return "lost"
  } else if (checkDraw(board)) {
    return "draw"
  } else {
    return "";
  }
}

// end the game with messages
function endGame(status, isHuman) {
  if (status=="win") {
    winningMessageTextElement.innerText = `${isHuman? "You win!" : "Better luck next time!"}`;
  } else {
    winningMessageTextElement.innerText = "Draw!";
  }
  winningMessageElement.classList.add('show');
  isGameOver=true;
}