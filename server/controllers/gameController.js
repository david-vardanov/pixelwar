const Game = require("../models/gameModel");

exports.startGame = async (req, res) => {
  try {
    const game = new Game();
    game.board = createInitialBoard();
    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).send(err);
  }
};

function createInitialBoard() {
  const board = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++) {
      board.push({
        x,
        y,
        type: "neutral",
        soldiers: 10,
        movePoints: 0,
        owner: null,
        visible: false,
      });
    }
  }
  return board;
}
