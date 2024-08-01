// js/game/timer.js

export class Timer {
  constructor(callback) {
    this.turnTime = 30;
    this.turnTimer = null;
    this.callback = callback;
  }

  start() {
    this.reset();
    this.turnTimer = setInterval(() => {
      this.turnTime -= 1;
      this.callback(this.turnTime);
      if (this.turnTime <= 0) {
        this.stop();
      }
    }, 1000);
  }

  reset() {
    this.stop();
    this.turnTime = 30;
    this.callback(this.turnTime);
  }

  stop() {
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
  }
}
