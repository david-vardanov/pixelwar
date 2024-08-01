// js/player.js

import { getAdjacentSquares } from "./game/board.js";

export class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.squares = [];
  }

  refresh(board) {
    this.squares.forEach((square) => {
      const adjacentFriendlySquares = getAdjacentSquares(board, square).filter(
        (adjacentSquare) => adjacentSquare.owner === this
      ).length;

      // Ensure at least one soldier is generated
      square.soldiers += Math.max(1, adjacentFriendlySquares);
      square.movePoints = 1;

      // Update visibility of adjacent squares
      getAdjacentSquares(board, square).forEach((adjacentSquare) => {
        adjacentSquare.visible = true;
      });
    });
  }
}
