function getAdjacentSquares(board, square) {
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];
  return directions
    .map((dir) => {
      return board.find(
        (s) => s.x === square.x + dir.x && s.y === square.y + dir.y
      );
    })
    .filter(Boolean);
}

export function updateUI(game) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const player1 = game.players[0];
  const player2 = game.players[1];

  const player1NameElement = document.getElementById("player1-name");
  const player1SquaresElement = document.getElementById("player1-squares");
  const player1SoldiersElement = document.getElementById("player1-soldiers");
  const player1MovePointsElement = document.getElementById(
    "player1-move-points"
  );
  const player2NameElement = document.getElementById("player2-name");
  const player2SquaresElement = document.getElementById("player2-squares");
  const player2SoldiersElement = document.getElementById("player2-soldiers");
  const player2MovePointsElement = document.getElementById(
    "player2-move-points"
  );

  if (
    player1NameElement &&
    player1SquaresElement &&
    player1SoldiersElement &&
    player1MovePointsElement
  ) {
    player1NameElement.innerText = `${player1.name}`;
    player1SquaresElement.innerText = `Squares: ${player1.squares.length}`;
    player1SoldiersElement.innerText = `Soldiers: ${player1.squares.reduce(
      (sum, square) => sum + square.soldiers,
      0
    )}`;
    player1MovePointsElement.innerText = `Move Points: ${player1.squares.reduce(
      (sum, square) => sum + square.movePoints,
      0
    )}`;
  }

  if (
    player2NameElement &&
    player2SquaresElement &&
    player2SoldiersElement &&
    player2MovePointsElement
  ) {
    player2NameElement.innerText = `${player2.name}`;
    player2SquaresElement.innerText = `Squares: ${player2.squares.length}`;
    player2SoldiersElement.innerText = `Soldiers: ${player2.squares.reduce(
      (sum, square) => sum + square.soldiers,
      0
    )}`;
    player2MovePointsElement.innerText = `Move Points: ${player2.squares.reduce(
      (sum, square) => sum + square.movePoints,
      0
    )}`;
  }

  document.getElementById(
    "timer"
  ).innerText = `Time Left: ${game.timer.turnTime}s`;
  document.getElementById(
    "current-turn"
  ).innerText = `Current Turn: ${currentPlayer.name}`;

  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";
  game.board.forEach((square) => {
    const squareElement = document.createElement("div");
    squareElement.classList.add("square", square.type);
    if (square.owner) {
      const ownerIndex = game.players.findIndex(
        (player) => player._id === square.owner._id
      );
      squareElement.classList.add(`player${ownerIndex + 1}`);
      if (ownerIndex !== game.currentPlayerIndex) {
        squareElement.classList.add("inactive");
      }
    }
    if (game.selectedSquare === square) {
      squareElement.classList.add("selected");
    }
    if (square.movePoints > 0) {
      squareElement.classList.add("highlight-move");
    }
    if (
      game.selectedSquare &&
      game.selectedSquare.owner === currentPlayer &&
      square !== game.selectedSquare
    ) {
      if (square.type === "neutral" || square.owner !== currentPlayer) {
        if (
          getAdjacentSquares(game.board, game.selectedSquare).includes(square)
        ) {
          squareElement.classList.add("attackable");
        }
      } else if (square.owner === currentPlayer) {
        squareElement.classList.add("transferable");
      }
    }

    if (!square.visible) {
      squareElement.classList.add("fog-of-war");
    }

    squareElement.innerHTML = `<div class="info">${square.soldiers}</div>`;
    squareElement.addEventListener("click", () =>
      game.handleSquareClick(square)
    );
    boardElement.appendChild(squareElement);
  });

  // Set CSS grid template to match the 12x12 board
  boardElement.style.gridTemplateColumns = `repeat(12, 1fr)`; // Change to 12
  boardElement.style.gridTemplateRows = `repeat(12, 1fr)`; // Change to 12
}
