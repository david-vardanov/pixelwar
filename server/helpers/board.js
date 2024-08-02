const mongoose = require("mongoose");
const Square = require("../models/squareModel");

function createInitialBoard() {
  const board = [];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      board.push(
        new Square({
          x,
          y,
          type: "neutral",
          soldiers: 10,
          movePoints: 0,
          owner: null,
          visible: false,
        })
      );
    }
  }
  return board;
}

module.exports = { createInitialBoard };
