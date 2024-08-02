const Game = require("../models/gameModel");
const { createInitialBoard } = require("../helpers/board");

let waitingPlayer = null;

function saveGameToRedis(redisClient, gameId, gameState) {
  if (redisClient.isOpen) {
    redisClient.set(gameId, JSON.stringify(gameState), (err) => {
      if (err) {
        console.error("Error saving game state to Redis:", err);
      }
    });
  } else {
    console.error("Redis client is not open.");
  }
}

exports.initializeSocket = (io, socket, redisClient) => {
  socket.on("joinQueue", async () => {
    if (waitingPlayer) {
      const game = new Game();
      game.board = createInitialBoard();

      const player1 = game.players.create({
        name: "Player 1",
        color: "blue",
        squares: [],
      });
      const player2 = game.players.create({
        name: "Player 2",
        color: "red",
        squares: [],
      });

      game.players.push(player1, player2);

      game.board[0].owner = player1._id;
      game.board[143].owner = player2._id;

      player1.squares.push(game.board[0]._id);
      player2.squares.push(game.board[143]._id);

      await game.save();

      saveGameToRedis(redisClient, game._id.toString(), game);

      socket.emit("startGame", { gameId: game._id, player: player2 });
      waitingPlayer.emit("startGame", { gameId: game._id, player: player1 });

      waitingPlayer.on("startGame", ({ gameId, player }) => {
        socket.emit(
          "redirect",
          `/game.html?gameId=${gameId}&player=${player._id}`
        );
      });

      socket.on("startGame", ({ gameId, player }) => {
        socket.emit(
          "redirect",
          `/game.html?gameId=${gameId}&player=${player._id}`
        );
      });

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit("waitingForPlayer");
    }
  });

  socket.on("disconnect", () => {
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
  });

  socket.on("makeMove", async (data) => {
    const { gameId, move } = data;
    try {
      const game = await Game.findById(gameId);
      game.applyMove(move);
      await game.save();
      saveGameToRedis(redisClient, gameId.toString(), game);
      io.in(gameId).emit("moveMade", move);
    } catch (err) {
      console.error("Error making move:", err);
      socket.emit("error", err.message);
    }
  });

  socket.on("joinGame", async (gameId) => {
    redisClient.get(gameId, (err, gameState) => {
      if (err) {
        console.error("Error retrieving game state from Redis:", err);
        socket.emit("error", err.message);
      } else {
        socket.join(gameId);
        socket.emit("gameState", JSON.parse(gameState));
      }
    });
  });
};
