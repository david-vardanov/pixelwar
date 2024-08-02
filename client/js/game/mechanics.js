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

export function handleSquareClick(game, square) {
  const currentPlayer = game.players[game.currentPlayerIndex];

  if (game.selectedSquare) {
    if (square.owner === currentPlayer) {
      if (square !== game.selectedSquare) {
        transferSoldiers(game, game.selectedSquare, square);
      } else {
        game.selectedSquare = null;
      }
    } else if (square.type === "neutral" || square.owner !== currentPlayer) {
      if (
        getAdjacentSquares(game.board, game.selectedSquare).includes(square)
      ) {
        attackSquare(game, game.selectedSquare, square);
      }
    }
  } else if (square.owner === currentPlayer && square.movePoints > 0) {
    game.selectedSquare = square;
  }

  game.updateUI();
  if (checkEndTurn(game)) {
    game.endTurn();
  }
}

export function transferSoldiers(game, fromSquare, toSquare) {
  if (fromSquare.movePoints > 0 && fromSquare.soldiers > 0) {
    toSquare.soldiers += fromSquare.soldiers;
    fromSquare.soldiers = 0;
    fromSquare.movePoints -= 1;
  }
  game.selectedSquare = null;
}

export function attackSquare(game, fromSquare, toSquare) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  if (fromSquare.movePoints > 0 && fromSquare.soldiers > 0) {
    const soldiersAfterAttack = fromSquare.soldiers - toSquare.soldiers;
    if (soldiersAfterAttack > 0) {
      toSquare.conquer(currentPlayer);
      toSquare.soldiers = soldiersAfterAttack;
      fromSquare.soldiers = 0;
      fromSquare.movePoints = 0;
    } else {
      toSquare.soldiers -= fromSquare.soldiers;
      if (toSquare.soldiers < 0) toSquare.soldiers = 0;
      fromSquare.soldiers = 0;
      fromSquare.movePoints = 0;
    }
  }
  game.selectedSquare = null;
}

export function checkEndTurn(game) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  return currentPlayer.squares.every((square) => square.movePoints === 0);
}
