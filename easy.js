document.addEventListener("DOMContentLoaded", () => {
  const boardContainer = document.getElementById("easy-board");
  const message = document.getElementById("message");
  const resetBtn = document.getElementById("resetBtn");

  // Scoreboard elements
  const playerScoreEl = document.getElementById("playerScore");
  const computerScoreEl = document.getElementById("computerScore");
  const drawScoreEl = document.getElementById("drawScore");

  let board = Array(9).fill("");
  let player = "X";
  let computer = "O";
  let currentTurn = "player"; // Track who starts next round
  let gameActive = true;

  // Load saved scores or default to 0
  let playerScore = parseInt(localStorage.getItem("playerScore")) || 0;
  let computerScore = parseInt(localStorage.getItem("computerScore")) || 0;
  let drawScore = parseInt(localStorage.getItem("drawScore")) || 0;

  updateScore();

  // Create 3x3 board
  function createBoard() {
    boardContainer.innerHTML = "";
    board.forEach((_, index) => {
      const cell = document.createElement("div");
      cell.dataset.index = index;
      cell.addEventListener("click", handlePlayerMove);
      boardContainer.appendChild(cell);
    });
  }

  // Player move
  function handlePlayerMove(e) {
    const index = e.target.dataset.index;
    if (board[index] !== "" || !gameActive || currentTurn !== "player") return;

    board[index] = player;
    e.target.textContent = player;

    if (checkWinner(player)) {
      playerScore++;
      updateScore();
      saveScores();
      showPopup("🎉 You Win!");
      gameActive = false;
      return;
    }

    if (isDraw()) {
      drawScore++;
      updateScore();
      saveScores();
      showPopup("🤝 It's a Draw!");
      gameActive = false;
      currentTurn = "computer"; // 👈 Computer starts next round after a draw
      return;
    }

    currentTurn = "computer";
    setTimeout(computerMove, 400);
  }

  // Computer move
  function computerMove() {
    const emptyIndices = board.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
    if (!gameActive || emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[randomIndex] = computer;
    boardContainer.querySelector(`[data-index='${randomIndex}']`).textContent = computer;

    if (checkWinner(computer)) {
      computerScore++;
      updateScore();
      saveScores();
      showPopup("💻 Computer Wins!");
      gameActive = false;
      return;
    }

    if (isDraw()) {
      drawScore++;
      updateScore();
      saveScores();
      showPopup("🤝 It's a Draw!");
      gameActive = false;
      currentTurn = "player"; // 👈 Player starts next round after a draw
      return;
    }

    currentTurn = "player";
  }

  // Check draw
  function isDraw() {
    return board.every(cell => cell !== "");
  }

  // Check winner
  function checkWinner(symbol) {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return wins.some(pattern => pattern.every(i => board[i] === symbol));
  }

  // Update scoreboard
  function updateScore() {
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    drawScoreEl.textContent = drawScore;
  }

  // Save scores to localStorage
  function saveScores() {
    localStorage.setItem("playerScore", playerScore);
    localStorage.setItem("computerScore", computerScore);
    localStorage.setItem("drawScore", drawScore);
  }

  // Popup
  function showPopup(text) {
    const overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");
    const popup = document.createElement("div");
    popup.classList.add("popup-box");

    popup.innerHTML = `
      <h3>${text}</h3>
      <button id="nextRoundBtn">Next Round</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById("nextRoundBtn").addEventListener("click", () => {
      overlay.remove();
      resetBoard();
    });
  }

  // Reset only board
  function resetBoard() {
    board = Array(9).fill("");
    gameActive = true;
    createBoard();

    // 👇 If computer is to start next round after draw
    if (currentTurn === "computer") {
      setTimeout(computerMove, 500);
    }
  }

  // ✅ Reset scores + board
  function resetScores() {
    playerScore = 0;
    computerScore = 0;
    drawScore = 0;
    saveScores();
    updateScore();
    resetBoard();
  }

  // Reset button clears scores
  resetBtn.addEventListener("click", resetBoard);

  createBoard();
});
