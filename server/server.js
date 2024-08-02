const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const gameController = require("./controllers/gameController");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect("mongodb://localhost:27017/pixelwar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("client"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinMatchmaking", () => {
    gameController.handleMatchmaking(socket, io);
  });

  socket.on("joinGame", (gameId) => {
    socket.join(gameId);
    gameController.getGameState(gameId, (game) => {
      socket.emit("gameState", game);
    });
  });

  socket.on("endTurn", (gameId) => {
    gameController.endTurn(gameId, io);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
