const mongoose = require("mongoose");

const SquareSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  type: { type: String, default: "neutral" },
  soldiers: { type: Number, default: 10 },
  movePoints: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
  visible: { type: Boolean, default: false },
});

module.exports = mongoose.model("Square", SquareSchema);
