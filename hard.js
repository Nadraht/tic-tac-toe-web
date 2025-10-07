// hard.js — Unbeatable Mode (Minimax)

const boardContainer = document.getElementById("hard-board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("resetBtn"); // Restart Game button
const resetScoresBtn = document.getElementById("resetScores"); // Reset Scores button

let board = ["", "", "", "", "", "", "", "", ""];
let player = "X";
let computer = "O";
let currentTurn = "player"; // 👈 Tracks who starts next
let gameActive = true;

// Persistent scores
let playerScore = parseInt(localStorage.getItem("playerScore")) || 0;
let computerScore = parseInt(localStorage.getItem("computerScore")) || 0;
let drawScore = parseInt(localStorage.getItem("drawScore")) || 0;

// Update scoreboard display
function updateScoreboard() {
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("computerScore").textContent = computerScore;
  document.getElementById("drawScore").textContent = drawScore;
}

// Save scores to localStorage
function saveScores() {
  localStorage.setItem("playerScore", playerScore);
  localStorage.setItem("computerScore", computerScore);
  localStorage.setItem("drawScore", drawScore);
}

// Create game board
function createBoard() {
  boardContainer.innerHTML = "";
  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.addEventListener("click", () => makeMove(index));
    boardContainer.appendChild(cell);
  });
}

// Make a move
function makeMove(index) {
  if (board[index] !== "" || !gameActive || currentTurn !== "player") return;

  board[index] = player;
  renderBoard();

  if (checkWinner(board) === player) {
    showPopup("🎉 You Win!");
    playerScore++;
    saveScores();
    updateScoreboard();
    gameActive = false;
    return;
  }

  if (isDraw()) {
    showPopup("😐 It's a Draw!");
    drawScore++;
    saveScores();
    updateScoreboard();
    gameActive = false;
    currentTurn = "computer"; // 👈 Computer starts next round after draw
    return;
  }

  currentTurn = "computer";
  gameActive = false;

  setTimeout(() => {
    gameActive = true;
    computerMove();
  }, 400);
}

// Computer move (AI)
function computerMove() {
  const bestMove = getBestMove(board);
  if (bestMove === undefined) return;

  board[bestMove] = computer;
  renderBoard();

  if (checkWinner(board) === computer) {
    showPopup("💻 Computer Wins!");
    computerScore++;
    saveScores();
    updateScoreboard();
    gameActive = false;
    return;
  }

  if (isDraw()) {
    showPopup("😐 It's a Draw!");
    drawScore++;
    saveScores();
    updateScoreboard();
    gameActive = false;
    currentTurn = "player"; // 👈 Player starts next round after draw
    return;
  }

  currentTurn = "player";
  gameActive = true;
}

// Check for draw
function isDraw() {
  return board.every(cell => cell !== "") && !checkWinner(board);
}

// Render board
function renderBoard() {
  const cells = boardContainer.querySelectorAll("div");
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.style.color = board[i] === "X" ? "#1f1c2c" : "#ffcc00";
  });
}

// Minimax algorithm — unbeatable AI
function getBestMove(newBoard) {
  let bestScore = -Infinity;
  let move;

  newBoard.forEach((cell, i) => {
    if (cell === "") {
      newBoard[i] = computer;
      let score = minimax(newBoard, 0, false);
      newBoard[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  const winner = checkWinner(newBoard);
  if (winner === computer) return 10 - depth;
  if (winner === player) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    newBoard.forEach((cell, i) => {
      if (cell === "") {
        newBoard[i] = computer;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    newBoard.forEach((cell, i) => {
      if (cell === "") {
        newBoard[i] = player;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// Check winner
function checkWinner(b) {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let combo of combos) {
    const [a, b1, c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }
  return null;
}

// Popup display
function showPopup(text) {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
    <div class="popup-box">
      <h3>${text}</h3>
      <button id="nextRoundBtn">Next Round</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("nextRoundBtn").addEventListener("click", () => {
    popup.remove();
    restartGame();
  });
}

// Restart only the current round (keeps scores)
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  createBoard();
  renderBoard();
  message.textContent = "";

  if (currentTurn === "computer") {
    setTimeout(computerMove, 500);
  }
}

// Reset all scores (then restart)
function resetScores() {
  playerScore = 0;
  computerScore = 0;
  drawScore = 0;
  saveScores();
  updateScoreboard();
  restartGame();
}

//  Event listeners
if (restartBtn) restartBtn.addEventListener("click", restartGame);
if (resetScoresBtn) resetScoresBtn.addEventListener("click", resetScores);

//  Initialize
updateScoreboard();
createBoard();
renderBoard();
