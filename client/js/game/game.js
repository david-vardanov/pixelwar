import { Square } from "../square.js";
import { Player } from "../player.js";
import { Timer } from "./timer.js";
import { updateUI } from "./ui.js";
import {
  handleSquareClick,
  transferSoldiers,
  attackSquare,
  checkEndTurn,
} from "./mechanics.js";

export class Game {
  constructor(gameState) {
    this.players = gameState.players.map((p) => new Player(p.name, p.color));
    this.board = gameState.board.map((s) => {
      const square = new Square(s.x, s.y, s.type);
      if (s.owner) {
        const owner = this.players.find((p) => p._id === s.owner);
        if (owner) {
          square.setOwner(owner);
          square.soldiers = s.soldiers;
          square.movePoints = s.movePoints;
          square.visible = s.visible;
        }
      }
      return square;
    });
    this.currentPlayerIndex = gameState.currentPlayerIndex;
    this.selectedSquare = null;
    this.timer = new Timer(this.updateTimer.bind(this));
    this.initGame();
  }

  initGame() {
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
