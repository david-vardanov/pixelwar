import { Game } from "./game/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("gameState", (game) => {
    console.log("Game state:", game);
    const gameInstance = new Game(game);
    gameInstance.updateUI();
  });

  socket.on("moveMade", (move) => {
    console.log("Move made:", move);
    // Update the UI based on the move
  });

  // Create a new game and get the game ID
  fetch("/api/game/start", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((game) => {
      const gameId = game._id;
      socket.emit("joinGame", gameId);

      document.getElementById("end-turn-btn").addEventListener("click", () => {
        gameInstance.endTurn();
      });
    })
    .catch((error) => console.error("Error:", error));
});
