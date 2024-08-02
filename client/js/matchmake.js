import { io } from "socket.io-client";

const socket = io();

socket.on("connect", () => {
  console.log("Connected to matchmaking server");
  socket.emit("joinMatchmaking");
});

socket.on("matchFound", (gameId) => {
  window.location.href = `game.html?gameId=${gameId}`;
});
