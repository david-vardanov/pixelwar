import { Game } from "./game/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("gameState", (game) => {
    console.log("Game state:", game);
    // Update the UI based on the game state
  });

  socket.on("moveMade", (move) => {
    console.log("Move made:", move);
    // Update the UI based on the move
  });

  const game = new Game();

  document.getElementById("end-turn-btn").addEventListener("click", () => {
    game.endTurn();
  });

  // Assume gameId is available
  const gameId = "some-game-id"; // This should be dynamically set
  socket.emit("joinGame", gameId);
});
