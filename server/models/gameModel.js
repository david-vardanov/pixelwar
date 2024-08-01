const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: String,
  color: String,
  squares: [{ type: mongoose.Schema.Types.ObjectId, ref: "Square" }],
});

const SquareSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  type: { type: String, default: "neutral" },
  soldiers: { type: Number, default: 10 },
  movePoints: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
  visible: { type: Boolean, default: false },
});

const GameSchema = new mongoose.Schema({
  board: [SquareSchema],
  players: [PlayerSchema],
  currentPlayerIndex: { type: Number, default: 0 },
});

module.exports = mongoose.model("Game", GameSchema);
