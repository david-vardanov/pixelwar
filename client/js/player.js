import { getRandomSoldierCount } from "./utils.js"; // Adjust the path as needed

export class Player {
  constructor(name, color, _id) {
    this.name = name;
    this.color = color;
    this._id = _id;
    this.squares = [];
  }

  refresh(board) {
    this.squares.forEach((square) => {
      const adjacentFriendlySquares = this.getAdjacentSquares(
        board,
        square
      ).filter((adjacentSquare) => adjacentSquare.owner === this).length;

      square.soldiers += Math.max(1, adjacentFriendlySquares);
      square.movePoints = 1;

      this.getAdjacentSquares(board, square).forEach((adjacentSquare) => {
        adjacentSquare.visible = true;
      });
    });
  }

  getAdjacentSquares(board, square) {
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
}
