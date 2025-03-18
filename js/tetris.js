// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Only run if we're on the page with Tetris elements
    if (!document.querySelector(".tetris-grid")) return;
  
    console.log("Tetris script loaded!");
  
    // Game variables
    let score = 0;
    let currentPiece = null;
    let gameInterval = null;
    let cells = Array(20).fill().map(() => Array(10).fill(0));
    let isGameRunning = false;
    let gameOverMessageTimeout = null;
    let username = "";
  
    // High scores array - will be loaded from localStorage
    let highScores = [];
  
    // Load high scores from localStorage
    function loadHighScores() {
      const savedScores = localStorage.getItem("tetrisHighScores");
      if (savedScores) {
        highScores = JSON.parse(savedScores);
      } else {
        highScores = [];
      }
      displayHighScores();
    }
  
    // Save high scores to localStorage
    function saveHighScores() {
      localStorage.setItem("tetrisHighScores", JSON.stringify(highScores));
    }
  
    // Show high score notification message for 3 seconds
    function showHighScoreNotification() {
      const notification = document.createElement("div");
      notification.textContent = "You got cracked the High-Score!";
      notification.style.position = "fixed";
      notification.style.top = "20px";
      notification.style.left = "50%";
      notification.style.transform = "translateX(-50%)";
      notification.style.background = "rgba(0, 0, 0, 0.8)";
      notification.style.color = "#fff";
      notification.style.padding = "10px 20px";
      notification.style.borderRadius = "8px";
      notification.style.fontSize = "1.2rem";
      notification.style.zIndex = "1000";
      document.body.appendChild(notification);
  
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  
    // Add a score to high scores – wenn ein neuer High-Score erreicht wurde, wird die Benachrichtigung angezeigt.
    function addHighScore(name, points) {
      if (!name) return;
  
      // Bestimme den bisherigen höchsten Score (falls vorhanden)
      const previousHigh = highScores.length ? highScores[0].score : 0;
  
      highScores.push({
        name: name,
        score: points,
        date: new Date().toISOString(),
      });
  
      // Sortiere absteigend
      highScores.sort((a, b) => b.score - a.score);
  
      // Speichere nur die Top 10
      if (highScores.length > 10) {
        highScores = highScores.slice(0, 10);
      }
  
      saveHighScores();
      displayHighScores();
  
      // Zeige Nachricht, falls neuer High-Score erreicht wurde
      if (points > previousHigh) {
        showHighScoreNotification();
      }
    }
  
    // Display high scores in the dashboard: maximal 5 Spieler, Spieler mit 0 Punkten werden ausgeblendet.
    function displayHighScores() {
      const highScoresList = document.getElementById("highScoresList");
      if (!highScoresList) return;
  
      highScoresList.innerHTML = "";
  
      const filteredScores = highScores.filter(scoreObj => scoreObj.score > 0).slice(0, 5);
      filteredScores.forEach((scoreObj, index) => {
        const listItem = document.createElement("li");
        listItem.className = "text-white mb-1";
        listItem.innerHTML = `${index + 1}. <strong>${scoreObj.name}</strong>: ${scoreObj.score} points`;
        highScoresList.appendChild(listItem);
      });
    }
  
    // Initialize the grid if needed
    const grid = document.querySelector(".tetris-grid");
    if (grid && grid.children.length === 0) {
      for (let i = 0; i < 200; i++) {
        const cell = document.createElement("div");
        cell.className = "tetris-cell";
        grid.appendChild(cell);
      }
    }
  
    // Create high scores panel if it doesn't exist
    if (!document.getElementById("highScoresPanel")) {
      const gameContainer = document.getElementById("gameContainer");
      if (gameContainer) {
        const highScoresPanel = document.createElement("div");
        highScoresPanel.id = "highScoresPanel";
        highScoresPanel.className = "absolute right-4 top-20 bg-black bg-opacity-80 p-4 rounded-lg border border-primary";
        highScoresPanel.innerHTML = `
          <h3 class="text-white text-xl mb-2">High Scores</h3>
          <ol id="highScoresList" class="list-decimal pl-5"></ol>
        `;
        gameContainer.appendChild(highScoresPanel);
      }
    }
  
    // Add Back button (optional, kann beibehalten werden)
    if (!document.getElementById("backButton")) {
      const gameContainer = document.getElementById("gameContainer");
      if (gameContainer) {
        const backButton = document.createElement("button");
        backButton.id = "backButton";
        backButton.textContent = "Back";
        backButton.className = "px-6 py-3 bg-primary text-white rounded-full absolute top-4 left-4";
        backButton.addEventListener("click", () => {
          window.location.href = "index.html";
        });
        gameContainer.appendChild(backButton);
      }
    }
  
    // Add Score Display on the right if it doesn't exist
    if (!document.getElementById("scoreDisplay")) {
      const gameContainer = document.getElementById("gameContainer");
      if (gameContainer) {
        const scoreDisplay = document.createElement("div");
        scoreDisplay.id = "scoreDisplay";
        scoreDisplay.className = "absolute top-4 right-4 bg-primary text-white px-6 py-3 rounded-full";
        scoreDisplay.innerHTML = 'Score: <span id="sideScore">0</span>';
        gameContainer.appendChild(scoreDisplay);
      }
    }
  
    // Create username modal if it doesn't exist
function showUsernameModal() {
  if (document.getElementById("usernameModal")) return;

  const body = document.body;
  const modalBackdrop = document.createElement("div");
  modalBackdrop.id = "usernameModalBackdrop";
  modalBackdrop.className = "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";

  const modalContent = document.createElement("div");
  modalContent.id = "usernameModal";
  modalContent.className = "bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full";
  modalContent.innerHTML = `
    <h2 class="text-white text-2xl mb-4">Enter Your Username</h2>
    <p class="text-gray-300 mb-4">Please enter a username to track your high scores:</p>
    <input type="text" id="usernameInput" class="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded" placeholder="Username">
    <button id="submitUsername" class="px-6 py-3 bg-primary text-white rounded-full">Start Game</button>
  `;

  modalBackdrop.appendChild(modalContent);
  body.appendChild(modalBackdrop);

  setTimeout(() => {
    document.getElementById("usernameInput").focus();
  }, 100);

  // Definiere verbotene Wörter
  const forbiddenWords = ["admin", "root", "test"]; // Beispiel: Passe die Liste nach Bedarf an

  // Funktion zur Validierung des Benutzernamens
  function validateUsername(name) {
    // Prüfe, ob der Username nicht leer ist
    if (!name) return false;

    // Der Username muss mindestens 3 Buchstaben lang sein
    if (name.length < 3) return false;

    // Es dürfen nur Buchstaben ohne Leerzeichen und Sonderzeichen verwendet werden
    if (!/^[A-Za-z]+$/.test(name)) return false;

    // Prüfe, ob eines der forbiddenWords im Namen enthalten ist (case-insensitive)
    for (let word of forbiddenWords) {
      if (name.toLowerCase().includes(word)) {
        return false;
      }
    }
    return true;
  }

  // Event Listener für Klick auf "Start Game" Button
  document.getElementById("submitUsername").addEventListener("click", () => {
    const input = document.getElementById("usernameInput");
    let enteredUsername = input.value.trim();
    if (!validateUsername(enteredUsername)) return; // Abbruch, falls ungültig
    username = enteredUsername;
    modalBackdrop.remove();
    startGame();
  });

  // Event Listener für "Enter" Taste im Input-Feld
  document.getElementById("usernameInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const input = document.getElementById("usernameInput");
      let enteredUsername = input.value.trim();
      if (!validateUsername(enteredUsername)) return; // Abbruch, falls ungültig
      username = enteredUsername;
      modalBackdrop.remove();
      startGame();
    }
  });
}

  
    // Tetris pieces with their shapes
    const pieces = [
      { shape: [[1, 1, 1, 1]], type: "I" },
      { shape: [[1, 1], [1, 1]], type: "O" },
      { shape: [[1, 1, 1], [0, 1, 0]], type: "T" },
      { shape: [[1, 1, 1], [1, 0, 0]], type: "L" },
      { shape: [[1, 1, 1], [0, 0, 1]], type: "J" },
      { shape: [[1, 1, 0], [0, 1, 1]], type: "S" },
      { shape: [[0, 1, 1], [1, 1, 0]], type: "Z" }
    ];
  
    // Update the visual grid based on cells array
    // (Übergänge sollten idealerweise in der CSS definiert sein, z. B. in style.css)
    function updateGrid() {
      const allCells = document.querySelectorAll(".tetris-cell");
      allCells.forEach((cell) => {
        cell.className = "tetris-cell";
      });
  
      cells.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell) {
            allCells[i * 10 + j].className = "tetris-cell active";
          }
        });
      });
  
      if (currentPiece) {
        currentPiece.shape.forEach((row, i) => {
          row.forEach((cell, j) => {
            if (cell) {
              const y = currentPiece.y + i;
              const x = currentPiece.x + j;
              if (y >= 0 && y < 20 && x >= 0 && x < 10) {
                allCells[y * 10 + x].className = "tetris-cell active";
              }
            }
          });
        });
      }
    }
  
    // Update score displays
    function updateScore() {
      const mainScoreElement = document.getElementById("score");
      if (mainScoreElement) {
        mainScoreElement.textContent = score;
      }
      const sideScoreElement = document.getElementById("sideScore");
      if (sideScoreElement) {
        sideScoreElement.textContent = score;
      }
    }
  
    // Create a new piece
    function spawnPiece() {
      const pieceIndex = Math.floor(Math.random() * pieces.length);
      const pieceType = pieces[pieceIndex].type;
      const pieceShape = pieces[pieceIndex].shape.map((row) => [...row]);
  
      currentPiece = {
        shape: pieceShape,
        type: pieceType,
        x: 3,
        y: 0,
      };
  
      // Wenn die neue Figur direkt kollidiert, berührt sie die Decke → Game Over
      if (!isValidMove(currentPiece, 0, 0)) {
        gameOver();
        return;
      }
  
      console.log("New piece spawned:", currentPiece);
      updateGrid();
    }
  
    // Game over function – das Spiel endet, wenn keine neue Figur mehr platziert werden kann.
    function gameOver() {
      console.log("Game Over!");
      if (gameOverMessageTimeout) {
        clearTimeout(gameOverMessageTimeout);
      }
  
      addHighScore(username, score);
  
      const scoreElement = document.getElementById("score");
      if (scoreElement) {
        const parentElement = scoreElement.parentElement;
        const originalContent = parentElement.innerHTML;
  
        parentElement.innerHTML = `<div id="gameOverMessage" class="text-red-500 font-bold text-2xl">Game Over! Score: ${score} <br> Restarting in 5 seconds...</div>`;
  
        stopGame();
  
        gameOverMessageTimeout = setTimeout(() => {
          parentElement.innerHTML = originalContent;
          document.getElementById("score").textContent = "0";
          startGame();
        }, 5000);
      }
    }
  
    // Rotate the current piece
    function rotatePiece() {
      if (!currentPiece) return;
      if (currentPiece.type === "O") return;
  
      const originalShape = currentPiece.shape;
      const rows = originalShape.length;
      const cols = originalShape[0].length;
      const newShape = [];
      for (let i = 0; i < cols; i++) {
        newShape[i] = [];
        for (let j = 0; j < rows; j++) {
          newShape[i][j] = originalShape[rows - 1 - j][i];
        }
      }
  
      const originalPiece = {
        shape: currentPiece.shape,
        x: currentPiece.x,
        y: currentPiece.y,
        type: currentPiece.type,
      };
  
      currentPiece.shape = newShape;
  
      if (!isValidMove(currentPiece, 0, 0)) {
        currentPiece.shape = originalPiece.shape;
        return;
      }
  
      updateGrid();
    }
  
    // Check if move is valid
    function isValidMove(piece, offsetX, offsetY) {
      return piece.shape.every((row, i) => {
        return row.every((cell, j) => {
          if (!cell) return true;
          const newX = piece.x + j + offsetX;
          const newY = piece.y + i + offsetY;
          if (newX < 0 || newX >= 10 || newY >= 20) return false;
          if (newY >= 0 && cells[newY][newX]) return false;
          return true;
        });
      });
    }
  
    // Move piece down one step
    function moveDown() {
      if (!currentPiece || !isGameRunning) return;
  
      if (isValidMove(currentPiece, 0, 1)) {
        currentPiece.y++;
        updateGrid();
      } else {
        placePiece();
        checkLines();
        spawnPiece();
      }
    }
  
    // Place the current piece on the grid
    function placePiece() {
      currentPiece.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell) {
            const y = currentPiece.y + i;
            const x = currentPiece.x + j;
            if (y >= 0 && y < 20 && x >= 0 && x < 10) {
              cells[y][x] = 1;
            }
          }
        });
      });
    }
  
    // Check for completed lines
    function checkLines() {
      let linesCleared = 0;
      for (let i = 19; i >= 0; i--) {
        if (cells[i].every(cell => cell === 1)) {
          cells.splice(i, 1);
          cells.unshift(Array(10).fill(0));
          linesCleared++;
          i++;
        }
      }
  
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] || 1000;
        score += points;
        updateScore();
      }
    }
  
    // Start the game – automatische Initialisierung nach der Eingabe des Nutzernamens.
    function startGame() {
      console.log("Game starting!");
      if (gameOverMessageTimeout) {
        clearTimeout(gameOverMessageTimeout);
        gameOverMessageTimeout = null;
      }
  
      const gameContainer = document.getElementById("gameContainer");
      if (gameContainer) {
        gameContainer.style.display = "flex";
      }
  
      // Reset game state
      cells = Array(20).fill().map(() => Array(10).fill(0));
      score = 0;
      updateScore();
  
      const splashScreen = document.getElementById("splashScreen");
      if (splashScreen) splashScreen.style.display = "none";
  
      isGameRunning = true;
      spawnPiece();
  
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(moveDown, 1000);
    }
  
    // Stop the game
    function stopGame() {
      console.log("Game stopping!");
      isGameRunning = false;
      clearInterval(gameInterval);
      gameInterval = null;
      currentPiece = null;
      updateGrid();
    }
  
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (!currentPiece || !isGameRunning) return;
      switch (e.key) {
        case "ArrowLeft":
          if (isValidMove(currentPiece, -1, 0)) {
            currentPiece.x--;
            updateGrid();
          }
          break;
        case "ArrowRight":
          if (isValidMove(currentPiece, 1, 0)) {
            currentPiece.x++;
            updateGrid();
          }
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case " ":
          while (isValidMove(currentPiece, 0, 1)) {
            currentPiece.y++;
          }
          moveDown();
          break;
      }
    });
  
    loadHighScores();
  
    // Zeige die Username-Eingabe, wenn kein Name gesetzt ist, und starte dann automatisch
    setTimeout(() => {
      if (!username && !isGameRunning) {
        showUsernameModal();
      }
    }, 1000);
});
