const mongoose = require("mongoose");

const SquareSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  type: { type: String, default: "neutral" },
  soldiers: { type: Number, default: 10 },
  movePoints: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
});

const GameSchema = new mongoose.Schema({
  board: [SquareSchema],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  currentPlayerIndex: { type: Number, default: 0 },
});

module.exports = mongoose.model("Game", GameSchema);
