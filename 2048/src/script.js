// // Event Listner for keydown
// document.addEventListener("keydown", (e) => {
//   if (
//     e.key == "ArrowLeft" ||
//     e.key == "ArrowUp" ||
//     e.key == "ArrowDown" ||
//     e.key == "ArrowRight"
//   ) {
//     if (e.key == "ArrowLeft" && !e.repeat) {
//     }
//   }
// });

// function boxes() {
//   return Array.from(document.querySelectorAll(".box"));
// }

// function X(box) {
//   return Number(box.style.marginLeft.split("px")[0]);
// }

// function Y(box) {
//   return Number(box.type.marginTop.split("px")[0]);
// }

// function generateBox() {
//   let values = [0, 147, 294, 441];
//   let randomValueX;
//   let randomValueY;
//   let boxValues = boxes().map((box) => `${X(box)} ${Y(box)}`);

//   do {
//     randomValueX = values[Math.floor(Math.random() * values.length)];
//     randomValueY = values[Math.floor(Math.random() * values.length)];
//   } while (boxValues.includes(`${randomValueX} ${randomValueY}`));

//   let style = `margin-left:${randomValueX}px; margin-top:${randomValueY}px; background:#b53471;`;
//   document
//     .querySelector(`#game-board`)
//     .insertAdjacentHTML(
//       `beforeend`,
//       `<div class='box' style='${style}'>2</div>`
//     );
// }
// generateBox();
// generateBox();

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
      if (board[i][j] == 0) {
        emptyTiles.push(i, j);
      }
    }
  }
  let [randomI, randomJ] =
    emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[randomI][randomJ] = Math.random() < 0.9 ? 2 : 4; //90% of randomly generate a square with 2 or 10% square with 4
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
  tileContainer.appendChild(title);
  tile.classList.add("merged");
  tile.addEventListener("animationend", function () {
    this.title.classList.remove("merged"); //Animation when merged invoke remove()
  });
}
