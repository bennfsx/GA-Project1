// Global default values
//Using array to set the board
let board = [];
let score = 0;
let wonGame = false; //Default
let tile = document.querySelector(".tile");
let tileContainer = document.querySelector(".tileContainer");
let scoreElement = document.getElementById("scoreElement");
const alert = document.getElementById("alert");
let scoresContainer = document.querySelector(".score-board .scores-container");
let scores = [];

createBoard();
addRandomTile();
addRandomTile();

function createBoard() {
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(0);
    }
    board.push(row);
  }
}

// function to add a random tile onto the board
function addRandomTile() {
  let emptyTiles = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push([i, j]);
      }
    }
  }
  let [randomI, randomJ] =
    emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[randomI][randomJ] = Math.random() < 0.9 ? 2 : 4; //90% of randomly generate a square with 2 or 10% square with 4
  addTileToPage(randomI, randomJ, board[randomI][randomJ]);
}

function addTileToPage(row, column, value) {
  let tile = document.createElement("div");
  tile.classList.add(
    "tile",
    "row" + (row + 1),
    "column" + (column + 1),
    "value" + value
  );
  tile.innerHTML = value;
  tileContainer.appendChild(tile);
  tile.classList.add("merged");
  tile.addEventListener("animationend", function () {
    this.classList.remove("merged"); //Animation when merged invoke remove()
  });
}

function startNewGame() {
  // const alert = document.getElementById("alert");
  alert.style.display = "none"; // no alert message display yet
  tileContainer.innerHTML = ""; // Empty tile
  scoreElement.innerHTML = 0; // Set default score 0
  board = [];
  score = 0;
  wonGame = false;
  window.addEventListener("keydown", onDirectionKeyPress);
  createBoard();
  // Add 2 random tile onto the board upon game start
  addRandomTile();
  addRandomTile();
}

function continuePlaying() {
  const alert = document.getElementById("alert");
  alert.style.display = "none";
  window.addEventListener("keydown", onDirectionKeyPress);
}

window.addEventListener("keydown", onDirectionKeyPress);

//Capture action key UP, DOWN, LEFT and Right
function onDirectionKeyPress(event) {
  let movePossible;
  switch (event.key) {
    //Arrow up key move tiles (1, 0) UP
    case "ArrowUp":
      movePossible = moveTiles(1, 0);
      break;
    //Arrow down key move tiles (-1, 0) DOWN
    case "ArrowDown":
      movePossible = moveTiles(-1, 0);
      break;
    //Arrow left key move tiles (0, -1) LEFT
    case "ArrowLeft":
      movePossible = moveTiles(0, -1);
      break;
    //Arrow right key move tile (0, 1) RIGHT
    case "ArrowRight":
      movePossible = moveTiles(0, 1);
      break;
  }
  //Trigger a new tile placed on to the board randomly when tiles are moved or merged
  if (movePossible) {
    addRandomTile();
    let gameOver = isGameOver();
    if (gameOver.gameOver) showAlert(gameOver.message);
  }
}

function moveTiles(directionY, directionX) {
  let movePossible = false;
  let mergedRecently = false;

  // if X not 0 then tile movement LEFT RIGHT
  if (directionX !== 0) {
    let startX = directionX === 1 ? 3 : 0;
    let stepX = directionX === 1 ? -1 : 1;

    for (let i = 0; i < 4; i++) {
      let j = startX;
      while ((j <= 3 && stepX === 1) || (j >= 0 && stepX === -1)) {
        if (board[i][j] === 0) {
          j += stepX;
          continue;
        }
        let destination = getDestinationSquares(i, j, 0, directionX);
        let tileClass = ".row" + (i + 1) + ".column" + (j + 1);
        let tile = document.querySelector(tileClass);
        // if no merge OR merged recently, tile will be moved to the destination
        if (!destination.merge || (destination.merge && mergedRecently)) {
          mergedRecently = false;
          destination.destinationX += destination.merge ? stepX : 0;
          board[i][destination.destinationX] = board[i][j];
          if (destination.destinationX !== j) {
            movePossible = true;
            board[i][j] = 0;
          }
          moveTileOnPage(i, destination.destinationX, tile, false);
          j += stepX;
          continue;
        }
        // Update the scoreboard if its merged
        mergedRecently = true;
        board[i][destination.destinationX] = board[i][j] * 2;
        score += board[i][destination.destinationX];
        scoreElement.innerHTML = score;
        movePossible = true;
        board[i][j] = 0;
        moveTileOnPage(i, destination.destinationX, tile, destination.merge);
        j += stepX;
      }
    }
  } // Else if direction is UP or DOWN
  else if (directionY !== 0) {
    let startY = directionY === 1 ? 3 : 0;
    let stepY = directionY === 1 ? -1 : 1;

    for (let j = 0; j < 4; j++) {
      let i = startY;
      while ((i <= 3 && stepY === 1) || (i >= 0 && stepY === -1)) {
        if (board[i][j] === 0) {
          i += stepY;
          continue;
        }
        let destination = getDestinationSquares(i, j, directionY, 0);
        let tileClass = ".row" + (i + 1) + ".column" + (j + 1);
        let tile = document.querySelector(tileClass);
        // if no merge OR merged recently, tile will be moved to the destination
        if (!destination.merge || (destination.merge && mergedRecently)) {
          mergedRecently = false;
          destination.destinationY += destination.merge ? stepY : 0;
          board[destination.destinationY][j] = board[i][j];
          if (destination.destinationY !== i) {
            movePossible = true;
            board[i][j] = 0;
          }
          moveTileOnPage(destination.destinationY, j, tile, false);
          i += stepY;
          continue;
        }
        // Update the scoreboard if its merged
        mergedRecently = true;
        board[destination.destinationY][j] = board[i][j] * 2;
        score += board[destination.destinationY][j];
        scoreElement.innerHTML = score;
        movePossible = true;
        board[i][j] = 0;
        moveTileOnPage(destination.destinationY, j, tile, destination.merge);
        i += stepY;
      }
    }
  }
  return movePossible;
}

