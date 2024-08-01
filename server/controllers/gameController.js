const Game = require("../models/gameModel");

exports.startGame = async (req, res) => {
  try {
    const game = new Game();
    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.initializeSocket = (io, socket, redisClient) => {
  socket.on("joinGame", async (gameId) => {
    socket.join(gameId);
    const game = await Game.findById(gameId);
    socket.emit("gameState", game);
  });

  socket.on("makeMove", async (data) => {
    const { gameId, move } = data;
    // Process the move
    const game = await Game.findById(gameId);
    // Assuming you have a method to apply the move to the game
    game.applyMove(move);
    await game.save();
    io.in(gameId).emit("moveMade", move);
  });
};
