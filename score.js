document.addEventListener("DOMContentLoaded", () => {
  // Retrieve stored scores from localStorage (use same key names as in the game files)
  const playerScore = parseInt(localStorage.getItem("playerScore")) || 0;
  const computerScore = parseInt(localStorage.getItem("computerScore")) || 0;
  const drawScore = parseInt(localStorage.getItem("drawScore")) || 0;

  // Display current scores
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("computerScore").textContent = computerScore;
  document.getElementById("drawScore").textContent = drawScore;

  // Reset button handler
  document.getElementById("resetScores").addEventListener("click", () => {
    // Clear scores in localStorage
    localStorage.setItem("playerScore", 0);
    localStorage.setItem("computerScore", 0);
    localStorage.setItem("drawScore", 0);

    // Immediately update UI
    document.getElementById("playerScore").textContent = 0;
    document.getElementById("computerScore").textContent = 0;
    document.getElementById("drawScore").textContent = 0;

    alert("Scores have been reset ✅");
  });
});
