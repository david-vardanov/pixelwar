import { getRandomSoldierCount } from "./utils.js";

export class Square {
  constructor(x, y, type = "neutral") {
    this.x = x;
    this.y = y;
    this.type = type;
    this.soldiers = type === "neutral" ? getRandomSoldierCount() : 0;
    this.movePoints = 0;
    this.owner = null;
    this.visible = false;
  }

  setOwner(player) {
    if (!player) {
      throw new Error("Player is undefined in setOwner");
    }
    this.owner = player;
    this.type = "owned";
    this.soldiers = 11; // Each owned square starts with 11 soldiers
    this.movePoints = 1;
    player.squares.push(this);
    this.visible = true;
  }

  conquer(player) {
    if (this.owner) {
      this.owner.squares = this.owner.squares.filter(
        (square) => square !== this
      );
    }
    this.owner = player;
    this.type = "conquered";
    this.movePoints = 0; // Conquered squares have no move points initially
    player.squares.push(this);
    this.visible = true;
  }

  turnToOwned() {
    if (this.type === "conquered") {
      this.type = "owned";
      this.movePoints = 1;
    }
  }
}
