//Using array to set the board
let board = [];
let score = 0;
let wonGame = false; //Default
let tile = document.querySelector(".tile");
tileContainer = document.querySelector(".tileContainer");
let scoreElement = document.getElementById("scoreElement");

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
  const alert = document.getElementById("alert");
  alert.style.display = "none"; // no alert message display yet
  tileContainer.innerHTML = ""; // Empty tile
  scoreElement.innerHTML = 0; // Set default score 0
  board = [];
  score = 0;
  wonGame = false;
  windows.addEventListener("keyDown", onDirectionKeyPress);
  createBoard();
  // Add 2 random tile onto the board upon game start
  addRandomTile();
  addRandomTile();
}

function continuePlaying() {
  const alert = document.getElementById("alert");
  alert.sstyle.display = "none";
  windows.addEventListener("keydown", onDirectionKeyPress);
}

window.addEventListener("keydown", onDirectionKeyPress);

//
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

  // if X not 0 then tile movement
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

//Wining Logic

//Losing Logic

// Scoreboard
