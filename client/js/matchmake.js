document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("waitingForPlayer", () => {
    document.getElementById("status").innerText =
      "Waiting for another player to join...";
  });

  socket.on("startGame", (gameId) => {
    window.location.href = `game.html?gameId=${gameId}`;
  });

  socket.emit("joinGame");
});
