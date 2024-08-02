import { Game } from "./game/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("gameId");
  const playerId = urlParams.get("player");
  const socket = io();
  let gameInstance;

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("joinGame", gameId);
  });

  socket.on("gameState", (game) => {
    console.log("Game state:", game);
    gameInstance = new Game(game, playerId);
    gameInstance.updateUI();
  });

  socket.on("moveMade", (move) => {
    if (gameInstance) {
      console.log("Move made:", move);
      gameInstance.applyMove(move);
      gameInstance.updateUI();
    } else {
      console.error("Game instance is not defined");
    }
  });

  document.getElementById("end-turn-btn").addEventListener("click", () => {
    if (gameInstance) {
      gameInstance.endTurn();
    } else {
      console.error("Game instance is not defined");
    }
  });

  // Redirect handling
  socket.on("redirect", (url) => {
    window.location.href = url;
  });
});
