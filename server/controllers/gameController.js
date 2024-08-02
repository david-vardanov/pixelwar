const Game = require("../models/gameModel");
const { createInitialBoard } = require("../helpers/board");

let waitingPlayer = null;

exports.startGame = async (req, res) => {
  try {
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

    res.json(game);
  } catch (err) {
    console.error("Error starting game:", err);
    res.status(500).send(err.message);
  }
};

exports.handleMatchmaking = async (socket, io) => {
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

    io.to(socket.id).emit("matchFound", game._id);
    io.to(waitingPlayer).emit("matchFound", game._id);

    waitingPlayer = null;
  } else {
    waitingPlayer = socket.id;
  }
};

exports.getGameState = async (gameId, callback) => {
  const game = await Game.findById(gameId).populate("players").exec();
  callback(game);
};

exports.endTurn = async (gameId, io) => {
  const game = await Game.findById(gameId).populate("players").exec();
  game.currentPlayerIndex = 1 - game.currentPlayerIndex;
  await game.save();

  io.in(gameId).emit("updateGame", game);
};

exports.initializeSocket = (io, socket, redisClient) => {
  socket.on("joinGame", async (gameId) => {
    try {
      const game = await Game.findById(gameId).populate("players");
      socket.join(gameId);
      socket.emit("gameState", game);
    } catch (err) {
      console.error("Error joining game:", err);
      socket.emit("error", err.message);
    }
  });

  socket.on("makeMove", async (data) => {
    const { gameId, move } = data;
    try {
      const game = await Game.findById(gameId);
      game.applyMove(move);
      await game.save();
      io.in(gameId).emit("moveMade", move);
    } catch (err) {
      console.error("Error making move:", err);
      socket.emit("error", err.message);
    }
  });
};