// Move tile in the direction determined by the key until reaches last row/column or another tile to merge
function getDestinationSquares(i, j, directionY, directionX) {
  let destinationY = i;
  let destinationX = j;
  let merge = false;

  while (
    (destinationY < 3 && directionY === 1) ||
    (destinationY > 0 && directionY === -1) ||
    (destinationX < 3 && directionX === 1) ||
    (destinationX > 0 && directionX === -1)
  ) {
    let nextY = destinationY + directionY;
    let nextX = destinationX + directionX;
    let nextCell = board[nextY][nextX];
    let currentCell = board[i][j];

    if (nextCell === 0 || nextCell === currentCell) {
      destinationY = nextY;
      destinationX = nextX;
      merge = nextCell === currentCell;
    }
    if (nextCell === 0 || nextCell === currentCell) {
      destinationY = nextY;
      destinationX = nextX;
      merge = nextCell === currentCell;
    }
    if (nextCell !== 0 && nextCell !== currentCell) break;

    if (merge) break;
  }
  return {
    merge: merge,
    destinationY: destinationY,
    destinationX: destinationX,
  };
}

//Function to shift tile to the square by row and column
// Remove tile that have merged and new tile with updated value will be added
function moveTileOnPage(row, column, tile, merge) {
  let classes = Array.from(tile.classList);
  classes.forEach((className) => {
    if (className.startsWith("row") || className.startsWith("column")) {
      tile.classList.remove(className);
    }
  });
  tile.classList.add("row" + (row + 1), "column" + (column + 1));
  if (merge) {
    let elements = tileContainer.querySelectorAll(
      ".row" + (row + 1) + ".column" + (column + 1)
    );
    while (elements.length > 1) {
      tileContainer.removeChild(elements[0]);
      elements = tileContainer.querySelectorAll(
        ".row" + (row + 1) + ".column" + (column + 1)
      );
    }
    elements[0].className =
      "tile " +
      "row" +
      (row + 1) +
      " column" +
      (column + 1) +
      " " +
      "value" +
      board[row][column];
    elements[0].innerHTML = board[row][column];
    elements[0].classList.add("merged");
    elements[0].addEventListener("animationend", function () {
      tile.classList.remove("merged");
    });
  }
}

//Losing Logic
function isGameOver() {
  let emptySquare = false;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) emptySquare = true;
      if (board[i][j] === 256 && !wonGame)
        return { gameOver: true, message: "You won!" };
      if (j != 3 && board[i][j] === board[i][j + 1]) emptySquare = true;
      if (i != 3 && board[i][j] === board[i + 1][j]) emptySquare = true;
    }
  }
  if (emptySquare) return { gameOver: false, message: "" };
  return { gameOver: true, message: "Game over!" };
}

function showAlert(message) {
  // const alert = document.getElementById("alert");
  if (message == "Game over!")
    alert.innerHTML =
      '<div class="gameover">Game over!</div> <button class="newGame" onclick="startNewGame()">Try Again</button>; ';
  addScoreAndRefreshLeaderboard(score);
  if (message == "You won!") {
    wonGame = true;
    alert.innerHTML =
      '<div class="gamewin">You Won 2048!</div> <button class="newGame" onclick="startNewGame()">New Game</button><button class="newGame" onclick="continuePlaying()">Continue?</button>';
    window.removeEventListener("keydown", onDirectionKeyPress);
    //addScoreAndRefreshLeaderboard(score);
  }
  alert.style.display = "flex";
  alert.style.flexDirection = "column";
}

// Function to add to the scoreboard
function addScoreAndRefreshLeaderboard(currentScore) {
  // Load existing scores from localStorage or initialize to an empty array
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  // Determine if the current score qualifies to be added to the leaderboard
  if (scores.length < 10 || currentScore > scores[scores.length - 1]) {
    // Add the current score
    scores.push(currentScore);
    // Sort scores in descending order
    scores.sort((a, b) => b - a);
    // Keep only the top 10 scores
    scores = scores.slice(0, 10);
    // Save updated scores back to localStorage
    localStorage.setItem("scores", JSON.stringify(scores));
    // Update the leaderboard display
    updateLeaderboardDisplay(scores);
  }
}
// Update Scoreboard
function updateLeaderboardDisplay(scores) {
  let scoresContainer = document.querySelector(
    ".score-board .scores-container"
  );
  scoresContainer.innerHTML = ""; // Clear existing scores

  // Append score divs for the top 10 scores
  scores.forEach((score, index) => {
    let scoreDiv = document.createElement("div");
    scoreDiv.className = `rank-${index + 1}`;
    scoreDiv.innerText = `#${index + 1} Score: ${score}`;
    scoresContainer.appendChild(scoreDiv);
  });
}

// Function to load and display scores from localStorage when the page loads
function loadAndDisplayScores() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  updateLeaderboardDisplay(scores);
}

//On windows load display score.
window.onload = function () {
  loadAndDisplayScores();
  // Other initialization code...
};
