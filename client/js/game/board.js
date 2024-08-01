import { Square } from "../square.js";

export function createBoard() {
  const board = [];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      board.push(new Square(x, y));
    }
  }
  return board;
}

export function getAdjacentSquares(board, square) {
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
