import { Player } from "../player.js";
import { createBoard, getAdjacentSquares } from "./board.js";
import { Timer } from "./timer.js";
import { updateUI } from "./ui.js";
import {
  handleSquareClick,
  transferSoldiers,
  attackSquare,
  checkEndTurn,
} from "./mechanics.js";

export class Game {
  constructor() {
    this.board = createBoard();
    this.players = [
      new Player("Player 1", "blue"),
      new Player("Player 2", "red"),
    ];
    this.currentPlayerIndex = 0;
    this.selectedSquare = null;
    this.timer = new Timer(this.updateTimer.bind(this));
    this.initGame();
  }

  initGame() {
    this.board[0].setOwner(this.players[0]);
    this.board[143].setOwner(this.players[1]);

    getAdjacentSquares(this.board, this.board[0]).forEach((adjacentSquare) => {
      adjacentSquare.visible = true;
    });
    getAdjacentSquares(this.board, this.board[143]).forEach(
      (adjacentSquare) => {
        adjacentSquare.visible = true;
      }
    );

    this.startTurn();
  }

  startTurn() {
    this.timer.start();
    this.updateUI();
  }

  updateTimer(timeLeft) {
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      this.endTurn();
    }
  }

  handleSquareClick(square) {
    handleSquareClick(this, square);
  }

  transferSoldiers(fromSquare, toSquare) {
    transferSoldiers(this, fromSquare, toSquare);
  }

  attackSquare(fromSquare, toSquare) {
    attackSquare(this, fromSquare, toSquare);
  }

  checkEndTurn() {
    return checkEndTurn(this);
  }

  endTurn() {
    this.timer.stop();
    this.players[this.currentPlayerIndex].squares.forEach((square) => {
      square.turnToOwned();
    });

    if (this.players.some((player) => player.squares.length === 0)) {
      this.endGame();
      return;
    }

    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    this.players[this.currentPlayerIndex].refresh(this.board);
    this.selectedSquare = null;
    this.startTurn();
  }

  endGame() {
    const winner = this.players.find((player) => player.squares.length > 0);
    alert(`${winner.name} wins the game!`);
  }

  updateUI() {
    updateUI(this);
  }
}
