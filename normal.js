document.addEventListener("DOMContentLoaded", () => {
  const boardContainer = document.getElementById("normal-board");
  const message = document.getElementById("message");
  const resetBtn = document.getElementById("resetBtn");

  // Scoreboard elements
  const playerScoreEl = document.getElementById("playerScore");
  const computerScoreEl = document.getElementById("computerScore");
  const drawScoreEl = document.getElementById("drawScore");

  let board = Array(9).fill("");
  let player = "X";
  let computer = "O";
  let gameActive = true;
  let currentTurn = "player";

  // Load scores
  let playerScore = parseInt(localStorage.getItem("playerScore")) || 0;
  let computerScore = parseInt(localStorage.getItem("computerScore")) || 0;
  let drawScore = parseInt(localStorage.getItem("drawScore")) || 0;

  updateScore();
  createBoard(); // ✅ ensure board is created immediately

  // 🧱 Create 3x3 board
  function createBoard() {
    boardContainer.innerHTML = "";
    board.forEach((_, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell"); // ✅ optional styling class
      cell.dataset.index = index;
      cell.addEventListener("click", handlePlayerMove);
      boardContainer.appendChild(cell);
    });
  }

  // 🎮 Player move
  function handlePlayerMove(e) {
    const index = e.target.dataset.index;
    if (!gameActive || board[index] !== "" || currentTurn !== "player") return;

    board[index] = player;
    e.target.textContent = player;

    if (checkWinner(player)) {
      playerScore++;
      saveScores();
      updateScore();
      showPopup("🎉 You Win!");
      gameActive = false;
      return;
    }

    if (isDraw()) {
      drawScore++;
      saveScores();
      updateScore();
      showPopup("🤝 It's a Draw!");
      gameActive = false;
      currentTurn = "computer";
      return;
    }

    currentTurn = "computer";
    gameActive = false;
    setTimeout(computerMove, 500);
  }

  // 💻 Computer move
  function computerMove() {
    if (!gameActive && currentTurn !== "computer") return;

    const move = findBestMove();
    board[move] = computer;
    const cell = boardContainer.querySelector(`[data-index='${move}']`);
    cell.textContent = computer;

    if (checkWinner(computer)) {
      computerScore++;
      saveScores();
      updateScore();
      showPopup("💻 Computer Wins!");
      gameActive = false;
      return;
    }

    if (isDraw()) {
      drawScore++;
      saveScores();
      updateScore();
      showPopup("🤝 It's a Draw!");
      gameActive = false;
      currentTurn = "player";
      return;
    }

    currentTurn = "player";
    gameActive = true;
  }

  // 🧠 Normal difficulty logic
  function findBestMove() {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = computer;
        if (checkWinner(computer)) {
          board[i] = "";
          return i;
        }
        board[i] = "";
      }
    }

    // Try to block
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = player;
        if (checkWinner(player)) {
          board[i] = "";
          return i;
        }
        board[i] = "";
      }
    }

    // Else random
    const emptyIndices = board.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // 🏆 Winner check
  function checkWinner(symbol) {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return wins.some(pattern => pattern.every(i => board[i] === symbol));
  }

  function isDraw() {
    return board.every(cell => cell !== "") && !checkWinner(player) && !checkWinner(computer);
  }

  // 📊 Update scoreboard
  function updateScore() {
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    drawScoreEl.textContent = drawScore;
  }

  // Save scores
  function saveScores() {
    localStorage.setItem("playerScore", playerScore);
    localStorage.setItem("computerScore", computerScore);
    localStorage.setItem("drawScore", drawScore);
  }

  //  Popup
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

  // Reset board (not scores)
  function resetBoard() {
    board = Array(9).fill("");
    gameActive = true;
    message.textContent = "";
    createBoard();

    if (currentTurn === "computer") {
      setTimeout(computerMove, 400);
    }
  }

  // Restart button → only restart current round, not scores
  resetBtn.addEventListener("click", resetBoard);
});
