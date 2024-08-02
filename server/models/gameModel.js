const mongoose = require("mongoose");
const SquareSchema = require("./squareModel").schema;

const PlayerSchema = new mongoose.Schema({
  name: String,
  color: String,
  squares: [{ type: mongoose.Schema.Types.ObjectId, ref: "Square" }],
});

const GameSchema = new mongoose.Schema({
  board: [SquareSchema],
  players: [PlayerSchema],
  currentPlayerIndex: { type: Number, default: 0 },
});

module.exports = mongoose.model("Game", GameSchema);
